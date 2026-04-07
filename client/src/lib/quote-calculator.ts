import { QuoteRequest, QuoteResult } from "@shared/schema";

// ---------------------------------------------------------------------------
// Internal pricing constants (NOT visible to end users)
// ---------------------------------------------------------------------------

const NANNY_CUIDAR_RATES = {
  weekdayHour: 18,
  weekendHour: 25,
  transportDay: 12,
  adminFeeDay: 30,
  extraChildHour: 5,  // per child above 2
} as const;

const NANNY_DESENVOLVER_RATES = {
  weekdayHour: 22,
  weekendHour: 25,
  transportDay: 12,
  adminFeeDay: 30,
  extraChildHour: 5,  // per child above 2
} as const;

const EVENT_RATES = {
  weekdayHour: 40,
  weekendHour: 45,
  transportDay: 20,
  extraChildHour: 10, // per child above 2
} as const;

const TRAVEL_RATES = {
  dailyRate: 150,
  extraChildDaily: 40,
} as const;

const VALE_NIGHT_PACKAGES = {
  4:  { weekday: 160, weekend: 180 },
  6:  { weekday: 210, weekend: 230 },
  8:  { weekday: 230, weekend: 260 },
  12: { weekday: 280, weekend: 340 },
} as const;

const VALE_NIGHT_EXTRAS = {
  transportIncluded: 20,
  overtimeHour: 40,
  extraChildPackage: 50,
} as const;

const AULAS_RATES = {
  weekdayHour: 80,
  weekendHour: 90,
  monthly2x: 500,
  monthly3x: 600,
} as const;

// Monthly plan lookup tables
export const MONTHLY_PLANS_CUIDAR = {
  essencial:      { hoursLabel: "5 a 6 horas", daily: 130 },
  tranquilidade:  { hoursLabel: "7 a 8 horas", daily: 180 },
  premium:        { hoursLabel: "9 a 10 horas", daily: 225 },
} as const;

export const MONTHLY_PLANS_DESENVOLVER = {
  essencial:      { hoursLabel: "5 a 6 horas", daily: 150 },
  tranquilidade:  { hoursLabel: "7 a 8 horas", daily: 180 },
  premium:        { hoursLabel: "9 a 10 horas", daily: 225 },
} as const;

export const MONTHLY_EXTRAS = {
  overtimeHour: 30,
  extraTransport: 20,
} as const;

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function calculateQuote(data: QuoteRequest): QuoteResult {
  const date = new Date(data.date + "T12:00:00");
  const dayOfWeek = date.getDay();
  // For Vale Night: Friday (5) counts as weekend
  const isFridayOrWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  switch (data.serviceType) {
    case "Acompanhamento em Viagens":
      return calculateTravelQuote(data);

    case "Vale Night":
      return calculateValeNightQuote(data, isFridayOrWeekend);

    case "Acompanhamento em Eventos":
      return calculateEventQuote(data, isWeekend);

    case "Aulas Particulares":
      return calculateTutoringQuote(data, isWeekend);

    case "Nanny Cuidar":
    case "Nanny Desenvolver":
      return calculateNannyQuote(data, isWeekend);

    default:
      return calculateNannyQuote(data, isWeekend);
  }
}

// ---------------------------------------------------------------------------
// Nanny Cuidar / Desenvolver — personalised custom quote
// ---------------------------------------------------------------------------

function calculateNannyQuote(data: QuoteRequest, isWeekend: boolean): QuoteResult {
  const rates =
    data.serviceType === "Nanny Desenvolver"
      ? NANNY_DESENVOLVER_RATES
      : NANNY_CUIDAR_RATES;

  const durationHours = data.durationHours ?? 1;
  const startHourNum = data.startHour ? parseInt(data.startHour) : 8;
  const endHourNum = startHourNum + durationHours;

  const hourRate = isWeekend ? rates.weekendHour : rates.weekdayHour;
  const baseCost = durationHours * hourRate;

  const transportCost = rates.transportDay;
  const adminFee = rates.adminFeeDay;

  // Extra children: surcharge applies only above 2 children
  const extraChildren = Math.max(0, data.childrenCount - 2);
  const childSurcharge = extraChildren * durationHours * rates.extraChildHour;

  const total = baseCost + transportCost + adminFee + childSurcharge;

  const timeLabel = data.startHour
    ? ` (${String(startHourNum).padStart(2, "0")}h às ${String(endHourNum).padStart(2, "0")}h)`
    : "";

  const breakdown: QuoteResult["breakdown"] = [
    { item: `${durationHours}h de atendimento${timeLabel}`, amount: baseCost },
    { item: "Transporte", amount: transportCost },
    { item: "Taxa administrativa", amount: adminFee },
  ];

  if (childSurcharge > 0) {
    breakdown.push({
      item: `Adicional ${extraChildren} criança(s) (acima de 2)`,
      amount: childSurcharge,
    });
  }

  return {
    type: "hourly",
    breakdown,
    total,
    details: {
      hours: durationHours,
      isWeekend,
      extraChildren,
    },
  };
}

// ---------------------------------------------------------------------------
// Acompanhamento em Eventos
// ---------------------------------------------------------------------------

function calculateEventQuote(data: QuoteRequest, isWeekend: boolean): QuoteResult {
  const durationHours = data.durationHours ?? 1;
  const startHourNum = data.startHour ? parseInt(data.startHour) : 8;
  const endHourNum = startHourNum + durationHours;

  const hourRate = isWeekend ? EVENT_RATES.weekendHour : EVENT_RATES.weekdayHour;
  const baseCost = durationHours * hourRate;

  const transportCost = EVENT_RATES.transportDay;

  const extraChildren = Math.max(0, data.childrenCount - 2);
  const childSurcharge = extraChildren * durationHours * EVENT_RATES.extraChildHour;

  const total = baseCost + transportCost + childSurcharge;

  const timeLabel = data.startHour
    ? ` (${String(startHourNum).padStart(2, "0")}h às ${String(endHourNum).padStart(2, "0")}h)`
    : "";

  const breakdown: QuoteResult["breakdown"] = [
    { item: `${durationHours}h de atendimento${timeLabel}`, amount: baseCost },
    { item: "Transporte", amount: transportCost },
  ];

  if (childSurcharge > 0) {
    breakdown.push({
      item: `Adicional ${extraChildren} criança(s) (acima de 2)`,
      amount: childSurcharge,
    });
  }

  return {
    type: "hourly",
    breakdown,
    total,
    details: {
      hours: durationHours,
      isWeekend,
      extraChildren,
    },
  };
}

// ---------------------------------------------------------------------------
// Acompanhamento em Viagens
// ---------------------------------------------------------------------------

function calculateTravelQuote(data: QuoteRequest): QuoteResult {
  const days = data.travelDays || 1;
  const baseCost = days * TRAVEL_RATES.dailyRate;

  const extraChildren = Math.max(0, data.childrenCount - 1);
  const childSurcharge = extraChildren * TRAVEL_RATES.extraChildDaily;

  const breakdown: QuoteResult["breakdown"] = [
    { item: `${days} diária(s) de acompanhamento`, amount: baseCost },
  ];

  if (childSurcharge > 0) {
    breakdown.push({
      item: `Adicional ${extraChildren} criança(s) extra`,
      amount: childSurcharge,
    });
  }

  return {
    type: "travel",
    breakdown,
    total: baseCost + childSurcharge,
    details: {
      days,
      extraChildren,
      note: "Custos de hospedagem, alimentação e transporte são de responsabilidade da família.",
    },
  };
}

// ---------------------------------------------------------------------------
// Vale Night — package-based pricing with 4 tiers
// ---------------------------------------------------------------------------

function calculateValeNightQuote(data: QuoteRequest, isWeekendOrFriday: boolean): QuoteResult {
  const durationHours = data.durationHours ?? 4;

  // Map duration → closest package tier
  let tier: keyof typeof VALE_NIGHT_PACKAGES;
  if (durationHours <= 4) {
    tier = 4;
  } else if (durationHours <= 6) {
    tier = 6;
  } else if (durationHours <= 8) {
    tier = 8;
  } else {
    tier = 12;
  }

  const pkg = VALE_NIGHT_PACKAGES[tier];
  const baseCost = isWeekendOrFriday ? pkg.weekend : pkg.weekday;

  const extraChildren = Math.max(0, data.childrenCount - 1);
  const childSurcharge = extraChildren * VALE_NIGHT_EXTRAS.extraChildPackage;

  const tierLabels: Record<number, string> = {
    4: "Atendimento de 4 horas",
    6: "Atendimento de 6 horas",
    8: "Atendimento de 8 horas",
    12: "Noite completa (12h — 19h às 07h)",
  };

  const breakdown: QuoteResult["breakdown"] = [
    {
      item: `${tierLabels[tier]} (transporte incluso)`,
      amount: baseCost,
    },
  ];

  if (childSurcharge > 0) {
    breakdown.push({
      item: `Adicional ${extraChildren} criança(s) extra`,
      amount: childSurcharge,
    });
  }

  return {
    type: "vale_night",
    breakdown,
    total: baseCost + childSurcharge,
    details: {
      hours: durationHours,
      tier,
      isWeekendOrFriday,
      extraChildren,
      overtimeRate: VALE_NIGHT_EXTRAS.overtimeHour,
    },
  };
}

// ---------------------------------------------------------------------------
// Aulas Particulares
// ---------------------------------------------------------------------------

function calculateTutoringQuote(data: QuoteRequest, isWeekend: boolean): QuoteResult {
  const durationHours = data.durationHours ?? 1;

  const hourRate = isWeekend ? AULAS_RATES.weekendHour : AULAS_RATES.weekdayHour;
  const baseCost = durationHours * hourRate;

  const breakdown: QuoteResult["breakdown"] = [
    { item: `${durationHours}h de aula particular`, amount: baseCost },
  ];

  // Show monthly package info as reference
  breakdown.push({
    item: "Pacote mensal 2x/semana (referência)",
    amount: `R$ ${AULAS_RATES.monthly2x},00/mês`,
  });
  breakdown.push({
    item: "Pacote mensal 3x/semana (referência)",
    amount: `R$ ${AULAS_RATES.monthly3x},00/mês`,
  });

  return {
    type: "hourly",
    breakdown,
    total: baseCost,
    details: {
      hours: durationHours,
      isWeekend,
      monthlyPackages: {
        "2x/semana": AULAS_RATES.monthly2x,
        "3x/semana": AULAS_RATES.monthly3x,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Formatting helper
// ---------------------------------------------------------------------------

export function formatCurrency(amount: number | string): string {
  if (typeof amount === "string") return amount;
  return `R$ ${amount.toFixed(2).replace(".", ",")}`;
}

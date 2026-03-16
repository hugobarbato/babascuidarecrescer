import { QuoteRequest, QuoteResult } from "@shared/schema";

export function calculateQuote(data: QuoteRequest): QuoteResult {
  const date = new Date(data.date + 'T12:00:00');
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
  switch(data.serviceType) {
    case 'Acompanhamento em Viagens':
      return calculateTravelQuote(data);
    
    case 'Mensalista':
      return calculateMonthlyQuote(data);
    
    case 'Vale Night':
      return calculateValeNightQuote(data, isWeekend);
    
    default:
      return calculateHourlyQuote(data, isWeekend);
  }
}

function calculateHourlyQuote(data: QuoteRequest, isWeekend: boolean): QuoteResult {
  const durationHours = data.durationHours ?? 1;
  const startHourNum = data.startHour ? parseInt(data.startHour) : 8;
  const endHourNum = startHourNum + durationHours;

  const isDeveloper = data.serviceType === 'Nanny Desenvolver';
  const firstHourRate = isDeveloper ? (isWeekend ? 80 : 70) : (isWeekend ? 60 : 50);
  const additionalHourRate = isDeveloper ? (isWeekend ? 30 : 25) : (isWeekend ? 35 : 30);

  let baseCost = firstHourRate;
  if (durationHours > 1) {
    baseCost += (durationHours - 1) * additionalHourRate;
  }

  // Hours after 22:00
  const hoursAfter22 = Math.max(0, endHourNum - 22);
  const nightSurcharge = hoursAfter22 > 0 ? hoursAfter22 * 5 : 0;

  const extraChildren = data.childrenCount - 1;
  const childSurcharge = extraChildren > 0 ? extraChildren * durationHours * 10 : 0;

  const total = baseCost + nightSurcharge + childSurcharge;

  const timeLabel = data.startHour
    ? ` (${String(startHourNum).padStart(2,'0')}h às ${String(endHourNum).padStart(2,'0')}h)`
    : '';

  const breakdown = [
    { item: `${durationHours}h de atendimento${timeLabel}`, amount: baseCost }
  ];

  if (nightSurcharge > 0) {
    breakdown.push({ item: `Adicional noturno (${hoursAfter22}h após 22h)`, amount: nightSurcharge });
  }

  if (childSurcharge > 0) {
    breakdown.push({ item: `Adicional ${extraChildren} criança(s) extra`, amount: childSurcharge });
  }

  return {
    type: 'hourly',
    breakdown,
    total,
    details: {
      hours: durationHours,
      isWeekend,
      hasNightSurcharge: nightSurcharge > 0,
      extraChildren
    }
  };
}

function calculateTravelQuote(data: QuoteRequest): QuoteResult {
  const days = data.travelDays || 1;
  const baseCost = days * 200;
  const extraChildren = data.childrenCount - 1;
  const childSurcharge = extraChildren > 0 ? extraChildren * days * 50 : 0;
  
  const breakdown = [
    { item: `${days} diária(s) de acompanhamento`, amount: baseCost }
  ];
  
  if (childSurcharge > 0) {
    breakdown.push({ item: `${extraChildren} criança(s) extra (${days} dias)`, amount: childSurcharge });
  }
  
  return {
    type: 'travel',
    breakdown,
    total: baseCost + childSurcharge,
    details: {
      days,
      extraChildren
    }
  };
}

function calculateValeNightQuote(data: QuoteRequest, isWeekend: boolean): QuoteResult {
  const durationHours = data.durationHours ?? 4;
  const isMidTurn = durationHours <= 5;

  let baseCost;
  if (isMidTurn) {
    baseCost = isWeekend ? 180 : 150;
  } else {
    baseCost = isWeekend ? 300 : 280;
  }

  const extraChildren = data.childrenCount - 1;
  const childSurcharge = extraChildren > 0 ? extraChildren * (isMidTurn ? 50 : 100) : 0;

  const breakdown = [
    { item: `${isMidTurn ? 'Meio turno' : 'Turno completo'} (${durationHours}h)`, amount: baseCost }
  ];

  if (childSurcharge > 0) {
    breakdown.push({ item: `${extraChildren} criança(s) extra`, amount: childSurcharge });
  }

  return {
    type: 'vale_night',
    breakdown,
    total: baseCost + childSurcharge,
    details: {
      hours: durationHours,
      isMidTurn,
      isWeekend,
      extraChildren
    }
  };
}

function calculateMonthlyQuote(data: QuoteRequest): QuoteResult {
  return {
    type: 'monthly',
    breakdown: [
      { item: 'Orçamento personalizado', amount: 'A definir' }
    ],
    total: 'A partir de R$ 2.800,00',
    details: {
      isCustom: true
    }
  };
}

export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'string') return amount;
  return `R$ ${amount.toFixed(2).replace('.', ',')}`;
}

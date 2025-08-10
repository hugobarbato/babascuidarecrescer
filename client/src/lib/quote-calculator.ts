import { QuoteRequest, QuoteResult } from "@shared/schema";

export function calculateQuote(data: QuoteRequest): QuoteResult {
  const date = new Date(data.date);
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
  if (!data.startTime || !data.endTime) {
    throw new Error("Horários de início e fim são obrigatórios");
  }

  const startTime = new Date(`2024-01-01T${data.startTime}`);
  const endTime = new Date(`2024-01-01T${data.endTime}`);
  const totalHours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
  
  // Adjust for overnight services
  const adjustedHours = totalHours < 0 ? totalHours + 24 : totalHours;
  
  // Base rates - Nanny Desenvolver has higher rates
  const isDeveloper = data.serviceType === 'Nanny Desenvolver';
  const firstHourRate = isDeveloper ? (isWeekend ? 80 : 70) : (isWeekend ? 60 : 50);
  const additionalHourRate = isDeveloper ? (isWeekend ? 30 : 25) : (isWeekend ? 35 : 30);
  
  // Calculate base cost
  let baseCost = firstHourRate;
  if (adjustedHours > 1) {
    baseCost += (adjustedHours - 1) * additionalHourRate;
  }
  
  // After 22h surcharge
  let nightSurcharge = 0;
  if (endTime.getHours() >= 22 || startTime.getHours() >= 22 || endTime < startTime) {
    nightSurcharge = adjustedHours * 5;
  }
  
  // Extra children
  const extraChildren = data.childrenCount - 1;
  const childSurcharge = extraChildren > 0 ? extraChildren * adjustedHours * 10 : 0;
  
  const total = baseCost + nightSurcharge + childSurcharge;
  
  const breakdown = [
    { item: `${adjustedHours}h de atendimento`, amount: baseCost }
  ];
  
  if (nightSurcharge > 0) {
    breakdown.push({ item: 'Adicional noturno (após 22h)', amount: nightSurcharge });
  }
  
  if (childSurcharge > 0) {
    breakdown.push({ item: `Adicional ${extraChildren} criança(s) extra`, amount: childSurcharge });
  }
  
  return {
    type: 'hourly',
    breakdown,
    total,
    details: {
      hours: adjustedHours,
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
  if (!data.startTime || !data.endTime) {
    throw new Error("Horários de início e fim são obrigatórios");
  }

  const startTime = new Date(`2024-01-01T${data.startTime}`);
  const endTime = new Date(`2024-01-01T${data.endTime}`);
  let totalHours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
  
  // Adjust for overnight services
  if (totalHours < 0) {
    totalHours += 24;
  }
  
  let baseCost;
  let isMidTurn = totalHours <= 5;
  
  if (isMidTurn) {
    baseCost = isWeekend ? 180 : 150;
  } else {
    baseCost = isWeekend ? 300 : 280;
  }
  
  const extraChildren = data.childrenCount - 1;
  const childSurcharge = extraChildren > 0 ? extraChildren * (isMidTurn ? 50 : 100) : 0;
  
  const breakdown = [
    { item: `${isMidTurn ? 'Meio turno' : 'Turno completo'} (${totalHours}h)`, amount: baseCost }
  ];
  
  if (childSurcharge > 0) {
    breakdown.push({ item: `${extraChildren} criança(s) extra`, amount: childSurcharge });
  }
  
  return {
    type: 'vale_night',
    breakdown,
    total: baseCost + childSurcharge,
    details: {
      hours: totalHours,
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

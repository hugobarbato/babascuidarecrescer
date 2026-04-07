const WHATSAPP_NUMBER = "5513998090998";

interface LeadData {
  clientName: string;
  serviceType: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export function buildWhatsAppUrl(data: LeadData): string {
  const location =
    data.neighborhood && data.city && data.state
      ? ` e estou em ${data.neighborhood}, ${data.city} - ${data.state}`
      : data.city && data.state
      ? ` e estou em ${data.city} - ${data.state}`
      : "";

  const message =
    `Olá! Me chamo ${data.clientName}, tenho interesse no serviço ${data.serviceType}${location}. Gostaria de mais informações sobre disponibilidade e valores.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

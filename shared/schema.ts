import { z } from "zod";

export const quoteRequestSchema = z.object({
  serviceType: z.enum([
    "Nanny Cuidar",
    "Nanny Desenvolver",
    "Vale Night",
    "Acompanhamento em Eventos",
    "Acompanhamento em Viagens",
    "Mensalista"
  ]),
  date: z.string().min(1, "Selecione uma data"),
  clientName: z.string().min(2, "Informe seu nome"),
  childrenCount: z.number().min(1),

  // Hourly services — start hour (e.g. "8") + duration in hours
  startHour: z.string().optional(),
  durationHours: z.number().optional(),

  // Travel
  travelDays: z.number().optional(),

  // Monthly plan
  weekDays: z.array(z.string()).optional(),
  dailyHours: z.number().optional(),

  // Address (CEP-driven)
  cep: z.string().optional(),
  street: z.string().optional(),
  streetNumber: z.string().optional(),
  streetComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),

  // Optional notes
  observations: z.string().optional(),

  // Legacy — kept as optional for backward compat
  clientPhone: z.string().optional(),
  clientEmail: z.string().optional(),
  lgpdConsent: z.boolean().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  serviceType: z.string().optional(),
  message: z.string().optional(),
  lgpdConsent: z.boolean().refine(val => val === true, {
    message: "Você deve concordar com o uso dos dados"
  })
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;

export interface QuoteResult {
  type: 'hourly' | 'travel' | 'vale_night' | 'monthly';
  breakdown: Array<{
    item: string;
    amount: number | string;
  }>;
  total: number | string;
  details: Record<string, any>;
}

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
  date: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  travelDays: z.number().optional(),
  childrenCount: z.number().min(1),
  address: z.string().min(1),
  clientName: z.string().min(1),
  clientPhone: z.string().min(1),
  clientEmail: z.string().email(),
  observations: z.string().optional(),
  lgpdConsent: z.boolean().refine(val => val === true, {
    message: "Você deve concordar com o uso dos dados"
  })
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

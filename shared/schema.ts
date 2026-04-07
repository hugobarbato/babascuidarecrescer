import { z } from "zod";

export const quoteRequestSchema = z.object({
  serviceType: z.enum([
    "Nanny Cuidar",
    "Nanny Desenvolver",
    "Vale Night",
    "Aulas Particulares",
    "Acompanhamento em Eventos",
    "Acompanhamento em Viagens"
  ]),
  packageType: z.enum([
    "personalizado",
    "essencial",
    "tranquilidade",
    "premium"
  ]).optional(),
  date: z.string().min(1, "Selecione uma data"),
  clientName: z.string().min(2, "Informe seu nome"),
  childrenCount: z.number().min(1),

  // Hourly services — start hour (e.g. "8") + duration in hours
  startHour: z.string().optional(),
  durationHours: z.number().optional(),

  // Travel
  travelDays: z.number().optional(),

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

  // Contact info
  clientPhone: z.string().optional(),
  clientEmail: z.string().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  phone: z.string().min(14, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  serviceType: z.string().optional(),
  message: z.string().optional(),
});

export const jobApplicationSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  phone: z.string().min(14, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  city: z.string().min(2, "Informe sua cidade/região"),
  experience: z.string().optional(),
  courses: z.string().optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type JobApplication = z.infer<typeof jobApplicationSchema>;

export interface QuoteResult {
  type: 'hourly' | 'travel' | 'vale_night';
  breakdown: Array<{
    item: string;
    amount: number | string;
  }>;
  total: number | string;
  details: Record<string, any>;
}

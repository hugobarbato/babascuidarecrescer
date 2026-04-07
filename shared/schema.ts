import { z } from "zod";

export const leadCaptureSchema = z.object({
  serviceType: z.string().min(1, "Selecione um serviço"),
  clientName: z.string().min(2, "Informe seu nome"),
  cep: z.string().min(8, "CEP inválido"),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  // E-mail path only — both required together when present
  clientPhone: z.string().min(14, "WhatsApp inválido").optional(),
  clientEmail: z.string().email("E-mail inválido").optional(),
}).refine(
  (data) => {
    const hasPhone = !!data.clientPhone;
    const hasEmail = !!data.clientEmail;
    return hasPhone === hasEmail;
  },
  {
    message: "Forneça tanto telefone quanto e-mail, ou nenhum dos dois",
    path: ["clientEmail"],
  }
);

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

export type LeadCapture = z.infer<typeof leadCaptureSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type JobApplication = z.infer<typeof jobApplicationSchema>;

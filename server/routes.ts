import type { Express } from "express";
import { createServer, type Server } from "http";
import { ZodError } from "zod";
import { leadCaptureSchema, contactFormSchema, jobApplicationSchema, LeadCapture, ContactForm, JobApplication } from "@shared/schema";
import { sendContactEmail, sendLeadEmail, sendJobApplicationEmail } from "./email";
import { verifyRecaptchaToken } from "./recaptcha";

export async function registerRoutes(app: Express): Promise<Server> {

  app.post("/api/send-lead", async (req, res) => {
    try {
      const { recaptchaToken, ...body } = req.body;

      const captchaOk = await verifyRecaptchaToken(recaptchaToken);
      if (!captchaOk) {
        return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
      }

      const validated = leadCaptureSchema.parse(body);

      try {
        await sendLeadEmail(validated);
      } catch (emailErr) {
        console.error("[send-lead] Falha ao enviar e-mail:", emailErr);
      }

      res.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ success: false, message: "Dados inválidos: " + error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ") });
      }
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Erro ao enviar mensagem" });
    }
  });

  app.post("/api/send-contact", async (req, res) => {
    console.log("[send-contact] body recebido:", JSON.stringify(req.body, null, 2));
    try {
      const { recaptchaToken: contactCaptchaToken, ...contactBody } = req.body;

      console.log("[send-contact] recaptchaToken presente:", !!contactCaptchaToken);

      const captchaOk = await verifyRecaptchaToken(contactCaptchaToken);
      if (!captchaOk) {
        console.warn("[send-contact] reCAPTCHA falhou.");
        return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
      }

      console.log("[send-contact] reCAPTCHA ok. Validando schema...");
      const validatedContact = contactFormSchema.parse(contactBody);
      console.log("[send-contact] Schema válido. Enviando e-mail...");

      try {
        await sendContactEmail(validatedContact);
        console.log("[send-contact] E-mail enviado com sucesso.");
      } catch (emailErr) {
        console.error("[send-contact] Falha ao enviar e-mail:", emailErr);
      }

      res.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("[send-contact] Erro de validação Zod:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ success: false, message: "Dados inválidos: " + error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ") });
      }
      console.error("[send-contact] Erro inesperado:", error);
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Erro ao enviar mensagem" });
    }
  });

  app.post("/api/send-job-application", async (req, res) => {
    console.log("[send-job-application] body recebido:", JSON.stringify(req.body, null, 2));
    try {
      const { recaptchaToken: jobCaptchaToken, ...jobBody } = req.body;

      console.log("[send-job-application] recaptchaToken presente:", !!jobCaptchaToken);

      const captchaOk = await verifyRecaptchaToken(jobCaptchaToken);
      if (!captchaOk) {
        console.warn("[send-job-application] reCAPTCHA falhou.");
        return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
      }

      console.log("[send-job-application] reCAPTCHA ok. Validando schema...");
      const validatedApplication = jobApplicationSchema.parse(jobBody);
      console.log("[send-job-application] Schema válido. Enviando e-mail...");

      try {
        await sendJobApplicationEmail(validatedApplication);
        console.log("[send-job-application] E-mail enviado com sucesso.");
      } catch (emailErr) {
        console.error("[send-job-application] Falha ao enviar e-mail:", emailErr);
      }

      res.json({ success: true, message: "Cadastro enviado com sucesso!" });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("[send-job-application] Erro de validação Zod:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ success: false, message: "Dados inválidos: " + error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ") });
      }
      console.error("[send-job-application] Erro inesperado:", error);
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Erro ao enviar cadastro" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { ZodError } from "zod";
import { quoteRequestSchema, contactFormSchema, QuoteRequest, ContactForm, QuoteResult } from "@shared/schema";
import { sendContactEmail, sendQuoteEmail } from "./email";
import { verifyRecaptchaToken } from "./recaptcha";

export async function registerRoutes(app: Express): Promise<Server> {

  app.post("/api/send-quote", async (req, res) => {
    console.log("[send-quote] body recebido:", JSON.stringify(req.body, null, 2));
    try {
      const { quoteData, quoteResult, recaptchaToken } = req.body;

      console.log("[send-quote] recaptchaToken presente:", !!recaptchaToken);

      const captchaOk = await verifyRecaptchaToken(recaptchaToken);
      if (!captchaOk) {
        console.warn("[send-quote] reCAPTCHA falhou.");
        return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
      }

      console.log("[send-quote] reCAPTCHA ok. Validando schema...");
      const validatedQuote = quoteRequestSchema.parse(quoteData);
      console.log("[send-quote] Schema válido. Enviando e-mail...");

      try {
        await sendQuoteEmail(validatedQuote, quoteResult);
        console.log("[send-quote] E-mail enviado com sucesso.");
      } catch (emailErr) {
        console.error("[send-quote] Falha ao enviar e-mail:", emailErr);
      }

      res.json({ success: true, message: "Orçamento enviado com sucesso!" });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("[send-quote] Erro de validação Zod:", JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ success: false, message: "Dados inválidos: " + error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ") });
      }
      console.error("[send-quote] Erro inesperado:", error);
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Erro ao enviar orçamento" });
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

  const httpServer = createServer(app);
  return httpServer;
}

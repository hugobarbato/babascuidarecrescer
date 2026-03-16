import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { quoteRequestSchema, contactFormSchema, QuoteRequest, ContactForm, QuoteResult } from "@shared/schema";
import { sendContactEmail, sendQuoteEmail } from "./email";
import { verifyRecaptchaToken } from "./recaptcha";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Send quote email endpoint
  app.post("/api/send-quote", async (req, res) => {
    try {
      const { quoteData, quoteResult, recaptchaToken } = req.body;

      // Verify CAPTCHA
      const captchaOk = await verifyRecaptchaToken(recaptchaToken);
      if (!captchaOk) {
        return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
      }

      // Validate input
      const validatedQuote = quoteRequestSchema.parse(quoteData);
      
      try {
        await sendQuoteEmail(validatedQuote, quoteResult);
      } catch (emailErr) {
        console.error("[email] Falha ao enviar e-mail de orçamento:", emailErr);
      }

      res.json({ success: true, message: "Orçamento enviado com sucesso!" });
    } catch (error) {
      console.error("Error sending quote email:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Erro ao enviar orçamento" 
      });
    }
  });

  // Send contact email endpoint
  app.post("/api/send-contact", async (req, res) => {
    try {
      const { recaptchaToken: contactCaptchaToken, ...contactBody } = req.body;

      // Verify CAPTCHA
      const captchaOk = await verifyRecaptchaToken(contactCaptchaToken);
      if (!captchaOk) {
        return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
      }

      const validatedContact = contactFormSchema.parse(contactBody);
      
      try {
        await sendContactEmail(validatedContact);
      } catch (emailErr) {
        console.error("[email] Falha ao enviar e-mail de contato:", emailErr);
      }

      res.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      console.error("Error sending contact email:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Erro ao enviar mensagem" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

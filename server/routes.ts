import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { quoteRequestSchema, contactFormSchema, QuoteRequest, ContactForm, QuoteResult } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Send quote email endpoint
  app.post("/api/send-quote", async (req, res) => {
    try {
      const { quoteData, quoteResult } = req.body;
      
      // Validate input
      const validatedQuote = quoteRequestSchema.parse(quoteData);
      
      // TODO: Implement actual email sending
      // For now, we'll simulate the email sending
      console.log("Quote email would be sent:", {
        to: process.env.COMPANY_EMAIL || "contato@cuidarecrescer.com.br",
        subject: `Novo orçamento - ${validatedQuote.serviceType} - ${validatedQuote.address} - ${validatedQuote.date}`,
        quoteData: validatedQuote,
        quoteResult
      });

      // Also send copy to client
      console.log("Quote copy would be sent to client:", {
        to: validatedQuote.clientEmail,
        subject: "Resumo da sua solicitação - Cuidar & Crescer",
        quoteData: validatedQuote,
        quoteResult
      });

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
      const validatedContact = contactFormSchema.parse(req.body);
      
      // TODO: Implement actual email sending
      console.log("Contact email would be sent:", {
        to: process.env.COMPANY_EMAIL || "contato@cuidarecrescer.com.br",
        subject: `Nova mensagem de contato - ${validatedContact.name}`,
        contactData: validatedContact
      });

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

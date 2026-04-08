import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { contactFormSchema } from "../shared/schema.js";
import { sendContactEmail } from "../server/email.js";
import { verifyRecaptchaToken } from "../server/recaptcha.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { recaptchaToken, ...body } = req.body as Record<string, unknown>;

    const captchaOk = await verifyRecaptchaToken(recaptchaToken as string | undefined);
    if (!captchaOk) {
      return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
    }

    const validated = contactFormSchema.parse(body);

    try {
      await sendContactEmail(validated);
    } catch (emailErr) {
      console.error("[send-contact] Falha ao enviar e-mail:", emailErr);
    }

    return res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos: " + error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      });
    }
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Erro ao enviar mensagem",
    });
  }
}

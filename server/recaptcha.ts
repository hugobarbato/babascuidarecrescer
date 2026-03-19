/**
 * Verificação do token Google reCAPTCHA v3 no servidor.
 * v3 retorna um score (0.0–1.0) em vez de pass/fail.
 * Se RECAPTCHA_SECRET_KEY não estiver configurado, a verificação é ignorada.
 */
export async function verifyRecaptchaToken(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.warn("[recaptcha] RECAPTCHA_SECRET_KEY não configurado — verificação ignorada.");
    return true;
  }

  if (!token || token.trim() === "") {
    console.warn("[recaptcha] Token ausente.");
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    console.log("[recaptcha] Resposta:", JSON.stringify(data));

    if (!data.success) {
      console.warn("[recaptcha] Token inválido:", data["error-codes"]);
      return false;
    }

    // v3: score 1.0 = humano, 0.0 = bot. Threshold recomendado: 0.5
    if (data.score !== undefined && data.score < 0.5) {
      console.warn(`[recaptcha] Score baixo (${data.score}) — possível bot.`);
      return false;
    }

    console.log(`[recaptcha] OK. Score: ${data.score ?? "n/a"} | Action: ${data.action ?? "n/a"}`);
    return true;
  } catch (err) {
    console.error("[recaptcha] Erro de rede — verificação ignorada:", err);
    return true;
  }
}

/**
 * Verificação do token Google reCAPTCHA v2 no servidor.
 * Se RECAPTCHA_SECRET_KEY não estiver configurado, a verificação é ignorada
 * (útil para desenvolvimento local antes de registrar as chaves).
 */
export async function verifyRecaptchaToken(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Se não houver chave configurada, pular verificação
  if (!secret) {
    console.warn("[recaptcha] RECAPTCHA_SECRET_KEY não configurado — verificação ignorada.");
    return true;
  }

  if (!token || token.trim() === "") {
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = (await response.json()) as { success: boolean; "error-codes"?: string[] };

    if (!data.success) {
      console.warn("[recaptcha] Token inválido:", data["error-codes"]);
    }

    return data.success === true;
  } catch (err) {
    console.error("[recaptcha] Erro ao verificar token:", err);
    // Em caso de falha de rede com o Google, não bloquear o usuário
    return true;
  }
}

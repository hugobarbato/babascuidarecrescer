import { Resend } from "resend";
import { ContactForm, JobApplication, LeadCapture } from "@shared/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "espacocuidarecrescer@gmail.com";
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "Cuidar & Crescer <noreply@babascuidarecrescer.com.br>";
const COMPANY_NAME = "Cuidar & Crescer";
const WHATSAPP_NUMBER = "5513998090998";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emailWrapper(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f9f5f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5f0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#f97316 0%,#fb923c 100%);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">${COMPANY_NAME}</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.88);font-size:14px;">Cuidado com amor e profissionalismo 💛</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fef3e2;padding:24px 40px;text-align:center;border-top:1px solid #fed7aa;">
            <p style="margin:0;color:#9a7648;font-size:12px;line-height:1.6;">
              ${COMPANY_NAME} · <a href="https://wa.me/${WHATSAPP_NUMBER}" style="color:#f97316;text-decoration:none;">WhatsApp</a><br/>
              Você pode responder este e-mail diretamente — nossa equipe retornará em breve.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function row(label: string, value: string | number | undefined): string {
  if (!value && value !== 0) return "";
  return `
    <tr>
      <td style="padding:8px 0;color:#6b7280;font-size:14px;width:45%;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:500;vertical-align:top;">${value}</td>
    </tr>`;
}

function section(title: string, rows: string): string {
  return `
    <h3 style="margin:24px 0 12px;color:#f97316;font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #fed7aa;padding-bottom:6px;">${title}</h3>
    <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  `;
}

// ---------------------------------------------------------------------------
// sendContactEmail
// TO: cliente | CC + Reply-To: empresa
// ---------------------------------------------------------------------------

export async function sendContactEmail(data: ContactForm): Promise<void> {
  const body = `
    <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">Olá, ${data.name}! 👋</p>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Recebemos sua mensagem e em breve nossa equipe entrará em contato. Aqui está o resumo do que você enviou:
    </p>

    ${section("Sua mensagem", [
      row("Nome", data.name),
      row("Telefone / WhatsApp", data.phone),
      row("E-mail", data.email),
      row("Serviço de interesse", data.serviceType || "Não informado"),
    ].join(""))}

    ${data.message ? section("Mensagem", `
      <tr><td colspan="2" style="padding:8px 0;">
        <div style="background:#f9f5f0;border-left:4px solid #f97316;padding:16px;border-radius:0 8px 8px 0;color:#374151;font-size:14px;line-height:1.6;">${data.message.replace(/\n/g, "<br/>")}</div>
      </td></tr>
    `) : ""}

    <div style="margin-top:32px;text-align:center;">
      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Olá!+Vi+minha+mensagem+no+site+da+${encodeURIComponent(COMPANY_NAME)}+e+gostaria+de+conversar."
         style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
        💬 Falar pelo WhatsApp
      </a>
    </div>
  `;

  await resend.emails.send({
    from: RESEND_FROM,
    to: data.email,
    cc: COMPANY_EMAIL,
    replyTo: COMPANY_EMAIL,
    subject: `Recebemos sua mensagem — ${COMPANY_NAME}`,
    html: emailWrapper(`Mensagem recebida — ${data.name}`, body),
  });
}

// ---------------------------------------------------------------------------
// sendJobApplicationEmail
// TO: empresa | CC + Reply-To: candidata
// ---------------------------------------------------------------------------

export async function sendJobApplicationEmail(data: JobApplication): Promise<void> {
  // Email para a empresa com os dados da candidata
  const companyBody = `
    <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">Nova candidata — Trabalhe Conosco 📋</p>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Recebido em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} pelo formulário "Trabalhe Conosco".
    </p>

    ${section("Dados da candidata", [
      row("Nome", data.name),
      row("Telefone / WhatsApp", data.phone),
      row("E-mail", data.email),
      row("Cidade / Região", data.city),
    ].join(""))}

    ${data.experience ? section("Experiência com crianças", `
      <tr><td colspan="2" style="padding:8px 0;">
        <div style="background:#f9f5f0;border-left:4px solid #f97316;padding:16px;border-radius:0 8px 8px 0;color:#374151;font-size:14px;line-height:1.6;">${data.experience.replace(/\n/g, "<br/>")}</div>
      </td></tr>
    `) : ""}

    ${data.courses ? section("Cursos e formação", `
      <tr><td colspan="2" style="padding:8px 0;">
        <div style="background:#f9f5f0;border-left:4px solid #f97316;padding:16px;border-radius:0 8px 8px 0;color:#374151;font-size:14px;line-height:1.6;">${data.courses.replace(/\n/g, "<br/>")}</div>
      </td></tr>
    `) : ""}

    <div style="margin-top:32px;text-align:center;">
      <a href="https://wa.me/${data.phone.replace(/\D/g, "")}?text=Olá+${encodeURIComponent(data.name)}!+Recebemos+seu+cadastro+no+Trabalhe+Conosco+da+${encodeURIComponent(COMPANY_NAME)}+e+gostaríamos+de+conversar."
         style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
        💬 Entrar em contato via WhatsApp
      </a>
    </div>
  `;

  await resend.emails.send({
    from: RESEND_FROM,
    to: COMPANY_EMAIL,
    replyTo: data.email,
    subject: `Nova candidata — Trabalhe Conosco | ${data.name}`,
    html: emailWrapper(`Nova candidata — ${data.name}`, companyBody),
  });

  // Email de confirmação para a candidata
  const candidateBody = `
    <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">Olá, ${data.name}! 👋</p>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Recebemos seu cadastro no "Trabalhe Conosco" da ${COMPANY_NAME}. Nossa equipe avaliará seu perfil e entrará em contato em breve.
    </p>

    ${section("Seus dados", [
      row("Nome", data.name),
      row("Telefone / WhatsApp", data.phone),
      row("E-mail", data.email),
      row("Cidade / Região", data.city),
    ].join(""))}

    <div style="margin-top:32px;text-align:center;">
      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Olá!+Enviei+meu+cadastro+no+Trabalhe+Conosco+da+${encodeURIComponent(COMPANY_NAME)}+e+gostaria+de+mais+informações."
         style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
        💬 Falar pelo WhatsApp
      </a>
    </div>
  `;

  await resend.emails.send({
    from: RESEND_FROM,
    to: data.email,
    replyTo: COMPANY_EMAIL,
    subject: `Recebemos seu cadastro — ${COMPANY_NAME}`,
    html: emailWrapper(`Cadastro recebido — ${data.name}`, candidateBody),
  });
}

// ---------------------------------------------------------------------------
// sendLeadEmail
// TO: empresa — notificação de novo lead
// ---------------------------------------------------------------------------

export async function sendLeadEmail(lead: LeadCapture): Promise<void> {
  const location = lead.neighborhood && lead.city && lead.state
    ? `${lead.neighborhood}, ${lead.city} - ${lead.state}`
    : lead.city && lead.state
    ? `${lead.city} - ${lead.state}`
    : "Não informado";

  const whatsappLink = lead.clientPhone
    ? `https://wa.me/${lead.clientPhone.replace(/\D/g, "")}`
    : null;

  const body = `
    <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">Novo Lead de Contato 📋</p>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Recebido em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} pelo formulário do site.</p>

    ${section("Dados do Interessado",
      row("Nome", lead.clientName) +
      row("Serviço de interesse", lead.serviceType) +
      row("Localização", location) +
      row("CEP", lead.cep) +
      row("Telefone / WhatsApp", lead.clientPhone ?? "—") +
      row("E-mail", lead.clientEmail ?? "—")
    )}

    ${whatsappLink ? `
    <div style="text-align:center;margin-top:28px;">
      <a href="${whatsappLink}" style="display:inline-block;background:#25d366;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
        💬 Entrar em contato pelo WhatsApp
      </a>
    </div>` : ""}
  `;

  await resend.emails.send({
    from: RESEND_FROM,
    to: COMPANY_EMAIL,
    subject: `Novo lead: ${lead.clientName} — ${lead.serviceType}`,
    html: emailWrapper("Novo Lead", body),
  });
}

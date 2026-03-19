import { Resend } from "resend";
import { ContactForm, QuoteRequest, QuoteResult } from "@shared/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "espacocuidarecrescer@gmail.com";
const RESEND_FROM = process.env.RESEND_FROM_EMAIL ?? "Cuidar & Crescer <noreply@babascuidarecrescer.com.br>";
const COMPANY_NAME = "Cuidar & Crescer";
const WHATSAPP_NUMBER = "5513998090998";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

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
// sendQuoteEmail
// Se cliente tem e-mail: TO cliente | CC + Reply-To empresa
// Se não tem e-mail: TO empresa (notificação interna)
// ---------------------------------------------------------------------------

export async function sendQuoteEmail(
  quoteData: QuoteRequest,
  quoteResult: QuoteResult
): Promise<void> {
  const addressParts = [
    quoteData.street,
    quoteData.streetNumber,
    quoteData.streetComplement,
    quoteData.neighborhood,
    quoteData.city && quoteData.state
      ? `${quoteData.city} - ${quoteData.state}`
      : quoteData.city || quoteData.state,
    quoteData.cep,
  ].filter(Boolean);
  const fullAddress = addressParts.length ? addressParts.join(", ") : "Não informado";

  const weekdayNames: Record<string, string> = {
    seg: "Segunda", ter: "Terça", qua: "Quarta",
    qui: "Quinta", sex: "Sexta", sab: "Sábado", dom: "Domingo",
  };

  let serviceDetailsRows = "";
  if (quoteData.startHour !== undefined && quoteData.durationHours !== undefined) {
    serviceDetailsRows += row("Horário de início", `${String(quoteData.startHour).padStart(2, "0")}:00`);
    serviceDetailsRows += row("Duração", `${quoteData.durationHours}h`);
  }
  if (quoteData.travelDays !== undefined) {
    serviceDetailsRows += row("Diárias", `${quoteData.travelDays} dia(s)`);
  }
  if (quoteData.weekDays && quoteData.weekDays.length > 0) {
    serviceDetailsRows += row("Dias da semana", quoteData.weekDays.map((d) => weekdayNames[d] || d).join(", "));
  }
  if (quoteData.dailyHours !== undefined) {
    serviceDetailsRows += row("Horas/dia", `${quoteData.dailyHours}h`);
  }

  const breakdownRows = quoteResult.breakdown
    .map((item) => `
      <tr>
        <td style="padding:8px 12px;color:#374151;font-size:14px;border-bottom:1px solid #f3f4f6;">${item.item}</td>
        <td style="padding:8px 12px;color:#111827;font-size:14px;font-weight:500;text-align:right;border-bottom:1px solid #f3f4f6;">${typeof item.amount === "number" ? `R$ ${item.amount.toFixed(2).replace(".", ",")}` : item.amount}</td>
      </tr>`)
    .join("");

  const totalDisplay =
    typeof quoteResult.total === "number"
      ? `R$ ${quoteResult.total.toFixed(2).replace(".", ",")}`
      : String(quoteResult.total);

  const breakdownTable = `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-top:8px;">
      <thead>
        <tr style="background:#f9f5f0;">
          <th style="padding:10px 12px;text-align:left;font-size:13px;color:#6b7280;font-weight:600;">Item</th>
          <th style="padding:10px 12px;text-align:right;font-size:13px;color:#6b7280;font-weight:600;">Valor</th>
        </tr>
      </thead>
      <tbody>${breakdownRows}</tbody>
      <tfoot>
        <tr style="background:linear-gradient(135deg,#f97316,#fb923c);">
          <td style="padding:12px;color:#fff;font-weight:700;font-size:15px;">Total Estimado</td>
          <td style="padding:12px;color:#fff;font-weight:700;font-size:15px;text-align:right;">${totalDisplay}</td>
        </tr>
      </tfoot>
    </table>
  `;

  // ─── Com e-mail do cliente: envia para o cliente com CC à empresa ──────────

  if (quoteData.clientEmail) {
    const whatsappText = encodeURIComponent(
      `Olá! Acabei de solicitar um orçamento no site da ${COMPANY_NAME}.\n\n` +
      `Serviço: ${quoteData.serviceType}\n` +
      `Data: ${formatDate(quoteData.date)}\n` +
      `Total estimado: ${totalDisplay}\n\n` +
      `Gostaria de confirmar o agendamento!`
    );

    const clientBody = `
      <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">Olá, ${quoteData.clientName}! 👋</p>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
        Recebemos sua solicitação de orçamento. Nossa equipe entrará em contato em breve para confirmar os detalhes. Aqui está o resumo:
      </p>

      ${section("Detalhes do serviço", [
        row("Serviço", quoteData.serviceType),
        row("Data", formatDate(quoteData.date)),
        row("Crianças", quoteData.childrenCount),
        serviceDetailsRows,
        row("Endereço", fullAddress),
      ].join(""))}

      ${quoteData.observations ? section("Observações", `
        <tr><td colspan="2" style="padding:8px 0;">
          <div style="background:#f9f5f0;border-left:4px solid #f97316;padding:16px;border-radius:0 8px 8px 0;color:#374151;font-size:14px;line-height:1.6;">${quoteData.observations.replace(/\n/g, "<br/>")}</div>
        </td></tr>
      `) : ""}

      ${section("Valores estimados", breakdownTable)}

      <div style="margin:32px 0 0;background:#fef3e2;border-radius:10px;padding:24px;text-align:center;">
        <p style="margin:0 0 16px;color:#92400e;font-size:15px;font-weight:500;">
          Quer confirmar o agendamento ou tirar dúvidas?
        </p>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}"
           style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
          💬 Falar pelo WhatsApp
        </a>
        <p style="margin:16px 0 0;color:#b45309;font-size:12px;">
          Este é um orçamento estimativo. Os valores podem sofrer alterações a qualquer momento e a confirmação final é feita diretamente com nossa equipe.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: RESEND_FROM,
      to: quoteData.clientEmail,
      cc: COMPANY_EMAIL,
      replyTo: COMPANY_EMAIL,
      subject: `Seu orçamento — ${quoteData.serviceType} | ${COMPANY_NAME}`,
      html: emailWrapper("Seu Orçamento", clientBody),
    });

    return;
  }

  // ─── Sem e-mail do cliente: notificação interna para a empresa ─────────────

  const internalBody = `
    <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">Novo orçamento solicitado! 📋</p>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Recebido em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} — cliente não informou e-mail.</p>

    ${section("Dados do cliente", [
      row("Nome", quoteData.clientName),
      row("Telefone / WhatsApp", quoteData.clientPhone),
    ].join(""))}

    ${section("Detalhes do serviço", [
      row("Serviço", quoteData.serviceType),
      row("Data", formatDate(quoteData.date)),
      row("Crianças", quoteData.childrenCount),
      serviceDetailsRows,
      row("Endereço", fullAddress),
    ].join(""))}

    ${quoteData.observations ? section("Observações", `
      <tr><td colspan="2" style="padding:8px 0;">
        <div style="background:#f9f5f0;border-left:4px solid #f97316;padding:16px;border-radius:0 8px 8px 0;color:#374151;font-size:14px;line-height:1.6;">${quoteData.observations.replace(/\n/g, "<br/>")}</div>
      </td></tr>
    `) : ""}

    ${section("Orçamento calculado", breakdownTable)}

    <div style="margin-top:32px;text-align:center;">
      ${quoteData.clientPhone
        ? `<a href="https://wa.me/${quoteData.clientPhone.replace(/\D/g, "")}?text=Olá+${encodeURIComponent(quoteData.clientName)}!+Recebi+seu+orçamento+e+gostaria+de+confirmar+os+detalhes."
             style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
            💬 Entrar em contato via WhatsApp
           </a>`
        : ""}
    </div>
  `;

  await resend.emails.send({
    from: RESEND_FROM,
    to: COMPANY_EMAIL,
    subject: `Novo Orçamento | ${quoteData.clientName} — ${quoteData.serviceType}`,
    html: emailWrapper(`Novo Orçamento — ${quoteData.clientName}`, internalBody),
  });
}

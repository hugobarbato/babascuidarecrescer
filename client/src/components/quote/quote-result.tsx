import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuoteResult } from "@shared/schema";
import { QuoteRequest } from "@shared/schema";
import { formatCurrency } from "@/lib/quote-calculator";
import { COMPANY_INFO } from "@/lib/constants";

interface QuoteResultProps {
  isOpen: boolean;
  onClose: () => void;
  result: QuoteResult | null;
  quoteData: QuoteRequest | null;
  onRecalculate: () => void;
}

const WEEK_DAY_LABELS: Record<string, string> = {
  seg: "Segunda", ter: "Terça", qua: "Quarta",
  qui: "Quinta", sex: "Sexta", sab: "Sábado", dom: "Domingo",
};

function buildWhatsAppMessage(data: QuoteRequest, result: QuoteResult): string {
  const dateFormatted = data.date
    ? new Date(data.date + "T12:00:00").toLocaleDateString("pt-BR")
    : "";

  const lines: string[] = [
    "Olá! Gostaria de confirmar o orçamento solicitado pelo site:",
    "",
    `👤 *Nome:* ${data.clientName}`,
    `📋 *Serviço:* ${data.serviceType}`,
    `📅 *Data:* ${dateFormatted}`,
  ];

  if (data.startHour && data.durationHours) {
    const startH = parseInt(data.startHour);
    const endH = startH + data.durationHours;
    lines.push(
      `⏰ *Horário:* ${String(startH).padStart(2, "0")}h às ${String(endH).padStart(2, "0")}h (${data.durationHours}h)`
    );
  }

  if (data.travelDays) {
    lines.push(`✈️ *Diárias:* ${data.travelDays} dia(s)`);
  }

  if (data.weekDays && data.weekDays.length > 0) {
    lines.push(`📆 *Dias da semana:* ${data.weekDays.map((d) => WEEK_DAY_LABELS[d] ?? d).join(", ")}`);
  }

  if (data.dailyHours) {
    lines.push(`⏱️ *Carga horária diária:* ${data.dailyHours}h`);
  }

  lines.push(`👶 *Crianças:* ${data.childrenCount}`);

  const hasAddress = data.street || data.neighborhood || data.city;
  if (hasAddress) {
    const parts = [
      data.street && data.streetNumber
        ? `${data.street}, ${data.streetNumber}`
        : data.street,
      data.streetComplement,
      data.neighborhood,
      data.city && data.state ? `${data.city}/${data.state}` : data.city,
    ].filter(Boolean);
    lines.push(`📍 *Endereço:* ${parts.join(" - ")}`);
  }

  lines.push("", "💰 *Orçamento Calculado:*");
  result.breakdown.forEach((item) => {
    const amt =
      typeof item.amount === "number"
        ? `R$ ${item.amount.toFixed(2).replace(".", ",")}`
        : item.amount;
    lines.push(`  • ${item.item}: ${amt}`);
  });

  const totalFormatted =
    typeof result.total === "number"
      ? `R$ ${result.total.toFixed(2).replace(".", ",")}`
      : result.total;
  lines.push(`  *TOTAL: ${totalFormatted}*`);

  if (data.observations) {
    lines.push("", `📝 *Observações:* ${data.observations}`);
  }

  lines.push("", "Aguardo confirmação! 😊");
  return lines.join("\n");
}

export function QuoteResultModal({ isOpen, onClose, result, quoteData, onRecalculate }: QuoteResultProps) {
  if (!result) return null;

  const whatsappUrl = quoteData
    ? `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(buildWhatsAppMessage(quoteData, result))}`
    : `https://wa.me/${COMPANY_INFO.whatsapp}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">
            <i className="fas fa-check-circle mr-2"></i>
            Seu Orçamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Breakdown */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cálculo Detalhado</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              {result.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 border-b last:border-b-0">
                  <span className="text-gray-700">{item.item}</span>
                  <span className="font-semibold">
                    {typeof item.amount === "number" ? formatCurrency(item.amount) : item.amount}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center p-4 bg-coral text-white font-bold text-lg">
                <span>TOTAL</span>
                <span>
                  {typeof result.total === "number" ? formatCurrency(result.total) : result.total}
                </span>
              </div>
            </div>
          </div>

          {/* Custom message for monthly plans */}
          {result.type === "monthly" && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800 font-medium">
                <i className="fas fa-info-circle mr-2"></i>
                Este é um serviço personalizado. Nossa equipe entrará em contato para elaborar uma proposta específica baseada em suas necessidades.
              </p>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Informações de Pagamento:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Sinal de até 50% do valor acordado</li>
              <li>• Pagamento na data combinada ou em até 48h após o atendimento</li>
              <li>• Mensalistas: valor fixo, sem desconto por cancelamento</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onRecalculate} variant="outline" className="flex-1">
              <i className="fas fa-redo mr-2"></i> Recalcular
            </Button>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                <i className="fab fa-whatsapp mr-2"></i> Enviar no WhatsApp
              </Button>
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Ao clicar em "Enviar no WhatsApp", o aplicativo será aberto com a mensagem de orçamento já preenchida para você enviar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}


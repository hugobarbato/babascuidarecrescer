import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuoteResult } from "@shared/schema";
import { formatCurrency } from "@/lib/quote-calculator";
import { COMPANY_INFO } from "@/lib/constants";

interface QuoteResultProps {
  isOpen: boolean;
  onClose: () => void;
  result: QuoteResult | null;
  onRecalculate: () => void;
}

export function QuoteResultModal({ isOpen, onClose, result, onRecalculate }: QuoteResultProps) {
  if (!result) return null;

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert("Funcionalidade de PDF será implementada em breve");
  };

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
                    {typeof item.amount === 'number' ? formatCurrency(item.amount) : item.amount}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center p-4 bg-coral text-white font-bold text-lg">
                <span>TOTAL</span>
                <span>
                  {typeof result.total === 'number' ? formatCurrency(result.total) : result.total}
                </span>
              </div>
            </div>
          </div>

          {/* Custom message for monthly plans */}
          {result.type === 'monthly' && (
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
            <Button 
              onClick={handleDownloadPDF}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <i className="fas fa-download mr-2"></i>
              Baixar PDF
            </Button>
            <Button 
              onClick={onRecalculate}
              variant="outline"
              className="flex-1"
            >
              <i className="fas fa-redo mr-2"></i>
              Recalcular
            </Button>
            <a 
              href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-green-500 hover:bg-green-600">
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-green-800 text-sm text-center">
              <i className="fas fa-envelope mr-2"></i>
              Orçamento enviado por e-mail! Nossa equipe entrará em contato para alinhamentos finais.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

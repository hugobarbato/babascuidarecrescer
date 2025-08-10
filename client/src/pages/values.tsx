import { Button } from "@/components/ui/button";
import { PRICING_TABLE } from "@/lib/constants";

interface ValuesProps {
  onOpenQuoteModal: (service?: string) => void;
}

export default function Values({ onOpenQuoteModal }: ValuesProps) {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-5xl font-bold mb-6">
              <span className="text-coral">Valores</span> dos Nossos Serviços
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparência total em nossos preços para que você possa planejar com segurança
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto mb-8">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-coral to-orange-400 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Serviço</th>
                  <th className="px-6 py-4 text-left font-semibold">Dias de Semana</th>
                  <th className="px-6 py-4 text-left font-semibold">Finais de Semana</th>
                  <th className="px-6 py-4 text-left font-semibold">Adicionais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {PRICING_TABLE.map((row, index) => (
                  <tr key={index} className={`hover:bg-gray-50 ${index === 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                    <td className="px-6 py-6">
                      <div className="font-semibold text-warm-gray">{row.service}</div>
                      <div className="text-sm text-gray-500">{row.description}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="whitespace-pre-line text-warm-gray">{row.weekday}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="whitespace-pre-line text-warm-gray">{row.weekend}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="whitespace-pre-line text-gray-600">{row.additional}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-6 mb-8">
            {PRICING_TABLE.map((row, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className={`px-6 py-4 text-white ${
                  index === 0 ? 'bg-gradient-to-r from-coral to-orange-400' :
                  index === 1 ? 'bg-gradient-to-r from-soft-blue to-blue-400' :
                  index === 2 ? 'bg-gradient-to-r from-soft-pink to-pink-400' :
                  'bg-gradient-to-r from-yellow-500 to-orange-500'
                }`}>
                  <h3 className="font-semibold text-lg">{row.service}</h3>
                  <p className="text-sm opacity-90">{row.description}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Dias de semana:</span>
                    <div className="text-gray-600 whitespace-pre-line">{row.weekday}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Finais de semana:</span>
                    <div className="text-gray-600 whitespace-pre-line">{row.weekend}</div>
                  </div>
                  <div className="border-t pt-4">
                    <span className="font-medium text-gray-700">Adicionais:</span>
                    <div className="text-gray-600 whitespace-pre-line">{row.additional}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button 
              onClick={() => onOpenQuoteModal()}
              className="bg-coral text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 transition-all shadow-lg"
            >
              <i className="fas fa-calculator mr-2"></i>
              Calcular Meu Orçamento
            </Button>
          </div>

          {/* Payment Terms */}
          <div className="mt-16 bg-gradient-to-r from-coral/10 to-sage/10 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-3">
              <i className="fas fa-info-circle mr-2 text-coral"></i>
              Informações Importantes sobre Pagamentos:
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>• Os serviços são realizados mediante pagamento ou sinal de até 50% do valor acordado</p>
              <p>• Atendimentos mensalistas possuem valor fixo, não será descontado mediante cancelamento ou diminuição de horas</p>
              <p>• Pagamentos devem ser feitos na data combinada previamente ou em até 48 horas após o atendimento</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

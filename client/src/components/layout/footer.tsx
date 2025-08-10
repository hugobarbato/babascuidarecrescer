import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { COMPANY_INFO, SERVICES } from "@/lib/constants";

interface FooterProps {
  onOpenQuoteModal: () => void;
}

export function Footer({ onOpenQuoteModal }: FooterProps) {
  return (
    <footer className="bg-warm-gray text-white py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <Logo className="text-2xl mb-4" />
              <p className="text-gray-300 leading-relaxed">
                Cuidado e desenvolvimento infantil com acolhimento, segurança e profissionalismo desde {COMPANY_INFO.founded}.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Nossos Serviços</h3>
              <ul className="space-y-2 text-gray-300">
                {SERVICES.map((service) => (
                  <li key={service.id}>
                    <Link href="/services" className="hover:text-coral transition-colors">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contato</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-2">
                  <i className="fab fa-whatsapp text-green-400"></i>
                  <a 
                    href={`https://wa.me/${COMPANY_INFO.whatsapp}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-coral transition-colors"
                  >
                    {COMPANY_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-envelope text-coral"></i>
                  <a 
                    href={`mailto:${COMPANY_INFO.email}`} 
                    className="hover:text-coral transition-colors"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-clock text-soft-blue"></i>
                  <span>Seg-Sex: 8h-18h | Sáb: 8h-14h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-8">
            <div className="bg-gradient-to-r from-coral/10 to-sage/10 p-6 rounded-xl mb-6">
              <h3 className="font-semibold text-lg mb-3">
                <i className="fas fa-info-circle mr-2 text-coral"></i>
                Informações Importantes sobre Pagamentos:
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>• Os serviços são realizados mediante pagamento ou sinal de até 50% do valor acordado</p>
                <p>• Atendimentos mensalistas possuem valor fixo, não será descontado mediante cancelamento</p>
                <p>• Pagamentos devem ser feitos na data combinada previamente ou em até 48 horas após o atendimento</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2024 Cuidar & Crescer. Todos os direitos reservados.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Button 
                  onClick={onOpenQuoteModal}
                  className="bg-coral px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 transition-colors"
                >
                  Solicitar Orçamento
                </Button>
                <a 
                  href={`https://wa.me/${COMPANY_INFO.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <i className="fab fa-whatsapp mr-1"></i> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

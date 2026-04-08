import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { COMPANY_INFO, SERVICES } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/analytics";
import { WhatsAppIcon, CalendarCheck, Clock, Briefcase, Mail, Instagram } from "@/lib/icons";

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
              <div className="mb-4">
                <Logo className="text-2xl" />
              </div>
              <p className="text-gray-300 leading-relaxed">
                Cuidado e desenvolvimento infantil com acolhimento, segurança e profissionalismo desde {COMPANY_INFO.founded}.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Nossos Serviços</h3>
              <div className="space-y-3 text-gray-300">
                <div>
                  <p className="text-xs uppercase tracking-wider text-vermelho/80 font-semibold mb-2">
                    <CalendarCheck className="w-3.5 h-3.5 mr-1.5 inline" />Planos Mensais
                  </p>
                  <ul className="space-y-2 pl-0">
                    {SERVICES.filter((s) => s.category === "mensalista").map((service) => (
                      <li key={service.id}>
                        <a href={`/services/${service.id}`} className="hover:text-vermelho transition-colors">
                          {service.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-azul/80 font-semibold mb-2">
                    <Clock className="w-3.5 h-3.5 mr-1.5 inline" />Serviços Avulsos
                  </p>
                  <ul className="space-y-2 pl-0">
                    {SERVICES.filter((s) => s.category === "avulso").map((service) => (
                      <li key={service.id}>
                        <a href={`/services/${service.id}`} className="hover:text-vermelho transition-colors">
                          {service.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <a href="/trabalhe-conosco" className="hover:text-verde transition-colors font-medium">
                  <Briefcase className="w-4 h-4 mr-2 inline" />Trabalhe Conosco
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contato</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-2">
                  <WhatsAppIcon className="w-4 h-4 text-green-400" />
                  <a 
                    href={`https://wa.me/${COMPANY_INFO.whatsapp}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("footer_contact")}
                    className="hover:text-vermelho transition-colors"
                  >
                    {COMPANY_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-vermelho" />
                  <a 
                    href={`mailto:${COMPANY_INFO.email}`} 
                    className="hover:text-vermelho transition-colors"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-azul" />
                  <span>Seg-Sex: 8h-18h | Sáb: 8h-14h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Instagram className="w-4 h-4 text-rosa" />
                  <a
                    href={COMPANY_INFO.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-vermelho transition-colors"
                  >
                    @babascuidarecrescer
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-8">
            <div className="bg-gradient-to-r from-vermelho/10 to-verde/10 p-6 rounded-xl mb-6">
             
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">© 2024 Cuidar & Crescer. Todos os direitos reservados.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Button 
                  onClick={onOpenQuoteModal}
                  className="bg-vermelho px-4 py-2 rounded-full text-sm font-medium hover:bg-vermelho/80 transition-colors"
                >
                  Solicitar Orçamento
                </Button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("footer_cta")}
                  aria-label="Falar no WhatsApp"
                  className="bg-green-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 sm:mr-1 inline" /><span className="hidden sm:inline"> WhatsApp</span>
                </a>
                <a
                  href={COMPANY_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguir no Instagram"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Instagram className="w-4 h-4 sm:mr-1 inline" /><span className="hidden sm:inline"> Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

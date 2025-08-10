import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ui/service-card";
import { SERVICES, COMPANY_INFO } from "@/lib/constants";

interface HomeProps {
  onOpenQuoteModal: (service?: string) => void;
}

export default function Home({ onOpenQuoteModal }: HomeProps) {
  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="text-coral">Cuidado</span> e <span className="text-soft-blue">desenvolvimento</span> com{" "}
              <span className="text-sage">acolhimento</span>, <span className="text-soft-purple">segurança</span> e{" "}
              <span className="text-soft-pink">profissionalismo</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed">
              Uma equipe de profissionais dedicados e apaixonados por cuidar e promover o desenvolvimento integral e personalizado das crianças
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => onOpenQuoteModal()}
                className="bg-coral text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 transition-all shadow-lg transform hover:scale-105"
              >
                <i className="fas fa-calculator mr-2"></i> Solicitar Orçamento Agora
              </Button>
              <a 
                href={`https://wa.me/${COMPANY_INFO.whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition-all shadow-lg transform hover:scale-105">
                  <i className="fab fa-whatsapp mr-2"></i> Falar no WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Conheça <span className="text-coral">Nossos Serviços</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos diferentes modalidades de cuidado para atender às necessidades específicas de cada família
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onRequestQuote={() => onOpenQuoteModal(service.name)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quality & Security Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-coral/5 to-sage/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Equipe profissional cuidando de crianças em ambiente seguro" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div>
                <h2 className="text-3xl lg:text-5xl font-bold mb-8">
                  <span className="text-coral">Qualidade</span> e <span className="text-sage">Segurança</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Seleção criteriosa e treinamento próprio garantem padrão de qualidade e segurança.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-coral text-white p-3 rounded-full">
                      <i className="fas fa-user-shield text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Seleção Rigorosa</h3>
                      <p className="text-gray-600">Verificação de experiências anteriores, referências e histórico profissional completo.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-sage text-white p-3 rounded-full">
                      <i className="fas fa-graduation-cap text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Treinamento Completo</h3>
                      <p className="text-gray-600">Curso de Babá Profissional com metodologia própria, primeiros socorros e desenvolvimento infantil.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-soft-blue text-white p-3 rounded-full">
                      <i className="fas fa-heart text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Metodologia Própria</h3>
                      <p className="text-gray-600">Educação respeitosa, abordagem Montessoriana e desenvolvimento através do brincar.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

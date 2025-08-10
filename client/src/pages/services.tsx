import { ServiceCard } from "@/components/ui/service-card";
import { SERVICES } from "@/lib/constants";

interface ServicesProps {
  onOpenQuoteModal: (service?: string) => void;
}

export default function Services({ onOpenQuoteModal }: ServicesProps) {
  return (
    <div className="pt-20 lg:pt-24">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-5xl font-bold mb-6">
              Nossos <span className="text-coral">Serviços</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos diferentes modalidades de cuidado para atender às necessidades específicas de cada família. 
              Todos os nossos serviços seguem nossa metodologia própria de educação respeitosa e desenvolvimento integral.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onRequestQuote={() => onOpenQuoteModal(service.name)}
              />
            ))}
          </div>

          {/* Methodology Section */}
          <div className="bg-gradient-to-r from-sage/5 to-soft-blue/5 rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-center">
              Nossa <span className="text-sage">Metodologia</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-coral text-white p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <i className="fas fa-heart text-xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Educação Respeitosa e Afirmativa</h3>
                <p className="text-sm text-gray-600">Valorizamos a individualidade de cada criança</p>
              </div>

              <div className="text-center">
                <div className="bg-sage text-white p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <i className="fas fa-seedling text-xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Metodologia Montessoriana</h3>
                <p className="text-sm text-gray-600">Respeito, autonomia e educação sensorial</p>
              </div>

              <div className="text-center">
                <div className="bg-soft-blue text-white p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <i className="fas fa-music text-xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Ludicidade</h3>
                <p className="text-sm text-gray-600">Envolvimento através de canções e brincadeiras</p>
              </div>

              <div className="text-center">
                <div className="bg-soft-purple text-white p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <i className="fas fa-hands-helping text-xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Acolhimento</h3>
                <p className="text-sm text-gray-600">Validação, calma e paciência</p>
              </div>
            </div>
          </div>

          {/* Training Section */}
          <div className="mt-16 bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-center">
              <span className="text-coral">Treinamento</span> das Nossas Profissionais
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 mb-8 text-center">
                Todas as nossas babás passam por nosso Curso de Babá Profissional, garantindo qualidade e padronização no atendimento.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Cuidados Pessoais segundo o padrão Cuidar e Crescer",
                  "Ética da Babá Profissional",
                  "Organograma de Atendimento",
                  "Atendimento de Recém-nascidos até 1 ano",
                  "Metodologia Cuidar e Crescer",
                  "Higiene e Banho Seguro",
                  "Alimentação e Manuseio de Leite",
                  "Janela de Sono",
                  "Saltos de Desenvolvimento",
                  "Brincar Estimulante",
                  "Segurança e Primeiros Socorros",
                  "Desenvolvimento Infantil"
                ].map((topic, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-coral mt-1">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <span className="text-gray-700">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/constants";

interface ServiceDetailProps {
  onOpenQuoteModal: (service?: string) => void;
}

const SERVICE_CONTENT: Record<string, {
  tagline: string;
  description: string;
  benefits: { icon: string; title: string; text: string }[];
  included: string[];
  pricing: string;
  pricingNote?: string;
  color: string;
  bgGradient: string;
}> = {
  "nanny-cuidar": {
    tagline: "Cuidado completo no dia a dia dos pequenos",
    description:
      "A Nanny Cuidar é a profissional dedicada à rotina diária da sua família. Com foco em organização, bem-estar e desenvolvimento, ela cuida de tudo para que os pais tenham tranquilidade no trabalho e os filhos tenham um ambiente seguro, acolhedor e cheio de carinho em casa.",
    benefits: [
      {
        icon: "fas fa-calendar-check",
        title: "Rotina Consistente",
        text: "Horários respeitados, refeições no tempo certo e atividades planejadas para garantir o bem-estar da criança.",
      },
      {
        icon: "fas fa-shield-alt",
        title: "Ambiente Seguro",
        text: "Profissional treinada para prevenção de acidentes, primeiros socorros e supervisão ativa durante todo o atendimento.",
      },
      {
        icon: "fas fa-heart",
        title: "Vínculo e Confiança",
        text: "Presença contínua que cria laço afetivo saudável — fundamental para o desenvolvimento emocional da criança.",
      },
      {
        icon: "fas fa-graduation-cap",
        title: "Estimulação no Dia a Dia",
        text: "Brincadeiras, leitura, canções e atividades lúdicas integradas à rotina para estimular o aprendizado sem necessidade de telas.",
      },
    ],
    included: [
      "Preparo e oferta de refeições (com alimentos pré-preparados pela família)",
      "Banho seguro e higiene pessoal",
      "Acompanhamento à escola e em atividades extracurriculares",
      "Auxílio nos deveres escolares",
      "Organização do espaço e pertences da criança",
      "Atividades lúdicas e de estimulação",
      "Comunicação diária com os pais",
    ],
    pricing: "A partir de R$ 50/h (Seg–Sex) · R$ 60/h (Sáb, Dom e feriados)",
    pricingNote: "+R$ 5/h após 22h · +R$ 10/h por criança extra",
    color: "coral",
    bgGradient: "from-coral/10 to-orange-50",
  },
  "nanny-desenvolver": {
    tagline: "Desenvolvimento personalizado com profissionais especializados",
    description:
      "A Nanny Desenvolver atua com foco em necessidades específicas de cada criança. São profissionais com formação na área infantil que planejam e executam atividades terapêuticas e de desenvolvimento — como desfralde, seletividade alimentar e estimulação sensorial — de forma lúdica, respeitosa e eficaz.",
    benefits: [
      {
        icon: "fas fa-seedling",
        title: "Atenção Especializada",
        text: "Profissional com formação específica para lidar com desafios do desenvolvimento infantil com técnica e sensibilidade.",
      },
      {
        icon: "fas fa-utensils",
        title: "Apoio à Seletividade Alimentar",
        text: "Estratégias baseadas em evidências para ampliar o repertório alimentar da criança de forma gradual e respeitosa.",
      },
      {
        icon: "fas fa-baby",
        title: "Suporte no Desfralde",
        text: "Acompanhamento especializado na transição do uso da fralda, no ritmo e tempo certo da criança.",
      },
      {
        icon: "fas fa-chart-line",
        title: "Progressão Real",
        text: "Atividades planejadas com objetivos claros, evolução monitorada e relatórios para os pais.",
      },
    ],
    included: [
      "Diagnóstico inicial e planejamento individualizado de atividades",
      "Trabalho com seletividade alimentar e neofobia",
      "Suporte no processo de desfralde",
      "Atividades sensoriais e motoras adaptadas",
      "Estimulação cognitiva, verbal e social",
      "Relatórios periódicos de evolução",
      "Comunicação direta e contínua com os pais",
    ],
    pricing: "A partir de R$ 70/h (Seg–Sex) · R$ 80/h (Sáb, Dom e feriados)",
    pricingNote: "+R$ 5/h após 22h · +R$ 10/h por criança extra",
    color: "sage",
    bgGradient: "from-sage/10 to-green-50",
  },
  "vale-night": {
    tagline: "Uma noite especial para você, com seus filhos bem cuidados",
    description:
      "O Vale Night foi criado para que os pais possam curtir uma noite especial com total tranquilidade. A profissional assume a rotina noturna das crianças — banho, jantar, história e hora de dormir — com calma, carinho e toda a segurança de uma profissional treinada.",
    benefits: [
      {
        icon: "fas fa-moon",
        title: "Noite Livre para os Pais",
        text: "Jantar a dois, encontro com amigos ou simplesmente descanso — sem preocupação com a rotina dos filhos.",
      },
      {
        icon: "fas fa-bed",
        title: "Sono Tranquilo para a Criança",
        text: "Rotina noturna respeitosa e consistente que facilita o adormecer e garante uma noite tranquila para o pequeno.",
      },
      {
        icon: "fas fa-star",
        title: "Profissional Calma e Presente",
        text: "Babá treinada especificamente para o período noturno — paciência, tranquilidade e atenção redobrada.",
      },
      {
        icon: "fas fa-comments",
        title: "Relatório ao Retornar",
        text: "Pais recebem um relato completo da noite ao chegar em casa — como dormiu, o que comeu, como foi a rotina.",
      },
    ],
    included: [
      "Banho seguro e cuidados de higiene",
      "Jantar (com alimentos pré-preparados pela família)",
      "Atividades calmas antes de dormir (leitura, histórias, música)",
      "Colocar a criança para dormir",
      "Monitoramento durante o sono",
      "Relato completo para os pais ao retornar",
    ],
    pricing:
      "Meio turno (até 5h): R$ 150 (Seg–Sex) · R$ 180 (Sáb, Dom e feriados)",
    pricingNote:
      "Turno completo (+5h): R$ 280 (Seg–Sex) · R$ 300 (Sáb, Dom e feriados) · +R$ 50–100 por criança extra",
    color: "soft-blue",
    bgGradient: "from-soft-blue/10 to-blue-50",
  },
  "eventos": {
    tagline: "Seus filhos bem cuidados enquanto você aproveita o evento",
    description:
      "Suporte profissional especializado para que os pais possam participar de festas, eventos sociais ou compromissos de trabalho com total liberdade. A profissional cuida das crianças integralmente no local do evento — com atividades, refeições e tudo o que precisam.",
    benefits: [
      {
        icon: "fas fa-party-horn",
        title: "Festa sem Preocupações",
        text: "Pais presentes, atentos e tranquilos — sabendo que os filhos estão em mãos experientes e carinhosas.",
      },
      {
        icon: "fas fa-child",
        title: "Criança Entretida e Feliz",
        text: "Atividades lúdicas adaptadas ao espaço e ao perfil de cada criança, mantendo-as engajadas e bem-humoradas.",
      },
      {
        icon: "fas fa-utensils",
        title: "Refeições e Higiene Garantidas",
        text: "Auxílio completo nas refeições, lanches, trocas e todos os cuidados de higiene durante o evento.",
      },
      {
        icon: "fas fa-map-marker-alt",
        title: "Adaptação ao Local",
        text: "Atendimento flexível para qualquer tipo de evento — casamentos, aniversários, confraternizações, congressos e mais.",
      },
    ],
    included: [
      "Atividades recreativas e lúdicas adaptadas ao evento",
      "Auxílio em refeições e lanches",
      "Trocas e higiene pessoal",
      "Organização do espaço das crianças",
      "Supervisão e segurança contínuas",
      "Comunicação direta com os pais durante todo o evento",
    ],
    pricing: "A partir de R$ 70/h (Seg–Sex) · R$ 80/h (Sáb, Dom e feriados)",
    pricingNote: "+R$ 5/h após 22h · +R$ 10/h por criança extra",
    color: "soft-purple",
    bgGradient: "from-soft-purple/10 to-purple-50",
  },
  "viagens": {
    tagline: "A família aproveita a viagem, a profissional cuida dos pequenos",
    description:
      "Para viagens onde os pais querem curtir cada momento sem sobrecarga. A profissional acompanha toda a família, mantendo a rotina e os cuidados das crianças durante toda a viagem. A família é responsável por acomodação, refeições e transporte da profissional.",
    benefits: [
      {
        icon: "fas fa-plane",
        title: "Família Aproveita de Verdade",
        text: "Passeios, refeições e momentos especiais sem a preocupação de gerenciar sonos, refeições e trocas.",
      },
      {
        icon: "fas fa-sync-alt",
        title: "Rotina Mantida na Viagem",
        text: "Criança com horários de sono, refeições e brincadeiras mantidos — menos estresse e mau humor durante a volta.",
      },
      {
        icon: "fas fa-user-check",
        title: "Profissional de Confiança",
        text: "Acompanhante já conhecida pelas crianças — sem adaptação desconfortável em um ambiente novo.",
      },
      {
        icon: "fas fa-umbrella-beach",
        title: "Qualquer Destino",
        text: "Nacional ou internacional — a profissional se adapta ao destino da família com flexibilidade e preparo.",
      },
    ],
    included: [
      "Cuidados de higiene e banho durante a viagem",
      "Organização e cumprimento dos horários das crianças",
      "Auxílio e supervisão nas refeições",
      "Atividades, brincadeiras e entretenimento",
      "Supervisão contínua e atenta",
      "Adaptação à rotina e ao ambiente da viagem",
    ],
    pricing: "R$ 200/diária + R$ 50 por criança extra por dia",
    pricingNote:
      "A família provê acomodação, alimentação e transporte da profissional",
    color: "soft-pink",
    bgGradient: "from-soft-pink/10 to-pink-50",
  },
  "mensalista": {
    tagline: "Cuidado contínuo, vínculo sólido e valor fixo mensal",
    description:
      "O Plano Mensalista é ideal para famílias que precisam de suporte regular e contínuo. Com dias e horários fixos, a criança cria um vínculo com a profissional — o que traz mais segurança emocional e consistência na rotina. O valor é personalizado conforme a carga horária e os dias da semana.",
    benefits: [
      {
        icon: "fas fa-handshake",
        title: "Profissional de Referência",
        text: "Mesma profissional todo dia — criança cria vínculo afetivo seguro, essencial para o desenvolvimento emocional.",
      },
      {
        icon: "fas fa-calendar-alt",
        title: "Rotina Previsível e Segura",
        text: "Horários e dias fixos que trazem consistência para a família e conforto para a criança.",
      },
      {
        icon: "fas fa-dollar-sign",
        title: "Valor Fixo Mensal",
        text: "Sem surpresas no final do mês — valor acordado antecipadamente com base na carga horária contratada.",
      },
      {
        icon: "fas fa-comments",
        title: "Acompanhamento Próximo",
        text: "Reuniões de alinhamento, relatórios e comunicação direta — parceria real entre a família e a profissional.",
      },
    ],
    included: [
      "Atendimento nos dias e horários fixos contratados",
      "Rotina totalmente personalizada com a família",
      "Relatórios periódicos de acompanhamento",
      "Comunicação direta e contínua com os pais",
      "Reuniões de alinhamento mensais",
      "Flexibilidade para ajustes em necessidades especiais",
    ],
    pricing: "Orçamento personalizado — a partir de R$ 2.800/mês",
    pricingNote:
      "Exemplo: Turno completo · 22 dias/mês · 1 criança. Solicite uma proposta para a sua realidade.",
    color: "yellow-600",
    bgGradient: "from-yellow-50 to-yellow-100",
  },
};

const COLOR_MAP: Record<string, { text: string; bg: string; border: string; btn: string }> = {
  coral: {
    text: "text-coral",
    bg: "bg-coral",
    border: "border-coral",
    btn: "bg-coral hover:bg-orange-500",
  },
  sage: {
    text: "text-sage",
    bg: "bg-sage",
    border: "border-sage",
    btn: "bg-sage hover:bg-green-600",
  },
  "soft-blue": {
    text: "text-soft-blue",
    bg: "bg-soft-blue",
    border: "border-soft-blue",
    btn: "bg-soft-blue hover:bg-blue-500",
  },
  "soft-purple": {
    text: "text-soft-purple",
    bg: "bg-soft-purple",
    border: "border-soft-purple",
    btn: "bg-soft-purple hover:bg-purple-500",
  },
  "soft-pink": {
    text: "text-soft-pink",
    bg: "bg-soft-pink",
    border: "border-soft-pink",
    btn: "bg-soft-pink hover:bg-pink-400",
  },
  "yellow-600": {
    text: "text-yellow-600",
    bg: "bg-yellow-500",
    border: "border-yellow-400",
    btn: "bg-yellow-500 hover:bg-yellow-600",
  },
};

export default function ServiceDetail({ onOpenQuoteModal }: ServiceDetailProps) {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const service = SERVICES.find((s) => s.id === params.id);
  const content = SERVICE_CONTENT[params.id ?? ""];

  if (!service || !content) {
    navigate("/services");
    return null;
  }

  const colors = COLOR_MAP[service.color] ?? COLOR_MAP["coral"];

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className={`py-16 lg:py-20 bg-gradient-to-br ${content.bgGradient}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`${colors.text} text-6xl mb-6`}>
              <i className={service.icon}></i>
            </div>
            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${colors.text}`}>
              {service.name}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              {content.tagline}
            </p>
            <Button
              onClick={() => onOpenQuoteModal(service.name)}
              className={`${colors.btn} text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all`}
            >
              <i className="fas fa-calculator mr-2"></i> Solicitar Orçamento
            </Button>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl text-center">
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
            {content.description}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            Por que escolher o <span className={colors.text}>{service.name}</span>?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {content.benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div
                  className={`${colors.bg} text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <i className={`${b.icon} text-xl`}></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-10">
              O que está <span className={colors.text}>incluído</span>
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8">
              <ul className="space-y-4">
                {content.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`${colors.text} mt-1 flex-shrink-0`}>
                      <i className="fas fa-check-circle text-lg"></i>
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={`py-14 bg-gradient-to-br ${content.bgGradient}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">
              Valores
            </h2>
            <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${colors.border}`}>
              <p className={`text-xl font-bold ${colors.text} mb-3`}>
                {content.pricing}
              </p>
              {content.pricingNote && (
                <p className="text-sm text-gray-500">{content.pricingNote}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            Solicite seu orçamento agora mesmo. É rápido, fácil e sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => onOpenQuoteModal(service.name)}
              className={`${colors.btn} text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all`}
            >
              <i className="fas fa-calculator mr-2"></i> Solicitar Orçamento
            </Button>
            <Button
              variant="outline"
              className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-300 text-gray-600 hover:border-gray-400 transition-colors"
              asChild
            >
              <a href="/#servicos">
                <i className="fas fa-arrow-left mr-2"></i> Ver todos os serviços
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { SERVICES, COMPANY_INFO } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/analytics";
import { ServiceIcon, Calculator, Check, CheckCircle2, Star, ArrowLeft, WhatsAppIcon } from "@/lib/icons";

interface ServiceDetailProps {
  onOpenQuoteModal: (service?: string) => void;
}

const SERVICE_CONTENT: Record<string, {
  tagline: string;
  description: string;
  idealFor?: string[];
  benefits: { icon: string; title: string; text: string }[];
  included: string[];
  exclusiveBenefits?: string[];
  ctaPhrase?: string;
  color: string;
  bgGradient: string;
}> = {
  "nanny-cuidar": {
    tagline: "Cuidado, carinho e rotina",
    description:
      "A Nanny Cuidar é a profissional dedicada à rotina diária da sua família. Com foco em organização e bem-estar, ela cuida de tudo para que os pais tenham tranquilidade no trabalho e os filhos tenham um ambiente seguro, acolhedor e cheio de carinho em casa.",
    idealFor: [
      "Segurança e cuidado afetivo",
      "Apoio na rotina diária",
      "Apoio nas tarefas domésticas designadas à criança",
    ],
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
    ],
    included: [
      "Preparo e oferta de refeições (com alimentos pré-preparados pela família)",
      "Banho seguro e higiene pessoal",
      "Acompanhamento à escola e em atividades extracurriculares",
      "Auxílio nos deveres escolares",
      "Auxiliar com a organização da criança, lavar e guardar roupinhas (não incluem sapatos ou mochilas)",
      "Organização do espaço e pertences da criança",
      "Brincar",
    ],
    exclusiveBenefits: [
      "Substituição da babá em caso de doença",
      "Substituição durante férias da profissional",
      "Contrato e suporte da agência durante o contrato",
      "Processo de seleção criterioso",
      "Profissionais treinadas a seguir o padrão de qualidade",
      "Alinhamento de perfil com a família",
      "Possibilidade de ajuste caso necessário, troca da profissional",
      "Acompanhamento da satisfação da família",
      "Continuidade no cuidado da criança",
      "Vínculo afetivo entre babá e criança",
      "Alinhamento com a rotina da família",
      "Economia em comparação ao valor avulso",
      "Segurança e confiança",
    ],
    ctaPhrase: "Mais do que uma babá, sua família conta com o suporte de uma agência comprometida com segurança, vínculo e excelência no cuidado infantil.",
    color: "vermelho",
    bgGradient: "from-vermelho/10 to-vermelho/5",
  },
  "nanny-desenvolver": {
    tagline: "Cuidado e desenvolvimento infantil",
    description:
      "A Nanny Desenvolver atua com foco em necessidades específicas de cada criança. São profissionais com formação na área infantil que planejam e executam atividades terapêuticas e de desenvolvimento, como desfralde, seletividade alimentar e estimulação sensorial de forma lúdica, respeitosa e eficaz.",
    idealFor: [
      "Desenvolvimento infantil estruturado",
      "Estímulos adequados para cada idade",
      "Atendimento mais técnico e especializado",
      "Famílias atípicas",
    ],
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
        icon: "fas fa-user-md",
        title: "Profissionais Especializadas",
        text: "Altamente capacitadas, com formação na área infantil (pedagogia, enfermagem, cursos profissionalizantes, especialização em recém-nascidos, ABA, TEA, etc.)",
      },
      {
        icon: "fas fa-chart-line",
        title: "Progressão Real",
        text: "Atividades planejadas com objetivos claros, estímulos motores, cognitivos e emocionais e relatórios para os pais.",
      },
    ],
    included: [
      "Diagnóstico inicial e planejamento individualizado de atividades",
      "Suporte no processo de desfralde",
      "Atividades sensoriais e motoras adaptadas",
      "Estimulação cognitiva, verbal e social aos nossos pequenos",
      "Observar e compartilhar o progresso do desenvolvimento",
      "Compartilhar relatórios",
      "Atividades do cotidiano (higiene, alimentação pré-pronta)",
      "Obrigatório o uso de uniforme completo",
    ],
    exclusiveBenefits: [
      "Substituição da babá em caso de doença",
      "Substituição durante férias da profissional",
      "Contrato e suporte da agência durante o contrato",
      "Processo de seleção criterioso",
      "Profissionais treinadas a seguir o padrão de qualidade",
      "Alinhamento de perfil com a família",
      "Possibilidade de ajuste caso necessário, troca da profissional",
      "Acompanhamento da satisfação da família",
      "Continuidade no cuidado da criança",
      "Vínculo afetivo entre babá e criança",
      "Alinhamento com a rotina da família",
      "Economia em comparação ao valor avulso",
      "Segurança e confiança",
    ],
    ctaPhrase: "Investir em um atendimento mensalista é escolher tranquilidade, segurança e um cuidado contínuo para o desenvolvimento saudável do seu bem mais precioso.",
    color: "verde",
    bgGradient: "from-verde/10 to-verde/5",
  },
  "vale-night": {
    tagline: "Uma noite especial para você, com seus filhos bem cuidados",
    description:
      "O Vale Night foi criado para que os pais possam curtir uma noite especial com total tranquilidade. Pois sabemos que vocês merecem um descanso e uma noite só para vocês! Com o nosso exclusivo serviço de Vale Night, estamos aqui para oferecer a vocês uma oportunidade de recarregar as energias, relaxar e desfrutar de uma noite especial juntos, ou uma noite em amigas, sem se preocuparem.",
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
    color: "azul",
    bgGradient: "from-azul/10 to-azul/5",
  },
  "aulas-particulares": {
    tagline: "Reforço escolar e aulas particulares com profissionais capacitadas",
    description:
      "Pensando em oferecer um suporte completo às famílias, a Cuidar e Crescer disponibiliza o serviço de reforço escolar e aulas particulares, com professoras capacitadas e cuidadosamente selecionadas. Nosso objetivo é auxiliar cada criança de forma individualizada, respeitando seu ritmo de aprendizado e trabalhando diretamente nas suas dificuldades, sempre com didática, paciência e atenção.",
    benefits: [
      {
        icon: "fas fa-book-open",
        title: "Apoio nas Tarefas",
        text: "Suporte direto nas tarefas escolares, garantindo que a criança compreenda o conteúdo e desenvolva autonomia.",
      },
      {
        icon: "fas fa-chart-line",
        title: "Reforço Personalizado",
        text: "Foco nas disciplinas com maior dificuldade, com didática adaptada ao ritmo de cada aluno.",
      },
      {
        icon: "fas fa-clipboard-check",
        title: "Preparação para Provas",
        text: "Organização de conteúdo, revisão direcionada e simulados para garantir confiança nas avaliações.",
      },
      {
        icon: "fas fa-lightbulb",
        title: "Estímulo à Autonomia",
        text: "Desenvolvimento da segurança e do interesse da criança pelos estudos, cultivando hábitos saudáveis de aprendizado.",
      },
    ],
    included: [
      "Apoio nas tarefas escolares",
      "Reforço em disciplinas com maior dificuldade",
      "Preparação para provas e atividades avaliativas",
      "Organização da rotina de estudos",
      "Estímulo à autonomia e à confiança",
      "Ambiente seguro, acolhedor e propício para o aprendizado",
    ],
    color: "rosa",
    bgGradient: "from-rosa/10 to-rosa/5",
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
    color: "amarelo",
    bgGradient: "from-amarelo/10 to-amarelo/5",
  },
  "viagens": {
    tagline: "A família aproveita a viagem, a profissional cuida dos pequenos",
    description:
      "Para viagens onde os pais querem curtir cada momento sem sobrecarga. A profissional acompanha toda a família, mantendo a rotina e os cuidados das crianças durante toda a viagem.",
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
    color: "roxo",
    bgGradient: "from-roxo/10 to-roxo/5",
  },
};

const COLOR_MAP: Record<string, { text: string; bg: string; border: string; btn: string }> = {
  vermelho: {
    text: "text-vermelho",
    bg: "bg-vermelho",
    border: "border-vermelho",
    btn: "bg-vermelho hover:bg-vermelho/80",
  },
  verde: {
    text: "text-verde",
    bg: "bg-verde",
    border: "border-verde",
    btn: "bg-verde hover:bg-verde/80",
  },
  azul: {
    text: "text-azul",
    bg: "bg-azul",
    border: "border-azul",
    btn: "bg-azul hover:bg-azul/80",
  },
  rosa: {
    text: "text-rosa",
    bg: "bg-rosa",
    border: "border-rosa",
    btn: "bg-rosa hover:bg-rosa/80",
  },
  amarelo: {
    text: "text-amarelo",
    bg: "bg-amarelo",
    border: "border-amarelo",
    btn: "bg-amarelo hover:bg-amarelo/80",
  },
  roxo: {
    text: "text-roxo",
    bg: "bg-roxo",
    border: "border-roxo",
    btn: "bg-roxo hover:bg-roxo/80",
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

  const colors = COLOR_MAP[service.color] ?? COLOR_MAP["vermelho"];

  const SEO_TITLES: Record<string, string> = {
    "nanny-cuidar": "Babá para Rotina Diária em Santos · Nanny Cuidar — Cuidar & Crescer",
    "nanny-desenvolver": "Babá Especializada em Desenvolvimento Infantil · Santos SP",
    "vale-night": "Babá Noturna em Santos · Vale Night — Cuidar & Crescer",
    "aulas-particulares": "Aulas Particulares e Reforço Escolar em Santos SP",
    "eventos": "Babá para Eventos e Festas em Santos · Cuidar & Crescer",
    "viagens": "Babá para Viagens · Acompanhamento Infantil — Cuidar & Crescer",
  };

  const SEO_DESCRIPTIONS: Record<string, string> = {
    "nanny-cuidar": "Babá profissional para cuidado diário em Santos SP. Refeições, escola, banho e atividades. Fale pelo WhatsApp e receba uma proposta personalizada.",
    "nanny-desenvolver": "Babá com foco em desfralde, seletividade alimentar e estimulação sensorial em Santos. Profissionais com formação específica. Consulte pelo WhatsApp.",
    "vale-night": "Babá para cuidado noturno em Santos SP. Pacotes de 4h a 12h, inclui transporte. Fale pelo WhatsApp para saber os valores.",
    "aulas-particulares": "Reforço escolar e aulas particulares para crianças em Santos. Professoras selecionadas. Consulte disponibilidade e valores pelo WhatsApp.",
    "eventos": "Babá profissional para acompanhamento em eventos, festas e reuniões em Santos. Consulte valores e disponibilidade pelo WhatsApp.",
    "viagens": "Babá para acompanhar sua família em viagens nacionais e internacionais. Santos e região. Consulte pelo WhatsApp.",
  };

  const seoTitle = SEO_TITLES[service.id] ?? `${service.name} — Cuidar & Crescer`;
  const seoDescription = SEO_DESCRIPTIONS[service.id] ?? content.description;
  const canonicalUrl = `https://babascuidarecrescer.com.br/services/${service.id}`;

  return (
    <div className="pt-20 lg:pt-24">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
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
              <Calculator className="w-4 h-4 mr-2 inline" /> Solicitar Orçamento
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

      {/* Ideal for */}
      {content.idealFor && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-6">
              Ideal para famílias que buscam
            </h2>
            <ul className="space-y-3 max-w-lg mx-auto">
              {content.idealFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`${colors.text} mt-1 flex-shrink-0`}>
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">
            Por que escolher o <span className={colors.text}>{service.name}</span>?
          </h2>
          <div className={`grid sm:grid-cols-2 gap-6 max-w-6xl mx-auto ${content.benefits.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
            {content.benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div
                  className={`${colors.bg} text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <ServiceIcon name={b.icon} className="w-5 h-5" />
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
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA — Valores */}
      <section className={`py-14 bg-gradient-to-br ${content.bgGradient}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Quer saber os valores?
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Os valores variam conforme sua necessidade e disponibilidade. Fale com a gente pelo WhatsApp para receber uma proposta personalizada.
            </p>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("service_pricing_cta")}
            >
              <Button className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transform hover:scale-105 transition-all">
                <WhatsAppIcon className="w-4 h-4 mr-2 inline" /> Consultar valores no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Exclusive Benefits */}
      {content.exclusiveBenefits && (
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-center mb-10">
                Benefícios <span className={colors.text}>Exclusivos</span> Mensalistas
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {content.exclusiveBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`${colors.text} mt-0.5 flex-shrink-0`}>
                      <Star className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          {content.ctaPhrase && (
            <p className={`text-lg lg:text-xl ${colors.text} font-medium mb-8 max-w-2xl mx-auto italic`}>
              "{content.ctaPhrase}"
            </p>
          )}
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
              <Calculator className="w-4 h-4 mr-2 inline" /> Solicitar Orçamento
            </Button>
            <Button
              variant="outline"
              className="px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-300 text-gray-600 hover:border-gray-400 transition-colors"
              asChild
            >
              <a href="/#servicos">
                <ArrowLeft className="w-4 h-4 mr-2 inline" /> Ver todos os serviços
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

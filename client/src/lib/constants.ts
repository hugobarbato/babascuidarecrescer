import { Service, PricingRow } from "./types";
import nannyCuidarImg from "@assets/nanny-cuidar.jpg";
import nannyDesenvolverImg from "@assets/nanny-desenvolver.jpg";
import valeNightImg from "@assets/vale-night.jpg";
import aulaParticularImg from "@assets/aula-particular.jpg";
import acompanhamentoViagensImg from "@assets/acompanhamento-viagens.jpg";
import acompanhamentoEventosImg from "@assets/acompanhamento-eventos.jpg";

export const SERVICES: Service[] = [
  {
    id: "nanny-cuidar",
    name: "Nanny Cuidar",
    description: "Rotina do dia a dia completa: refeições, banho, escola, deveres, organização e atividades extracurriculares. Ideal para famílias que precisam de maior carga horária.",
    icon: "fas fa-heart",
    color: "vermelho",
    bgGradient: "from-vermelho/10 to-vermelho/5",
    price: "A partir de R$130/dia",
    badge: "Pacotes mensalistas",
    image: nannyCuidarImg,
    category: "mensalista"
  },
  {
    id: "nanny-desenvolver", 
    name: "Nanny Desenvolver",
    description: "Atividades personalizadas com profissionais especializados. Ideal para necessidades específicas como seletividade alimentar, desfralde e desenvolvimento.",
    icon: "fas fa-seedling",
    color: "verde",
    bgGradient: "from-verde/10 to-verde/5",
    price: "A partir de R$150/dia",
    badge: "Profissionais especializados",
    image: nannyDesenvolverImg,
    category: "mensalista"
  },
  {
    id: "vale-night",
    name: "Vale Night", 
    description: "Rotina noturna completa para que os pais tenham uma noite especial. Banho, jantar, histórias e colocar para dormir com todo cuidado.",
    icon: "fas fa-moon",
    color: "azul",
    bgGradient: "from-azul/10 to-azul/5",
    price: "R$160 - R$340",
    badge: "Pacotes de 4h a 12h",
    image: valeNightImg,
    category: "avulso"
  },
  {
    id: "aulas-particulares",
    name: "Aulas Particulares",
    description: "Reforço escolar e aulas particulares com professoras capacitadas. Apoio nas tarefas, reforço em disciplinas, preparação para provas e organização da rotina de estudos.",
    icon: "fas fa-book-open",
    color: "rosa",
    bgGradient: "from-rosa/10 to-rosa/5",
    price: "A partir de R$80/h",
    badge: "Pacotes mensais disponíveis",
    image: aulaParticularImg,
    category: "avulso"
  },
  {
    id: "eventos",
    name: "Acompanhamento em Eventos",
    description: "Cuidado durante festas, eventos comerciais ou trabalho. Atividades calmas, auxílio em refeições e total atenção aos pequenos.",
    icon: "fas fa-calendar-alt",
    color: "amarelo", 
    bgGradient: "from-amarelo/10 to-amarelo/5",
    price: "A partir de R$40/h",
    badge: "+R$10/h por criança (acima de 2)",
    image: acompanhamentoEventosImg,
    category: "avulso"
  },
  {
    id: "viagens",
    name: "Acompanhamento em Viagens",
    description: "Acompanhamento em viagens para que os pais aproveitem com tranquilidade. Cuidamos de higiene, brincadeiras, horários e refeições.",
    icon: "fas fa-suitcase",
    color: "roxo",
    bgGradient: "from-roxo/10 to-roxo/5", 
    price: "R$150/diária",
    badge: "+R$40 por criança extra",
    image: acompanhamentoViagensImg,
    category: "avulso"
  }
];

export const PRICING_TABLE: PricingRow[] = [
  {
    service: "Nanny Cuidar",
    description: "Cuidado e rotina diária — Pacotes mensalistas",
    weekday: "Essencial (5-6h): R$ 130/dia\nTranquilidade (7-8h): R$ 180/dia\nPremium (9-10h): R$ 225/dia",
    weekend: "Transporte já incluso",
    additional: "Hora extra: R$ 30\nTransporte extra: R$ 20\nFDS e feriados: hora extra"
  },
  {
    service: "Nanny Desenvolver",
    description: "Desenvolvimento infantil especializado — Pacotes mensalistas",
    weekday: "Essencial (5-6h): R$ 150/dia\nTranquilidade (7-8h): R$ 180/dia\nPremium (9-10h): R$ 225/dia",
    weekend: "Transporte já incluso",
    additional: "Hora extra: R$ 30\nTransporte extra: R$ 20\nFDS e feriados: hora extra"
  },
  {
    service: "Vale Night",
    description: "Cuidado noturno especializado",
    weekday: "4h: R$ 160\n6h: R$ 210\n8h: R$ 230\n12h: R$ 280",
    weekend: "4h: R$ 180\n6h: R$ 230\n8h: R$ 260\n12h: R$ 340",
    additional: "R$ 20 transporte incluso\nHora extra: R$ 40\nCriança extra: +R$ 50"
  },
  {
    service: "Aulas Particulares",
    description: "Reforço escolar e aulas individuais",
    weekday: "R$ 80/hora-aula",
    weekend: "R$ 90/hora-aula",
    additional: "Pacote 2x/sem: R$ 500/mês\nPacote 3x/sem: R$ 600/mês\nTransporte incluso nos pacotes"
  },
  {
    service: "Acompanhamento em Eventos",
    description: "Cuidado em festas e eventos",
    weekday: "R$ 40/hora",
    weekend: "R$ 45/hora",
    additional: "Transporte: R$ 20/dia\nCriança extra: +R$ 10/h (acima de 2)"
  },
  {
    service: "Acompanhamento em Viagens", 
    description: "Hospedagem, alimentação e transporte pela família",
    weekday: "R$ 150/diária",
    weekend: "R$ 150/diária",
    additional: "Criança extra: +R$ 40"
  }
];

export const COMPANY_INFO = {
  name: "Cuidar & Crescer",
  phone: "+55 13 99809-0998",
  whatsapp: "5513998090998",
  email: "espacocuidarecrescer@gmail.com",
  instagram: "https://www.instagram.com/babascuidarecrescer/",
  founded: "2022",
  mission: "Proporcionar uma rede de apoio com segurança, cuidado e desenvolvimento infantil de qualidade, conectando famílias a babás confiáveis e capacitadas.",
  vision: "Ser referência em serviços de cuidados infantis, reconhecida pela excelência e confiança no atendimento às famílias.",
  values: "Segurança, confiança, empatia, profissionalismo e responsabilidade, evitar uso de telas, linguagem respeitosa e compreensível."
};

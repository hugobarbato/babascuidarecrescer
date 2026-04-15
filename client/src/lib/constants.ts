import { Service } from "./types";
import nannyCuidarImg from "@assets/nanny-cuidar.webp";
import nannyDesenvolverImg from "@assets/nanny-desenvolver.webp";
import valeNightImg from "@assets/vale-night.webp";
import aulaParticularImg from "@assets/aula-particular.webp";
import acompanhamentoViagensImg from "@assets/acompanhamento-viagens.webp";
import acompanhamentoEventosImg from "@assets/acompanhamento-eventos.webp";

export const SERVICES: Service[] = [
  {
    id: "nanny-cuidar",
    name: "Nanny Cuidar",
    description: "Rotina do dia a dia completa: refeições, banho, escola, deveres, organização e atividades extracurriculares. Ideal para famílias que precisam de maior carga horária.",
    icon: "fas fa-heart",
    color: "vermelho",
    bgGradient: "from-vermelho/10 to-vermelho/5",
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
    badge: "Criança adicional: consulte",
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
    badge: "Criança extra: consulte",
    image: acompanhamentoViagensImg,
    category: "avulso"
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

import { Service, PricingRow } from "./types";

export const SERVICES: Service[] = [
  {
    id: "nanny-cuidar",
    name: "Nanny Cuidar",
    description: "Rotina do dia a dia completa: refeições, banho, escola, deveres, organização e atividades extracurriculares. Ideal para famílias que precisam de maior carga horária.",
    icon: "fas fa-heart",
    color: "coral",
    bgGradient: "from-coral/10 to-orange-100",
    price: "A partir de R$50/h",
    badge: "+R$5 após 22h",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "nanny-desenvolver", 
    name: "Nanny Desenvolver",
    description: "Atividades personalizadas com profissionais especializados. Ideal para necessidades específicas como seletividade alimentar, desfralde e desenvolvimento.",
    icon: "fas fa-seedling",
    color: "sage",
    bgGradient: "from-sage/10 to-green-100",
    price: "A partir de R$70/h",
    badge: "Profissionais especializados",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "vale-night",
    name: "Vale Night", 
    description: "Rotina noturna completa para que os pais tenham uma noite especial. Banho, jantar, histórias e colocar para dormir com todo cuidado.",
    icon: "fas fa-moon",
    color: "soft-blue",
    bgGradient: "from-soft-blue/10 to-blue-100",
    price: "R$150 - R$300",
    badge: "Meio ou turno completo",
    image: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "eventos",
    name: "Acompanhamento em Eventos",
    description: "Cuidado durante festas, eventos comerciais ou trabalho. Atividades calmas, auxílio em refeições e total atenção aos pequenos.",
    icon: "fas fa-calendar-alt",
    color: "soft-purple", 
    bgGradient: "from-soft-purple/10 to-purple-100",
    price: "A partir de R$70/h",
    badge: "+R$10 por criança extra",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "viagens",
    name: "Acompanhamento em Viagens",
    description: "Acompanhamento em viagens para que os pais aproveitem com tranquilidade. Cuidamos de higiene, brincadeiras, horários e refeições.",
    icon: "fas fa-suitcase",
    color: "soft-pink",
    bgGradient: "from-soft-pink/10 to-pink-100", 
    price: "R$200/diária",
    badge: "+R$50 por criança/dia",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  },
  {
    id: "mensalista",
    name: "Mensalista",
    description: "Orçamento personalizado baseado na quantidade de dias da semana e carga horária diária desejada. Valor fixo mensal.",
    icon: "fas fa-calendar-check",
    color: "yellow-600",
    bgGradient: "from-yellow-50 to-yellow-100",
    price: "A partir de R$2.800",
    badge: "Orçamento personalizado",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
  }
];

export const PRICING_TABLE: PricingRow[] = [
  {
    service: "Serviços Avulsos",
    description: "Nanny Cuidar • Desenvolver • Eventos",
    weekday: "1ª hora: R$ 50,00\nDemais: R$ 30,00/h",
    weekend: "1ª hora: R$ 60,00\nDemais: R$ 35,00/h", 
    additional: "Após 22h: +R$ 5,00/h\nPor criança extra: +R$ 10,00/h"
  },
  {
    service: "Vale Night",
    description: "Cuidado noturno especializado",
    weekday: "Meio turno: R$ 150,00\nTurno completo: R$ 280,00",
    weekend: "Meio turno: R$ 180,00\nTurno completo: R$ 300,00",
    additional: "Meio turno: +R$ 50,00\nTurno completo: +R$ 100,00"
  },
  {
    service: "Acompanhamento em Viagens", 
    description: "Família provê acomodação e transporte",
    weekday: "R$ 200,00/diária",
    weekend: "R$ 200,00/diária",
    additional: "Por criança extra: +R$ 50,00/dia"
  },
  {
    service: "Planos Mensalistas",
    description: "Orçamento personalizado", 
    weekday: "Calculado conforme dias/semana e carga horária",
    weekend: "Exemplo: Turno completo R$ 2.800,00/mês",
    additional: "Orçamento personalizado"
  }
];

export const COMPANY_INFO = {
  name: "Cuidar & Crescer",
  phone: "+55 13 99630-9340",
  whatsapp: "5513996309340",
  email: "espacocuidarecrescer@gmail.com",
  founded: "2022",
  mission: "Proporcionar uma rede de apoio com segurança, cuidado e desenvolvimento infantil de qualidade, conectando famílias a babás confiáveis e capacitadas.",
  vision: "Ser referência em serviços de cuidados infantis, reconhecida pela excelência e confiança no atendimento às famílias.",
  values: "Segurança, confiança, empatia, profissionalismo e responsabilidade, evitar uso de telas, linguagem respeitosa e compreensível."
};

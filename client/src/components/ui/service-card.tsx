import { Link } from "wouter";
import { Button } from "./button";
import { Service } from "@/lib/types";
import { ServiceIcon, CalendarCheck, Clock, Info } from "@/lib/icons";

interface ServiceCardProps {
  service: Service;
  onRequestQuote: () => void;
  detailHref?: string;
}

export function ServiceCard({ service, onRequestQuote, detailHref }: ServiceCardProps) {
  const getColorClasses = () => {
    switch (service.color) {
      case "vermelho": return { text: "text-vermelho", bg: "bg-vermelho", border: "border-vermelho", hover: "hover:bg-vermelho" };
      case "verde":    return { text: "text-verde",    bg: "bg-verde",    border: "border-verde",    hover: "hover:bg-verde" };
      case "azul":     return { text: "text-azul",     bg: "bg-azul",     border: "border-azul",     hover: "hover:bg-azul" };
      case "rosa":     return { text: "text-rosa",     bg: "bg-rosa",     border: "border-rosa",     hover: "hover:bg-rosa" };
      case "amarelo":  return { text: "text-amarelo",  bg: "bg-amarelo",  border: "border-amarelo",  hover: "hover:bg-amarelo" };
      case "roxo":     return { text: "text-roxo",     bg: "bg-roxo",     border: "border-roxo",     hover: "hover:bg-roxo" };
      default:         return { text: "text-vermelho", bg: "bg-vermelho", border: "border-vermelho", hover: "hover:bg-vermelho" };
    }
  };

  const getBadgeClasses = () => {
    switch (service.color) {
      case "vermelho": return "bg-vermelho/20 text-vermelho";
      case "verde":    return "bg-verde/20 text-verde";
      case "azul":     return "bg-azul/20 text-azul";
      case "rosa":     return "bg-rosa/20 text-rosa";
      case "amarelo":  return "bg-amarelo/20 text-amarelo";
      case "roxo":     return "bg-roxo/20 text-roxo";
      default:         return "bg-vermelho/20 text-vermelho";
    }
  };

  const colors = getColorClasses();
  const badgeClasses = getBadgeClasses();
  const categoryLabel = service.category === "mensalista" ? "Mensalista" : "Avulso";
  const categoryClasses = service.category === "mensalista"
    ? "bg-warm-gray/10 text-warm-gray"
    : "bg-azul/10 text-azul";

  return (
    <div className={`bg-gradient-to-br ${service.bgGradient} rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col h-full overflow-hidden`}>
      <div className="relative h-44 overflow-hidden">
        <img
          src={service.image}
          alt={`${service.name} — babá profissional em Santos`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className={`absolute bottom-3 left-4 ${colors.text} bg-white/90 rounded-full p-2 shadow`}>
          <ServiceIcon name={service.icon} className="w-5 h-5" />
        </div>
        <div className={`absolute top-3 right-4 text-xs px-3 py-1 rounded-full font-semibold ${categoryClasses}`}>
          {service.category === "mensalista"
            ? <CalendarCheck className="w-3 h-3 mr-1 inline" />
            : <Clock className="w-3 h-3 mr-1 inline" />}
          {categoryLabel}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
      <h3 className="text-2xl font-bold mb-4 text-warm-gray">{service.name}</h3>

      <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
        {service.description}
      </p>

      <div className="flex justify-between items-center mb-6">
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${badgeClasses}`}>
          {service.badge}
        </span>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        {detailHref && (
          <Link href={detailHref}>
            <Button
              variant="outline"
              className={`w-full py-3 px-6 rounded-full font-semibold border-2 ${colors.text} ${colors.border} hover:text-white ${colors.hover} transition-colors`}
            >
              <Info className="w-4 h-4 mr-2 inline" /> Saiba mais
            </Button>
          </Link>
        )}
        <Button
          onClick={onRequestQuote}
          className={`w-full py-3 px-6 rounded-full font-semibold text-white ${colors.bg} ${colors.hover} transition-colors`}
        >
          Solicitar Orçamento
        </Button>
      </div>
      </div>
    </div>
  );
}


import { Link } from "wouter";
import { Button } from "./button";
import { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
  onRequestQuote: () => void;
  detailHref?: string;
}

export function ServiceCard({ service, onRequestQuote, detailHref }: ServiceCardProps) {
  const getColorClasses = () => {
    switch (service.color) {
      case "coral":       return { text: "text-coral",       bg: "bg-coral",       border: "border-coral",       hover: "hover:bg-coral" };
      case "sage":        return { text: "text-sage",        bg: "bg-sage",        border: "border-sage",        hover: "hover:bg-sage" };
      case "soft-blue":   return { text: "text-soft-blue",   bg: "bg-soft-blue",   border: "border-soft-blue",   hover: "hover:bg-soft-blue" };
      case "soft-purple": return { text: "text-soft-purple", bg: "bg-soft-purple", border: "border-soft-purple", hover: "hover:bg-soft-purple" };
      case "soft-pink":   return { text: "text-soft-pink",   bg: "bg-soft-pink",   border: "border-soft-pink",   hover: "hover:bg-soft-pink" };
      case "yellow-600":  return { text: "text-yellow-600",  bg: "bg-yellow-500",  border: "border-yellow-500",  hover: "hover:bg-yellow-600" };
      default:            return { text: "text-coral",       bg: "bg-coral",       border: "border-coral",       hover: "hover:bg-coral" };
    }
  };

  const getBadgeClasses = () => {
    switch (service.color) {
      case "coral":       return "bg-coral/20 text-coral";
      case "sage":        return "bg-sage/20 text-sage";
      case "soft-blue":   return "bg-soft-blue/20 text-soft-blue";
      case "soft-purple": return "bg-soft-purple/20 text-soft-purple";
      case "soft-pink":   return "bg-soft-pink/20 text-soft-pink";
      case "yellow-600":  return "bg-yellow-200 text-yellow-700";
      default:            return "bg-coral/20 text-coral";
    }
  };

  const colors = getColorClasses();
  const badgeClasses = getBadgeClasses();

  return (
    <div className={`bg-gradient-to-br ${service.bgGradient} rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col h-full overflow-hidden`}>
      <div className="relative h-44 overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className={`absolute bottom-3 left-4 ${colors.text} bg-white/90 rounded-full p-2 shadow`}>
          <i className={`${service.icon} text-xl`}></i>
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
        <span className="text-lg font-bold text-warm-gray">{service.price}</span>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        {detailHref && (
          <Link href={detailHref}>
            <Button
              variant="outline"
              className={`w-full py-3 px-6 rounded-full font-semibold border-2 ${colors.text} ${colors.border} hover:text-white ${colors.hover} transition-colors`}
            >
              <i className="fas fa-info-circle mr-2"></i> Saiba mais
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


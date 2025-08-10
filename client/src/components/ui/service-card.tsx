import { Button } from "./button";
import { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
  onRequestQuote: () => void;
}

export function ServiceCard({ service, onRequestQuote }: ServiceCardProps) {
  const getColorClasses = () => {
    switch (service.color) {
      case 'coral':
        return 'text-coral hover:bg-coral';
      case 'sage':
        return 'text-sage hover:bg-sage';
      case 'soft-blue':
        return 'text-soft-blue hover:bg-soft-blue';
      case 'soft-purple':
        return 'text-soft-purple hover:bg-soft-purple';
      case 'soft-pink':
        return 'text-soft-pink hover:bg-soft-pink';
      case 'yellow-600':
        return 'text-yellow-600 hover:bg-yellow-600';
      default:
        return 'text-coral hover:bg-coral';
    }
  };

  const getBadgeClasses = () => {
    switch (service.color) {
      case 'coral':
        return 'bg-coral/20 text-coral';
      case 'sage':
        return 'bg-sage/20 text-sage';
      case 'soft-blue':
        return 'bg-soft-blue/20 text-soft-blue';
      case 'soft-purple':
        return 'bg-soft-purple/20 text-soft-purple';
      case 'soft-pink':
        return 'bg-soft-pink/20 text-soft-pink';
      case 'yellow-600':
        return 'bg-yellow-200 text-yellow-700';
      default:
        return 'bg-coral/20 text-coral';
    }
  };

  const colorClasses = getColorClasses();
  const badgeClasses = getBadgeClasses();

  return (
    <div className={`bg-gradient-to-br ${service.bgGradient} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
      <div className={`${colorClasses.split(' ')[0]} text-4xl mb-4`}>
        <i className={service.icon}></i>
      </div>
      
      <h3 className="text-2xl font-bold mb-4 text-warm-gray">{service.name}</h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {service.description}
      </p>
      
      <div className="flex justify-between items-center mb-6">
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${badgeClasses}`}>
          {service.badge}
        </span>
        <span className="text-lg font-bold text-warm-gray">{service.price}</span>
      </div>
      
      <Button 
        onClick={onRequestQuote}
        className={`w-full py-3 px-6 rounded-full font-semibold transition-colors text-white ${colorClasses}`}
      >
        Solicitar Orçamento
      </Button>
    </div>
  );
}

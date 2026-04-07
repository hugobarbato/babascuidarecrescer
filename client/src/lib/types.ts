export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  price: string;
  badge?: string;
  image: string;
  category: "mensalista" | "avulso";
}

export interface PricingRow {
  service: string;
  description: string;
  weekday: string;
  weekend: string;
  additional: string;
}

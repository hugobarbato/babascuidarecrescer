export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  price: string;
  badge?: string;
}

export interface PricingRow {
  service: string;
  description: string;
  weekday: string;
  weekend: string;
  additional: string;
}

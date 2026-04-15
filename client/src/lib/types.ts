export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  badge?: string;
  image: string;
  category: "mensalista" | "avulso";
}

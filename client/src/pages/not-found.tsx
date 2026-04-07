import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { COMPANY_INFO } from "@/lib/constants";
import { WhatsAppIcon, Home } from "@/lib/icons";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bege via-white to-azul/10 pt-20">
      <Helmet>
        <title>Página não encontrada · Cuidar & Crescer</title>
        <meta name="description" content="A página que você procura não existe. Volte para a página inicial da Cuidar & Crescer." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="text-center px-4 max-w-lg">
        <p className="text-8xl font-bold text-vermelho mb-4">404</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          Página não encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          Desculpe, a página que você procura não existe ou foi movida.
          Que tal voltar ao início?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-vermelho text-white px-6 py-3 rounded-full font-semibold hover:bg-vermelho/80 transition-all">
              <Home className="w-4 h-4 mr-2 inline" /> Ir para o Início
            </Button>
          </Link>
          <a
            href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-all">
              <WhatsAppIcon className="w-4 h-4 mr-2 inline" /> Falar no WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

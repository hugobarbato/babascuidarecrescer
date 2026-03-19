import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SERVICES, COMPANY_INFO } from "@/lib/constants";

interface HeaderProps {
  onOpenQuoteModal: () => void;
}

export function Header({ onOpenQuoteModal }: HeaderProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const isHome = location === "/";

  const anchorLinks = [
    { name: "Serviços", href: "/#servicos" },
    { name: "Valores", href: "/#valores" },
    { name: "Sobre", href: "/#sobre" },
    { name: "Contato", href: "/#contato" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <nav className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${isHome && !window.location.hash ? "text-coral" : "text-gray-700 hover:text-coral"}`}
            >
              Início
            </Link>

            {/* Serviços dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-gray-700 hover:text-coral transition-colors focus:outline-none">
                  Serviços
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {SERVICES.map((service) => (
                  <DropdownMenuItem key={service.id} asChild>
                    <a href={`/services/${service.id}`} className="flex items-center gap-2 cursor-pointer">
                      <i className={`${service.icon} text-sm text-coral`}></i>
                      {service.name}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {anchorLinks.slice(1).map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-coral transition-colors"
              >
                {item.name}
              </a>
            ))}

            <a
              href={COMPANY_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <Button
              onClick={onOpenQuoteModal}
              className="bg-coral text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors shadow-lg font-medium"
            >
              Solicitar Orçamento
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-3">
            <a
              href={COMPANY_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <Button
              onClick={onOpenQuoteModal}
              className="bg-coral text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500"
            >
              Orçamento
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <i className="fas fa-bars text-xl"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-1 mt-6">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className={`text-lg py-3 transition-colors ${isHome ? "text-coral" : "text-gray-700 hover:text-coral"}`}
                  >
                    Início
                  </Link>

                  {/* Serviços com sub-lista */}
                  <button
                    onClick={() => setIsServicesOpen((prev) => !prev)}
                    className="flex items-center justify-between text-lg py-3 text-gray-700 hover:text-coral transition-colors w-full text-left"
                  >
                    Serviços
                    <i className={`fas fa-chevron-${isServicesOpen ? "up" : "down"} text-sm`}></i>
                  </button>
                  {isServicesOpen && (
                    <div className="pl-4 flex flex-col space-y-1 mb-2">
                      {SERVICES.map((service) => (
                        <a
                          key={service.id}
                          href={`/services/${service.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 text-sm py-2 text-gray-600 hover:text-coral transition-colors"
                        >
                          <i className={`${service.icon} text-coral`}></i>
                          {service.name}
                        </a>
                      ))}
                    </div>
                  )}

                  {anchorLinks.slice(1).map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg py-3 text-gray-700 hover:text-coral transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
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

    { name: "Sobre nós", href: "/#sobre" },
    { name: "Contato", href: "/#contato" },
    { name: "Trabalhe Conosco", href: "/trabalhe-conosco" },
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
              className={`transition-colors ${isHome && !window.location.hash ? "text-vermelho" : "text-gray-700 hover:text-vermelho"}`}
            >
              Início
            </Link>

            {/* Serviços dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-gray-700 hover:text-vermelho transition-colors focus:outline-none">
                  Serviços
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-vermelho/70 font-semibold">
                  <i className="fas fa-calendar-check mr-1.5"></i>Planos Mensais
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {SERVICES.filter((s) => s.category === "mensalista").map((service) => (
                    <DropdownMenuItem key={service.id} asChild>
                      <a href={`/services/${service.id}`} className="flex items-center gap-2 cursor-pointer">
                        <i className={`${service.icon} text-sm text-vermelho`}></i>
                        {service.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-azul/70 font-semibold">
                  <i className="fas fa-clock mr-1.5"></i>Serviços Avulsos
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {SERVICES.filter((s) => s.category === "avulso").map((service) => (
                    <DropdownMenuItem key={service.id} asChild>
                      <a href={`/services/${service.id}`} className="flex items-center gap-2 cursor-pointer">
                        <i className={`${service.icon} text-sm text-vermelho`}></i>
                        {service.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {anchorLinks.slice(1).map((item) =>
              item.href.startsWith("/#") ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-vermelho transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-vermelho transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}

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
              className="bg-vermelho text-white px-6 py-2 rounded-full hover:bg-vermelho/80 transition-colors shadow-lg font-medium"
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
              className="bg-vermelho text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-vermelho/80"
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
                    className={`text-lg py-3 transition-colors ${isHome ? "text-vermelho" : "text-gray-700 hover:text-vermelho"}`}
                  >
                    Início
                  </Link>

                  {/* Serviços com sub-lista */}
                  <button
                    onClick={() => setIsServicesOpen((prev) => !prev)}
                    className="flex items-center justify-between text-lg py-3 text-gray-700 hover:text-vermelho transition-colors w-full text-left"
                  >
                    Serviços
                    <i className={`fas fa-chevron-${isServicesOpen ? "up" : "down"} text-sm`}></i>
                  </button>
                  {isServicesOpen && (
                    <div className="pl-4 flex flex-col space-y-1 mb-2">
                      <span className="text-xs uppercase tracking-wider text-vermelho/70 font-semibold pt-1 pb-1">
                        <i className="fas fa-calendar-check mr-1.5"></i>Planos Mensais
                      </span>
                      {SERVICES.filter((s) => s.category === "mensalista").map((service) => (
                        <a
                          key={service.id}
                          href={`/services/${service.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 text-sm py-2 text-gray-600 hover:text-vermelho transition-colors"
                        >
                          <i className={`${service.icon} text-vermelho`}></i>
                          {service.name}
                        </a>
                      ))}
                      <span className="text-xs uppercase tracking-wider text-azul/70 font-semibold pt-2 pb-1 border-t border-gray-100 mt-1">
                        <i className="fas fa-clock mr-1.5"></i>Serviços Avulsos
                      </span>
                      {SERVICES.filter((s) => s.category === "avulso").map((service) => (
                        <a
                          key={service.id}
                          href={`/services/${service.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 text-sm py-2 text-gray-600 hover:text-vermelho transition-colors"
                        >
                          <i className={`${service.icon} text-vermelho`}></i>
                          {service.name}
                        </a>
                      ))}
                    </div>
                  )}

                  {anchorLinks.slice(1).map((item) =>
                    item.href.startsWith("/#") ? (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg py-3 text-gray-700 hover:text-vermelho transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg py-3 text-gray-700 hover:text-vermelho transition-colors"
                      >
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

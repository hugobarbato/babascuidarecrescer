import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";

interface HeaderProps {
  onOpenQuoteModal: () => void;
}

export function Header({ onOpenQuoteModal }: HeaderProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Serviços", href: "/services" },
    { name: "Valores", href: "/values" },
    { name: "Sobre", href: "/about" },
    { name: "Contato", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

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
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "text-coral"
                    : "text-gray-700 hover:text-coral"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button
              onClick={onOpenQuoteModal}
              className="bg-coral text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors shadow-lg font-medium"
            >
              Solicitar Orçamento
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-4">
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
                <div className="flex flex-col space-y-4 mt-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg py-3 transition-colors ${
                        isActive(item.href)
                          ? "text-coral"
                          : "text-gray-700 hover:text-coral"
                      }`}
                    >
                      {item.name}
                    </Link>
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

import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuoteModal } from "@/components/quote/quote-modal";
import { QuoteResultModal } from "@/components/quote/quote-result";
import { useQuote } from "@/hooks/use-quote";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Values from "@/pages/values";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isQuoteResultOpen, setIsQuoteResultOpen] = useState(false);
  const [initialService, setInitialService] = useState<string>();
  
  const { calculateQuote, isLoading, result } = useQuote();

  const handleOpenQuoteModal = (service?: string) => {
    setInitialService(service);
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setInitialService(undefined);
  };

  const handleQuoteSubmit = (data: any) => {
    calculateQuote(data, {
      onSuccess: () => {
        setIsQuoteModalOpen(false);
        setIsQuoteResultOpen(true);
      }
    });
  };

  const handleRecalculate = () => {
    setIsQuoteResultOpen(false);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenQuoteModal={handleOpenQuoteModal} />
      
      <main>
        <Switch>
          <Route path="/" component={() => <Home onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/services" component={() => <Services onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/values" component={() => <Values onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={() => <Contact onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer onOpenQuoteModal={handleOpenQuoteModal} />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={handleCloseQuoteModal}
        onSubmit={handleQuoteSubmit}
        isLoading={isLoading}
        initialService={initialService}
      />

      <QuoteResultModal
        isOpen={isQuoteResultOpen}
        onClose={() => setIsQuoteResultOpen(false)}
        result={result || null}
        onRecalculate={handleRecalculate}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

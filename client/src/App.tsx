import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { trackPageView, trackQuoteModalOpen } from "@/lib/analytics";
import { useScrollDepth } from "@/hooks/use-scroll-depth";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuoteModal } from "@/components/quote/quote-modal";
import { QuoteResultModal } from "@/components/quote/quote-result";
import { useQuote } from "@/hooks/use-quote";
import Home from "@/pages/home";
import ServiceDetail from "@/pages/service-detail";
import WorkWithUs from "@/pages/work-with-us";
import NotFound from "@/pages/not-found";

function Router() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isQuoteResultOpen, setIsQuoteResultOpen] = useState(false);
  const [initialService, setInitialService] = useState<string>();
  const [quoteData, setQuoteData] = useState<any>(null);
  const [location] = useLocation();
  
  const { calculateQuote, isLoading, result } = useQuote();

  useScrollDepth();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(location);
  }, [location]);

  const handleOpenQuoteModal = (service?: string) => {
    setInitialService(service);
    setIsQuoteModalOpen(true);
    trackQuoteModalOpen(service);
  };

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setInitialService(undefined);
  };

  const handleQuoteSubmit = (data: any, recaptchaToken: string) => {
    setQuoteData(data);
    calculateQuote(data, recaptchaToken, {
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
          <Route path="/services/:id" component={() => <ServiceDetail onOpenQuoteModal={handleOpenQuoteModal} />} />
          <Route path="/trabalhe-conosco" component={() => <WorkWithUs onOpenQuoteModal={handleOpenQuoteModal} />} />
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
        quoteData={quoteData}
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

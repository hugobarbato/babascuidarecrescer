import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { trackPageView, trackQuoteModalOpen } from "@/lib/analytics";
import { useScrollDepth } from "@/hooks/use-scroll-depth";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactModal } from "@/components/quote/contact-modal";
import Home from "@/pages/home";
import ServiceDetail from "@/pages/service-detail";
import WorkWithUs from "@/pages/work-with-us";
import NotFound from "@/pages/not-found";

function Router() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [initialService, setInitialService] = useState<string>();
  const [location] = useLocation();

  useScrollDepth();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(location);
  }, [location]);

  const handleOpenQuoteModal = (service?: string) => {
    setInitialService(service);
    setIsContactModalOpen(true);
    trackQuoteModalOpen(service);
  };

  const handleCloseModal = () => {
    setIsContactModalOpen(false);
    setInitialService(undefined);
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

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseModal}
        initialService={initialService}
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
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

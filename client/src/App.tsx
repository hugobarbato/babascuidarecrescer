import { useState, useEffect, lazy, Suspense } from "react";
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

const ServiceDetail = lazy(() => import("@/pages/service-detail"));
const WorkWithUs = lazy(() => import("@/pages/work-with-us"));
const NotFound = lazy(() => import("@/pages/not-found"));

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
        <Suspense fallback={null}>
          <Switch>
            <Route path="/" component={() => <Home onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/services/:id" component={() => <ServiceDetail onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/trabalhe-conosco" component={() => <WorkWithUs onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

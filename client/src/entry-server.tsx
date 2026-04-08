import { renderToString } from "react-dom/server";
import { useSyncExternalStore } from "react";
import { Router as WouterRouter, Switch, Route } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Importação eager (sem lazy) — necessária para SSR renderizar o conteúdo
import Home from "@/pages/home";
import ServiceDetail from "@/pages/service-detail";
import WorkWithUs from "@/pages/work-with-us";
import NotFound from "@/pages/not-found";
import { SERVICES } from "@/lib/constants";

// Hook de localização estática para SSR — usa useSyncExternalStore com getServerSnapshot
// para compatibilidade com React 18 SSR (evita "Missing getServerSnapshot" do wouter)
function makeStaticHook(path: string) {
  const noop = (_listener: () => void) => () => {};
  const getSnapshot = () => path;
  return () => [useSyncExternalStore(noop, getSnapshot, getSnapshot), () => {}] as [string, (to: string) => void];
}

export function render(url: string): string {
  const hook = makeStaticHook(url);
  const queryClient = new QueryClient();
  const helmetContext = {};

  return renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <WouterRouter hook={hook}>
            <div className="min-h-screen bg-gray-50">
              <Header onOpenQuoteModal={() => {}} />
              <main>
                <Switch>
                  <Route path="/" component={() => <Home onOpenQuoteModal={() => {}} />} />
                  <Route path="/services/:id" component={() => <ServiceDetail onOpenQuoteModal={() => {}} />} />
                  <Route path="/trabalhe-conosco" component={() => <WorkWithUs onOpenQuoteModal={() => {}} />} />
                  <Route component={NotFound} />
                </Switch>
              </main>
              <Footer onOpenQuoteModal={() => {}} />
            </div>
          </WouterRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

// Lista de todas as rotas a pré-renderizar
export const routes: string[] = [
  "/",
  "/trabalhe-conosco",
  ...SERVICES.map((s) => `/services/${s.id}`),
];

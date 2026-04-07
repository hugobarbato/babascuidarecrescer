declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    hj: (...args: any[]) => void;
  }
}

function gtag(...args: any[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

export function trackPageView(path: string) {
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
  });
}

export function trackQuoteModalOpen(service?: string) {
  gtag("event", "quote_modal_open", {
    event_category: "engagement",
    service_name: service ?? "generic",
  });
}

export function trackQuoteSubmit() {
  gtag("event", "quote_submit", {
    event_category: "conversion",
  });
}

export function trackContactSubmit() {
  gtag("event", "contact_submit", {
    event_category: "conversion",
  });
}

export function trackJobApplicationSubmit() {
  gtag("event", "job_application_submit", {
    event_category: "conversion",
  });
}

export function trackWhatsAppClick(source: string) {
  gtag("event", "whatsapp_click", {
    event_category: "engagement",
    event_label: source,
  });
}

export function trackScrollDepth(percent: 50 | 90) {
  gtag("event", "scroll_depth", {
    event_category: "engagement",
    percent,
  });
}

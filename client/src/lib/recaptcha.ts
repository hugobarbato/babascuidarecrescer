let loadingPromise: Promise<void> | null = null;

export function loadRecaptcha(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as typeof window & { grecaptcha?: unknown }).grecaptcha) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise<void>((resolve, reject) => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
    if (!siteKey) { resolve(); return; }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar reCAPTCHA"));
    document.head.appendChild(script);
  });

  return loadingPromise;
}

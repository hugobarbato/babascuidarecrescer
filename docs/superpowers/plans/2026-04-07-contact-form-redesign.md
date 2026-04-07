# Contact Form Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken quote calculator modal with a minimal 3-field contact modal that drives conversion through WhatsApp, with e-mail as a secondary path.

**Architecture:** New `ContactModal` component replaces `QuoteModal`. The WhatsApp CTA is client-only (builds a `wa.me` URL from form data — no server call). The e-mail CTA posts to a new `/api/send-lead` endpoint using a new `leadCaptureSchema`. Dead code (quote calculator, result modal, use-quote hook) is deleted.

**Tech Stack:** React 18, react-hook-form + Zod, shadcn/ui, Express 4, Resend, ViaCEP public API, TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `shared/schema.ts` | Modify | Add `leadCaptureSchema` + `LeadCapture` type; remove `quoteRequestSchema`, `QuoteResult` |
| `client/src/components/quote/contact-modal.tsx` | Create | New minimal modal (replaces quote-modal) |
| `client/src/components/quote/quote-modal.tsx` | Delete | Replaced by contact-modal |
| `client/src/components/quote/quote-result.tsx` | Delete | Quote result modal no longer needed |
| `client/src/hooks/use-quote.ts` | Delete | Quote submission hook no longer needed |
| `client/src/lib/quote-calculator.ts` | Delete | Calculator removed |
| `client/src/lib/whatsapp.ts` | Create | Pure function to build the `wa.me` URL |
| `server/email.ts` | Modify | Add `sendLeadEmail`; remove `sendQuoteEmail` |
| `server/routes.ts` | Modify | Remove `/api/send-quote`; add `/api/send-lead` |
| `client/src/App.tsx` | Modify | Remove QuoteResultModal + useQuote; swap QuoteModal → ContactModal |

---

## Task 1: Update shared schema

**Files:**
- Modify: `shared/schema.ts`

- [ ] **Step 1: Replace quote schema with lead schema**

Open `shared/schema.ts`. Replace the entire file content with:

```typescript
import { z } from "zod";

export const leadCaptureSchema = z.object({
  serviceType: z.string().min(1, "Selecione um serviço"),
  clientName: z.string().min(2, "Informe seu nome"),
  cep: z.string().min(8, "CEP inválido"),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  // E-mail path only — both required together when present
  clientPhone: z.string().min(14, "WhatsApp inválido").optional(),
  clientEmail: z.string().email("E-mail inválido").optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  phone: z.string().min(14, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  serviceType: z.string().optional(),
  message: z.string().optional(),
});

export const jobApplicationSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  phone: z.string().min(14, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  city: z.string().min(2, "Informe sua cidade/região"),
  experience: z.string().optional(),
  courses: z.string().optional(),
});

export type LeadCapture = z.infer<typeof leadCaptureSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type JobApplication = z.infer<typeof jobApplicationSchema>;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run check
```

Expected: errors only in files that still import `QuoteRequest`/`QuoteResult` (we'll fix those next). If there are errors in `shared/schema.ts` itself, fix them before proceeding.

- [ ] **Step 3: Commit**

```bash
git add shared/schema.ts
git commit -m "feat: add leadCaptureSchema, remove quoteRequestSchema and QuoteResult"
```

---

## Task 2: Create WhatsApp URL builder

**Files:**
- Create: `client/src/lib/whatsapp.ts`

- [ ] **Step 1: Create the utility file**

```typescript
// client/src/lib/whatsapp.ts
const WHATSAPP_NUMBER = "5513998090998";

interface LeadData {
  clientName: string;
  serviceType: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export function buildWhatsAppUrl(data: LeadData): string {
  const location =
    data.neighborhood && data.city && data.state
      ? ` e estou em ${data.neighborhood}, ${data.city} - ${data.state}`
      : data.city && data.state
      ? ` e estou em ${data.city} - ${data.state}`
      : "";

  const message =
    `Olá! Me chamo ${data.clientName}, tenho interesse no serviço ${data.serviceType}${location}. Gostaria de mais informações sobre disponibilidade e valores.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npm run check
```

Expected: same errors as before (unrelated to this new file). No new errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/whatsapp.ts
git commit -m "feat: add WhatsApp URL builder utility"
```

---

## Task 3: Create ContactModal component

**Files:**
- Create: `client/src/components/quote/contact-modal.tsx`

- [ ] **Step 1: Create the component**

```typescript
// client/src/components/quote/contact-modal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LeadCapture, leadCaptureSchema } from "@shared/schema";
import { SERVICES } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export function ContactModal({ isOpen, onClose, initialService }: ContactModalProps) {
  const [emailMode, setEmailMode] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  const form = useForm<LeadCapture>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      serviceType: initialService ?? "",
      clientName: "",
      cep: "",
    },
  });

  // Sync initialService when modal re-opens for a specific service
  const serviceValue = form.watch("serviceType");
  if (initialService && serviceValue === "" && isOpen) {
    form.setValue("serviceType", initialService);
  }

  const neighborhood = form.watch("neighborhood");
  const city = form.watch("city");
  const state = form.watch("state");
  const locationResolved = !!(city && state);

  const handleCepChange = async (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const json = await res.json();
      if (!json.erro) {
        form.setValue("neighborhood", json.bairro || "");
        form.setValue("city", json.localidade || "");
        form.setValue("state", json.uf || "");
      }
    } catch {
      // network error — location fields stay empty
    } finally {
      setCepLoading(false);
    }
  };

  const handleWhatsApp = async () => {
    const valid = await form.trigger(["serviceType", "clientName", "cep"]);
    if (!valid) return;

    const values = form.getValues();
    const url = buildWhatsAppUrl({
      clientName: values.clientName,
      serviceType: values.serviceType,
      neighborhood: values.neighborhood,
      city: values.city,
      state: values.state,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    form.reset();
    setEmailMode(false);
    onClose();
  };

  const handleEmailSubmit = async (data: LeadCapture) => {
    setIsSubmitting(true);
    try {
      let recaptchaToken = "";
      if (siteKey) {
        await new Promise<void>((resolve) => grecaptcha.ready(resolve));
        recaptchaToken = await grecaptcha.execute(siteKey, { action: "lead_submit" });
      }
      await apiRequest("POST", "/api/send-lead", { ...data, recaptchaToken });
      toast({ title: "Mensagem enviada!", description: "Entraremos em contato em breve." });
      form.reset();
      setEmailMode(false);
      onClose();
    } catch {
      toast({ title: "Erro ao enviar", description: "Tente novamente ou entre em contato pelo WhatsApp.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setEmailMode(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Solicitar Atendimento
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-4">

            {/* Serviço */}
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço de interesse *</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nome */}
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Como prefere ser chamado(a)?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CEP */}
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="00000-000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                          const formatted = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
                          field.onChange(formatted);
                          handleCepChange(formatted);
                        }}
                      />
                      {cepLoading && (
                        <i className="fas fa-spinner fa-spin absolute right-3 top-3 text-gray-400 text-sm" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Localização auto-preenchida */}
            {locationResolved && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm text-orange-800">
                📍 {neighborhood ? `${neighborhood}, ` : ""}{city} - {state}
              </div>
            )}

            {/* Campos extras do path de e-mail */}
            {emailMode && (
              <div className="space-y-4 pt-1">
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(13) 99999-9999"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const d = e.target.value.replace(/\D/g, "").slice(0, 11);
                            const masked = d.length <= 10
                              ? d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
                              : d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
                            field.onChange(masked.replace(/-$/, ""));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu e-mail *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* CTAs */}
            {!emailMode ? (
              <>
                <Button
                  type="button"
                  className="w-full bg-[#25d366] hover:bg-[#1ebe59] text-white font-bold text-base py-6"
                  onClick={handleWhatsApp}
                >
                  💬 Falar no WhatsApp agora
                </Button>
                <p className="text-center text-sm text-gray-400">
                  Prefere receber por e-mail?{" "}
                  <button
                    type="button"
                    className="text-orange-500 underline hover:text-orange-600"
                    onClick={() => setEmailMode(true)}
                  >
                    Clique aqui
                  </button>
                </p>
              </>
            ) : (
              <>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-base py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <i className="fas fa-spinner fa-spin mr-2" />
                  ) : "📧 "}
                  Enviar por e-mail
                </Button>
                <p className="text-center text-sm text-gray-400">
                  <button
                    type="button"
                    className="text-[#25d366] font-semibold hover:underline"
                    onClick={() => setEmailMode(false)}
                  >
                    ← Voltar para WhatsApp
                  </button>
                </p>
              </>
            )}

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run check
```

Expected: errors only in files that still import old quote types. No errors in `contact-modal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/quote/contact-modal.tsx client/src/lib/whatsapp.ts
git commit -m "feat: add ContactModal and WhatsApp URL builder"
```

---

## Task 4: Add server-side lead endpoint and email

**Files:**
- Modify: `server/email.ts`
- Modify: `server/routes.ts`

- [ ] **Step 1: Update `server/email.ts`**

Three changes to make in this file:

**a) Replace the import on line 2:**

```typescript
// Before
import { ContactForm, JobApplication, QuoteRequest, QuoteResult } from "@shared/schema";

// After
import { ContactForm, JobApplication, LeadCapture } from "@shared/schema";
```

**b) Delete the `formatDate` helper function (lines 15–18) — only used by `sendQuoteEmail`:**

```typescript
// DELETE this entire function:
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}
```

**c) Delete the entire `sendQuoteEmail` function (from the `// sendQuoteEmail` comment block through its closing `}`) — that is lines 126–304 in the original file.**

**d) Add `sendLeadEmail` at the end of the file, after `sendJobApplicationEmail`:**

```typescript
export async function sendLeadEmail(lead: LeadCapture): Promise<void> {
  const location = lead.neighborhood && lead.city && lead.state
    ? `${lead.neighborhood}, ${lead.city} - ${lead.state}`
    : lead.city && lead.state
    ? `${lead.city} - ${lead.state}`
    : "Não informado";

  const whatsappLink = `https://wa.me/${lead.clientPhone?.replace(/\D/g, "") ?? ""}`;

  const body = `
    <h2 style="margin:0 0 20px;color:#111827;font-size:20px;">Novo Lead de Contato</h2>
    ${section("Dados do Interessado",
      row("Nome", lead.clientName) +
      row("Serviço de interesse", lead.serviceType) +
      row("Localização", location) +
      row("CEP", lead.cep) +
      row("Telefone / WhatsApp", lead.clientPhone ?? "—") +
      row("E-mail", lead.clientEmail ?? "—")
    )}
    ${lead.clientPhone ? `
    <div style="text-align:center;margin-top:28px;">
      <a href="${whatsappLink}" style="display:inline-block;background:#25d366;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
        💬 Entrar em contato pelo WhatsApp
      </a>
    </div>` : ""}
  `;

  await resend.emails.send({
    from: RESEND_FROM,
    to: COMPANY_EMAIL,
    subject: `Novo lead: ${lead.clientName} — ${lead.serviceType}`,
    html: emailWrapper("Novo Lead", body),
  });
}
```

- [ ] **Step 2: Add `/api/send-lead` to `server/routes.ts`**

In `server/routes.ts`, replace line 4 (imports from schema):

```typescript
// Before
import { quoteRequestSchema, contactFormSchema, jobApplicationSchema, QuoteRequest, ContactForm, JobApplication, QuoteResult } from "@shared/schema";

// After
import { leadCaptureSchema, contactFormSchema, jobApplicationSchema, LeadCapture, ContactForm, JobApplication } from "@shared/schema";
```

Replace line 5 (imports from email):

```typescript
// Before
import { sendContactEmail, sendQuoteEmail, sendJobApplicationEmail } from "./email";

// After
import { sendContactEmail, sendLeadEmail, sendJobApplicationEmail } from "./email";
```

Remove the entire `/api/send-quote` handler block (lines 10–43 in the original file) and replace with the new `/api/send-lead` handler, placed before `/api/send-contact`:

```typescript
  app.post("/api/send-lead", async (req, res) => {
    try {
      const { recaptchaToken, ...body } = req.body;

      const captchaOk = await verifyRecaptchaToken(recaptchaToken);
      if (!captchaOk) {
        return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
      }

      const validated = leadCaptureSchema.parse(body);

      try {
        await sendLeadEmail(validated);
      } catch (emailErr) {
        console.error("[send-lead] Falha ao enviar e-mail:", emailErr);
      }

      res.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ success: false, message: "Dados inválidos: " + error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ") });
      }
      res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Erro ao enviar mensagem" });
    }
  });
```

- [ ] **Step 3: Verify TypeScript**

```bash
npm run check
```

Expected: errors only in `App.tsx` (still imports old modal). Zero errors in `server/` — if any appear in `server/email.ts`, it means `sendQuoteEmail` or `formatDate` wasn't fully removed.

- [ ] **Step 4: Commit**

```bash
git add server/email.ts server/routes.ts
git commit -m "feat: add /api/send-lead endpoint and sendLeadEmail template"
```

---

## Task 5: Update App.tsx

**Files:**
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Replace App.tsx content**

```typescript
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run check
```

Expected: errors only from the files we're about to delete. No errors in `App.tsx`.

- [ ] **Step 3: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: replace QuoteModal with ContactModal in App"
```

---

## Task 6: Delete dead files

**Files:**
- Delete: `client/src/components/quote/quote-modal.tsx`
- Delete: `client/src/components/quote/quote-result.tsx`
- Delete: `client/src/hooks/use-quote.ts`
- Delete: `client/src/lib/quote-calculator.ts`

- [ ] **Step 1: Delete the files**

```bash
rm client/src/components/quote/quote-modal.tsx
rm client/src/components/quote/quote-result.tsx
rm client/src/hooks/use-quote.ts
rm client/src/lib/quote-calculator.ts
```

- [ ] **Step 2: Verify TypeScript is clean**

```bash
npm run check
```

Expected: **zero errors**. If any remain, they'll point to a file that still imports a deleted type — fix that import before proceeding.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove quote calculator, result modal, and use-quote hook"
```

---

## Task 7: End-to-end verification

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:5000` in the browser.

- [ ] **Step 2: Test WhatsApp path**

1. Click any "Solicitar Atendimento" button
2. Modal opens with 3 fields: Serviço, Nome, CEP
3. Select a service, enter a name, enter a valid CEP (e.g. `11701-190`)
4. After CEP resolves, a location tag appears (e.g. "📍 Gonzaga, Santos - SP")
5. Click "💬 Falar no WhatsApp agora"
6. WhatsApp opens in new tab with message: `Olá! Me chamo [Nome], tenho interesse no serviço [Serviço] e estou em Gonzaga, Santos - SP. Gostaria de mais informações sobre disponibilidade e valores.`
7. Modal closes and resets

- [ ] **Step 3: Test e-mail path**

1. Open modal again
2. Fill service + name + CEP
3. Click "Prefere receber por e-mail? Clique aqui"
4. Phone and email fields appear; CTA turns orange
5. Fill phone + email, click "📧 Enviar por e-mail"
6. Success toast appears
7. Check company inbox — email arrived with lead data and location

- [ ] **Step 4: Test contact page is unaffected**

Navigate to `/contact` — form still works and submits normally.

- [ ] **Step 5: Test service-specific CTAs**

On the home page, click a CTA button next to a specific service card — modal opens with that service pre-selected.

- [ ] **Step 6: Build check**

```bash
npm run build
```

Expected: build completes without errors.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: verified contact form redesign end-to-end"
```

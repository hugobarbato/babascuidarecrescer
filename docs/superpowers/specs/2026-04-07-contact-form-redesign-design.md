# Contact Form Redesign — Design Spec

**Date:** 2026-04-07  
**Status:** Approved (v2)

---

## Context

The existing quote form was complex, multi-field, and contained a client-side pricing calculator. After a recent repricing of services, the calculator was producing incorrect quotes (ignored package selection for Nanny services, missing duration for Aulas Particulares, wrong package tiers for Vale Night). Rather than fixing the calculator, the business decision was to remove it entirely and redirect all conversion through direct WhatsApp contact. The goal is maximum lead conversion with minimum friction.

---

## Problem

- Quote calculator produces wrong values for several services
- Form collects 15+ fields (address, date, time, duration, children count, package) — most unnecessary for a lead capture
- Primary conversion goal is human contact via WhatsApp, not automated quote delivery
- High friction is likely suppressing conversions

---

## Solution

Replace the quote modal with a **minimal contact modal** (3 required fields) whose primary CTA opens WhatsApp with a pre-filled message including service, name, and location. A secondary e-mail path is available via a progressive disclosure link — phone is only required on the e-mail path.

---

## Form Design

### WhatsApp path fields (always shown)
| Field | Type | Notes |
|---|---|---|
| `serviceType` | Select dropdown | All 6 services from `SERVICES` constant |
| `clientName` | Text input | "Como prefere ser chamado(a)?" |
| `cep` | Text input | Masked 00000-000; triggers ViaCEP lookup on 8 digits |
| `neighborhood` | Text input | Auto-filled from ViaCEP, read-only after fill |
| `city` | Text input | Auto-filled from ViaCEP, read-only after fill |
| `state` | Text input | Auto-filled from ViaCEP, read-only after fill |

`neighborhood`, `city`, `state` are hidden until CEP resolves — they appear automatically after a valid CEP is entered, giving the user visual confirmation of the location without extra typing.

### E-mail path extras (revealed on "Prefere e-mail?")
| Field | Type | Notes |
|---|---|---|
| `clientPhone` | Text input | Masked (13) 99999-9999 — required for e-mail path only |
| `clientEmail` | Email input | Required for e-mail path |

### Removed fields
- Date, start hour, duration, days of week
- Children count, package type, travel days
- Street, number, complement (full address — only neighborhood/city/state needed)
- Observations

---

## Interaction Flow

### WhatsApp path (primary)
1. User fills service + name + CEP (location auto-fills)
2. Clicks **"💬 Falar no WhatsApp agora"** (green button)
3. Opens `https://wa.me/5513998090998?text=...` in new tab with pre-filled message:  
   `"Olá! Me chamo [Nome], tenho interesse no serviço [Serviço] e estou em [Bairro], [Cidade] - [UF]. Gostaria de mais informações sobre disponibilidade e valores."`
4. Nothing is sent to the server — no API call needed for this path

### E-mail path (secondary)
1. User clicks **"Prefere receber por e-mail? Clique aqui"** link
2. Phone + email fields expand; primary CTA becomes **"📧 Enviar por e-mail"** (orange)
3. A "← Voltar para WhatsApp" link lets the user switch back
4. On submit: POST to `/api/send-contact` with `{ serviceType, clientName, cep, neighborhood, city, state, clientPhone, clientEmail }`
5. Server sends email to company with all lead data; no auto-reply to client

---

## Schema Changes

Add a new `leadCaptureSchema` in `shared/schema.ts` for the modal. Do **not** modify `contactFormSchema` — it is used by the `/contact` page form.

```ts
export const leadCaptureSchema = z.object({
  serviceType: z.string().min(1, "Selecione um serviço"),
  clientName: z.string().min(2, "Informe seu nome"),
  cep: z.string().min(8, "CEP inválido"),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  // E-mail path only
  clientPhone: z.string().min(14, "WhatsApp inválido").optional(),
  clientEmail: z.string().email("E-mail inválido").optional(),
})
```

Remove `quoteRequestSchema` and `QuoteResult` type (no longer used).  
Keep `contactFormSchema`, `jobApplicationSchema`, and their types unchanged.

---

## Files Changed

| File | Action |
|---|---|
| `client/src/components/quote/quote-modal.tsx` | Replace entirely with new `ContactModal` component |
| `shared/schema.ts` | Add `leadCaptureSchema`; remove `quoteRequestSchema`, `QuoteResult` |
| `client/src/lib/quote-calculator.ts` | Delete |
| `server/routes.ts` | Remove `/api/send-quote` endpoint |
| `server/email.ts` | Simplify contact email template (remove quote-specific sections) |
| `client/src/App.tsx` | Remove QuoteResultModal, use-quote hook, replace QuoteModal → ContactModal |
| `client/src/hooks/use-quote.ts` | Delete |
| `client/src/components/quote/quote-result.tsx` | Delete |

---

## What Is NOT Changed

- Modal trigger points throughout the page (existing `onOpenQuoteModal` prop on Header, Footer, Home, Services, ServiceDetail, WorkWithUs)
- `initialService` prop on the modal (pre-selects service when CTA is per-service)
- reCAPTCHA on the e-mail path (keeps spam protection)
- Contact page form (`/contact`) — separate form, unchanged
- Job application form — unchanged

---

## Verification

1. `npm run dev` — site loads without errors
2. Click any "Solicitar Atendimento" CTA → modal opens with service + name + CEP fields
3. Type a valid CEP (e.g. `11701-190`) → neighborhood, city, state appear automatically
4. Fill service + name + CEP → click WhatsApp button → WhatsApp opens in new tab with message containing name, service, and location
5. Click "Prefere e-mail?" → phone + email fields appear, CTA turns orange
6. Fill all fields → submit → company receives email with full lead data
7. Contact page (`/contact`) still works — `contactFormSchema` untouched
8. `npm run check` passes with no TypeScript errors
9. No references to `calculateQuote`, `quoteRequestSchema`, or `QuoteResult` remain in client code

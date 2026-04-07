# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cuidar & Crescer** — A Brazilian childcare services business website with lead generation, contact forms, job applications, and email notifications. Built as a full-stack TypeScript monorepo.

## Commands

```bash
npm run dev       # Start dev server (Express + Vite HMR) on port 5000
npm run build     # Build frontend (Vite) + bundle backend (esbuild) to dist/
npm start         # Run production server from dist/
npm run check     # TypeScript type checking (no compilation)
npm run db:push   # Apply Drizzle ORM migrations to PostgreSQL
```

## Architecture

**Monorepo structure with three layers:**

- `client/` — React 18 + Vite SPA (Wouter routing, TanStack Query, shadcn/ui, Tailwind)
- `server/` — Express 4 REST API (serves API + static assets in production)
- `shared/` — Zod schemas shared between client and server (`schema.ts`)

**Request flow for all forms:**
1. User fills form → `ContactModal` or page-level form submits to an API endpoint
2. POST includes a `recaptchaToken` field alongside the form body
3. Server: reCAPTCHA v2 verification → Zod validation → Resend email API
4. On error, the `recaptchaToken` is stripped before Zod parsing

**Key path aliases** (configured in `tsconfig.json` and `vite.config.ts`):
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

## Key Files

| File | Purpose |
|------|---------|
| `server/routes.ts` | Three API endpoints: `POST /api/send-lead`, `POST /api/send-contact`, `POST /api/send-job-application` |
| `server/email.ts` | Resend-based HTML email templates (`sendLeadEmail`, `sendContactEmail`, `sendJobApplicationEmail`) |
| `server/recaptcha.ts` | reCAPTCHA v2 token verification (graceful fallback if key missing) |
| `shared/schema.ts` | Zod schemas: `leadCaptureSchema`, `contactFormSchema`, `jobApplicationSchema` |
| `client/src/App.tsx` | Root: manages `ContactModal` open/close state, passes `onOpenQuoteModal` down to all pages |
| `client/src/components/quote/contact-modal.tsx` | Lead capture modal (WhatsApp CTA + email fallback), uses `/api/send-lead` |
| `client/src/pages/work-with-us.tsx` | Job application page, uses `/api/send-job-application` |
| `client/src/lib/whatsapp.ts` | WhatsApp URL builder utility |
| `client/src/lib/analytics.ts` | Google Analytics event tracking |

## Routes

- `/` — Home (hero, services overview, CTAs)
- `/services/:id` — Service detail page
- `/trabalhe-conosco` — Job application page

## Environment Variables

Required in `.env` (see `.env.example`):

```
COMPANY_EMAIL=          # Destination for lead/contact/job emails
RESEND_API_KEY=         # Resend API key
RESEND_FROM_EMAIL=      # Sender address (e.g., "Company <noreply@domain.com>")
VITE_RECAPTCHA_SITE_KEY= # Public key (exposed to frontend via Vite)
RECAPTCHA_SECRET_KEY=   # Private key (server-side verification only)
```

Optional (not active):
- `DATABASE_URL` — Neon PostgreSQL URL for Drizzle ORM (configured but no DB tables yet)

## Current State Notes

- **No database in use** — all submissions are emailed only; `server/storage.ts` is an in-memory placeholder
- **No authentication flows active** — Passport.js and express-session are installed but unused
- **Drizzle ORM** is configured but `shared/schema.ts` contains only Zod validation schemas, not Drizzle table definitions
- **Email direction**: `sendContactEmail` → TO client, CC company; `sendLeadEmail` and `sendJobApplicationEmail` (company notification) → TO company, candidate also gets a confirmation copy for job applications

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cuidar & Crescer** — A Brazilian childcare services business website with lead generation, instant quote calculation, and email notifications. Built as a full-stack TypeScript monorepo.

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

**Request flow for quote/contact forms:**
1. User fills form → client-side quote calculation via `client/src/lib/quote-calculator.ts`
2. POST to `/api/send-quote` or `/api/send-contact` with reCAPTCHA token
3. Server: Zod validation → reCAPTCHA v2 verification → Resend email API
4. Emails sent to company + confirmation to client (if email provided)

**Key path aliases** (configured in `tsconfig.json` and `vite.config.ts`):
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

## Key Files

| File | Purpose |
|------|---------|
| `server/routes.ts` | Two API endpoints: `POST /api/send-quote`, `POST /api/send-contact` |
| `server/email.ts` | Resend-based email templates with company branding |
| `server/recaptcha.ts` | reCAPTCHA v2 token verification (graceful fallback if key missing) |
| `client/src/lib/quote-calculator.ts` | Pricing logic for 4 service types (hourly, travel, vale-night, monthly) |
| `client/src/lib/analytics.ts` | Google Analytics event tracking |
| `shared/schema.ts` | Zod schemas: `quoteRequestSchema`, `contactFormSchema`, `QuoteResult` |

## Environment Variables

Required in `.env` (see `.env.example`):

```
COMPANY_EMAIL=          # Destination for lead emails
RESEND_API_KEY=         # Resend API key
RESEND_FROM_EMAIL=      # Sender address (e.g., "Company <noreply@domain.com>")
VITE_RECAPTCHA_SITE_KEY= # Public key (exposed to frontend via Vite)
RECAPTCHA_SECRET_KEY=   # Private key (server-side verification only)
```

Optional (not active):
- `DATABASE_URL` — Neon PostgreSQL URL for Drizzle ORM (configured but no DB tables yet)

## Current State Notes

- **No database in use** — quotes/contacts are emailed only; `server/storage.ts` is an in-memory placeholder
- **No authentication flows active** — Passport.js and express-session are installed but unused
- **Email provider** — Migrated from Gmail/Nodemailer to Resend; `.env.example` still shows legacy Gmail vars
- **Drizzle ORM** is configured pointing to `shared/schema.ts` but no DB table definitions exist yet — only Zod validation schemas

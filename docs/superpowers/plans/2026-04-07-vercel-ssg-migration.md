# Vercel + SSG Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar o site de Express no Replit para Vercel com SSG, eliminando o Element Render Delay do LCP ao entregar HTML pré-renderizado do CDN global.

**Architecture:** O frontend é pré-renderizado em build-time via Vite SSR + `react-dom/server` + Wouter `memoryLocation`, gerando um arquivo `index.html` por rota. Os 3 endpoints de email viram Vercel Serverless Functions em `/api/`, reutilizando `server/email.ts` e `server/recaptcha.ts` sem alterações. O cliente hidrata o HTML existente em vez de criar do zero.

**Tech Stack:** Vite SSR mode, `react-dom/server`, `wouter/memory-location`, `@vercel/node`, Resend, reCAPTCHA v3

---

## File Map

### Criar
| Arquivo | Responsabilidade |
|---|---|
| `api/send-lead.ts` | Vercel function — porta `/api/send-lead` do Express |
| `api/send-contact.ts` | Vercel function — porta `/api/send-contact` do Express |
| `api/send-job-application.ts` | Vercel function — porta `/api/send-job-application` do Express |
| `vercel.json` | Config: build command, output dir, rewrites SPA |
| `vite.config.ssr.ts` | Config Vite para build SSR (entry-server → dist/server) |
| `client/src/entry-server.tsx` | Render function usada pelo prerender script |
| `prerender.ts` | Script Node.js pós-build: gera HTML por rota |

### Modificar
| Arquivo | O que muda |
|---|---|
| `client/index.html` | Adicionar `<!--app-html-->` no div#root |
| `client/src/main.tsx` | Usar `hydrateRoot` quando HTML pré-renderizado existir |
| `tsconfig.json` | Adicionar `api/**/*` ao `include` |
| `package.json` | Scripts: `build:vercel`, `prerender` |

### Não mudar
- `server/email.ts` — reutilizado diretamente pelas Vercel functions
- `server/recaptcha.ts` — idem
- `shared/schema.ts` — idem
- `client/src/App.tsx` — zero mudanças

---

## Task 1: Instalar dependências e configurar tsconfig

**Files:**
- Modify: `tsconfig.json`
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Instalar `@vercel/node` como devDependency**

```bash
cd /Users/hugobarbato/Documents/GitHub/babascuidarecrescer
npm install --save-dev @vercel/node
```

Expected output: `added 1 package`

- [ ] **Step 2: Adicionar `api/**/*` ao include do tsconfig**

Em `tsconfig.json`, mudar:
```json
"include": ["client/src/**/*", "shared/**/*", "server/**/*"]
```
para:
```json
"include": ["client/src/**/*", "shared/**/*", "server/**/*", "api/**/*", "prerender.ts"]
```

- [ ] **Step 3: Verificar que o TypeScript ainda passa**

```bash
npm run check
```

Expected: zero erros (pode ter warnings de arquivos novos inexistentes ainda — normal).

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json package.json package-lock.json
git commit -m "chore: add @vercel/node, expand tsconfig include for api/ and prerender"
```

---

## Task 2: Criar as 3 Vercel Serverless Functions

**Files:**
- Create: `api/send-lead.ts`
- Create: `api/send-contact.ts`
- Create: `api/send-job-application.ts`

A lógica é idêntica ao `server/routes.ts`. Só muda a assinatura: `VercelRequest`/`VercelResponse` em vez de `Request`/`Response` do Express. O body já vem parseado pelo Vercel (sem necessidade de `express.json()`).

- [ ] **Step 1: Criar `api/send-lead.ts`**

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { leadCaptureSchema } from "../shared/schema";
import { sendLeadEmail } from "../server/email";
import { verifyRecaptchaToken } from "../server/recaptcha";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { recaptchaToken, ...body } = req.body as Record<string, unknown>;

    const captchaOk = await verifyRecaptchaToken(recaptchaToken as string | undefined);
    if (!captchaOk) {
      return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
    }

    const validated = leadCaptureSchema.parse(body);

    try {
      await sendLeadEmail(validated);
    } catch (emailErr) {
      console.error("[send-lead] Falha ao enviar e-mail:", emailErr);
    }

    return res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos: " + error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      });
    }
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Erro ao enviar mensagem",
    });
  }
}
```

- [ ] **Step 2: Criar `api/send-contact.ts`**

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { contactFormSchema } from "../shared/schema";
import { sendContactEmail } from "../server/email";
import { verifyRecaptchaToken } from "../server/recaptcha";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { recaptchaToken, ...body } = req.body as Record<string, unknown>;

    const captchaOk = await verifyRecaptchaToken(recaptchaToken as string | undefined);
    if (!captchaOk) {
      return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
    }

    const validated = contactFormSchema.parse(body);

    try {
      await sendContactEmail(validated);
    } catch (emailErr) {
      console.error("[send-contact] Falha ao enviar e-mail:", emailErr);
    }

    return res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos: " + error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      });
    }
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Erro ao enviar mensagem",
    });
  }
}
```

- [ ] **Step 3: Criar `api/send-job-application.ts`**

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ZodError } from "zod";
import { jobApplicationSchema } from "../shared/schema";
import { sendJobApplicationEmail } from "../server/email";
import { verifyRecaptchaToken } from "../server/recaptcha";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { recaptchaToken, ...body } = req.body as Record<string, unknown>;

    const captchaOk = await verifyRecaptchaToken(recaptchaToken as string | undefined);
    if (!captchaOk) {
      return res.status(400).json({ success: false, message: "Verificação de segurança falhou. Tente novamente." });
    }

    const validated = jobApplicationSchema.parse(body);

    try {
      await sendJobApplicationEmail(validated);
    } catch (emailErr) {
      console.error("[send-job-application] Falha ao enviar e-mail:", emailErr);
    }

    return res.json({ success: true, message: "Cadastro enviado com sucesso!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos: " + error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      });
    }
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Erro ao enviar cadastro",
    });
  }
}
```

- [ ] **Step 4: Verificar tipos**

```bash
npm run check
```

Expected: zero erros nas novas funções.

- [ ] **Step 5: Commit**

```bash
git add api/
git commit -m "feat: add Vercel serverless functions for send-lead, send-contact, send-job-application"
```

---

## Task 3: Criar `vercel.json`

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Criar `vercel.json`**

```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "dist/public",
  "rewrites": [
    { "source": "/services/:id", "destination": "/services/:id/index.html" },
    { "source": "/trabalhe-conosco", "destination": "/trabalhe-conosco/index.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> **Nota:** As rewrites mapeiam rotas para os arquivos HTML pré-gerados pelo SSG. A última regra é o fallback SPA para rotas não pré-renderizadas (404, etc).

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: add vercel.json with build config and SPA rewrites"
```

---

## Task 4: Preparar o HTML para SSG (placeholder + hidratação)

**Files:**
- Modify: `client/index.html`
- Modify: `client/src/main.tsx`

- [ ] **Step 1: Adicionar placeholder no `client/index.html`**

Localizar:
```html
    <div id="root"></div>
```

Substituir por:
```html
    <div id="root"><!--app-html--></div>
```

- [ ] **Step 2: Atualizar `client/src/main.tsx` para usar `hydrateRoot`**

Conteúdo completo do arquivo:
```typescript
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

const rootEl = document.getElementById("root")!;
const app = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Quando há HTML pré-renderizado, hidrata em vez de criar do zero
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
```

- [ ] **Step 3: Verificar que o dev server ainda funciona**

```bash
npm run dev-local
```

Abrir `http://localhost:5000` — o site deve funcionar normalmente.

- [ ] **Step 4: Commit**

```bash
git add client/index.html client/src/main.tsx
git commit -m "feat: prepare HTML placeholder and hydrateRoot for SSG"
```

---

## Task 5: Criar o entry-server para SSR

**Files:**
- Create: `client/src/entry-server.tsx`

Este arquivo é o ponto de entrada do build SSR. Importa todos os componentes de forma **eagerly** (sem lazy) para que o `renderToString` gere o HTML completo de cada rota.

- [ ] **Step 1: Criar `client/src/entry-server.tsx`**

```typescript
import { renderToString } from "react-dom/server";
import { Router as WouterRouter, Switch, Route } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Importação eager (sem lazy) — necessária para SSR renderizar o conteúdo
import Home from "@/pages/home";
import ServiceDetail from "@/pages/service-detail";
import WorkWithUs from "@/pages/work-with-us";
import NotFound from "@/pages/not-found";
import { SERVICES } from "@/lib/constants";

export function render(url: string): string {
  const { hook } = memoryLocation({ path: url, static: true });
  const queryClient = new QueryClient();
  const helmetContext = {};

  return renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
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
```

> **Nota:** O `ContactModal` é omitido intencionalmente — é um modal oculto por padrão e não tem conteúdo relevante para SSG.

- [ ] **Step 2: Verificar tipos**

```bash
npm run check
```

Expected: zero erros no novo arquivo.

- [ ] **Step 3: Commit**

```bash
git add client/src/entry-server.tsx
git commit -m "feat: add SSR entry-server with eager imports and route list"
```

---

## Task 6: Criar o vite.config.ssr.ts

**Files:**
- Create: `vite.config.ssr.ts`

Config separada para o build SSR. Usa o mesmo root `client/` mas output em `dist/server/`.

- [ ] **Step 1: Criar `vite.config.ssr.ts`**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/server"),
    emptyOutDir: true,
    ssr: "src/entry-server.tsx",
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add vite.config.ssr.ts
git commit -m "chore: add vite.config.ssr.ts for SSR bundle build"
```

---

## Task 7: Criar o prerender script

**Files:**
- Create: `prerender.ts`

Script Node.js/ESM que lê o `dist/public/index.html` como template, chama `render(url)` para cada rota e salva o HTML resultante.

- [ ] **Step 1: Criar `prerender.ts`**

```typescript
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Importa o bundle SSR gerado pelo vite build --config vite.config.ssr.ts
const { render, routes } = await import("./dist/server/entry-server.js");

const templatePath = resolve(__dirname, "dist/public/index.html");
const template = readFileSync(templatePath, "utf-8");

for (const route of routes as string[]) {
  console.log(`Pre-rendering: ${route}`);

  let appHtml: string;
  try {
    appHtml = render(route) as string;
  } catch (err) {
    console.warn(`  Aviso: erro ao renderizar ${route}, usando HTML vazio.`, err);
    appHtml = "";
  }

  const html = template.replace("<!--app-html-->", appHtml);

  if (route === "/") {
    writeFileSync(resolve(__dirname, "dist/public/index.html"), html);
  } else {
    // /services/nanny-cuidar → dist/public/services/nanny-cuidar/index.html
    const dir = join(__dirname, "dist/public", route.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }

  console.log(`  ✓ ${route}`);
}

console.log(`\nPré-renderização concluída: ${(routes as string[]).length} rotas.`);
```

- [ ] **Step 2: Commit**

```bash
git add prerender.ts
git commit -m "feat: add SSG prerender script for all routes"
```

---

## Task 8: Atualizar scripts do package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Adicionar os novos scripts**

No `package.json`, adicionar dentro de `"scripts"`:

```json
"build:ssg": "vite build && vite build --config vite.config.ssr.ts && node --input-type=module --experimental-vm-modules prerender.ts",
"build:vercel": "npm run build:ssg"
```

O script completo de scripts ficará:
```json
"scripts": {
  "dev": "NODE_ENV=development tsx --env-file=.env server/index.ts",
  "dev-local": "NODE_ENV=development DEV_LOCAL=true tsx --env-file=.env server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "build:ssg": "vite build && vite build --config vite.config.ssr.ts && node --input-type=module prerender.ts",
  "build:vercel": "npm run build:ssg",
  "start": "NODE_ENV=production node --env-file=.env dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

- [ ] **Step 2: Testar o build completo localmente**

```bash
npm run build:ssg
```

Expected output:
```
✓ built in Xs           (vite build client)
✓ built in Xs           (vite build SSR)
Pre-rendering: /
  ✓ /
Pre-rendering: /trabalhe-conosco
  ✓ /trabalhe-conosco
Pre-rendering: /services/nanny-cuidar
  ✓ /services/nanny-cuidar
... (8 rotas no total)
Pré-renderização concluída: 8 rotas.
```

- [ ] **Step 3: Verificar os arquivos gerados**

```bash
ls dist/public/
ls dist/public/services/
```

Expected: `index.html`, pasta `services/`, pasta `trabalhe-conosco/` em `dist/public/`.

```bash
head -n 30 dist/public/index.html
```

Expected: o `<div id="root">` deve conter HTML real (não apenas `<!--app-html-->`), com o conteúdo do hero e h1 visíveis.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "feat: add build:ssg and build:vercel scripts for Vercel deployment"
```

---

## Task 9: Deploy no Vercel

- [ ] **Step 1: Criar conta e projeto no Vercel**

1. Acessar vercel.com → "Add New Project"
2. Importar o repositório do GitHub
3. Vercel vai detectar automaticamente o `vercel.json`

- [ ] **Step 2: Configurar variáveis de ambiente no Vercel**

No dashboard do projeto → Settings → Environment Variables, adicionar:

```
COMPANY_EMAIL          = <valor do .env local>
RESEND_API_KEY         = <valor do .env local>
RESEND_FROM_EMAIL      = <valor do .env local>
RECAPTCHA_SECRET_KEY   = <valor do .env local>
VITE_RECAPTCHA_SITE_KEY = <valor do .env local>
```

> `VITE_RECAPTCHA_SITE_KEY` precisa estar disponível em **build time** (Vercel injeta vars `VITE_*` durante o build automaticamente).

- [ ] **Step 3: Fazer o primeiro deploy**

No Vercel dashboard → clique em "Deploy". Acompanhar o build log.

Expected no build log:
```
Running build command: npm run build:vercel
...
Pré-renderização concluída: 8 rotas.
```

- [ ] **Step 4: Verificar o site no Vercel**

Abrir a URL de preview gerada pelo Vercel.

Testar:
- Home carrega com conteúdo (ver source com Ctrl+U — o `<h1>` deve estar no HTML)
- `/services/nanny-cuidar` carrega
- `/trabalhe-conosco` carrega
- Formulário de contato envia (verificar email recebido)
- reCAPTCHA funciona

- [ ] **Step 5: Verificar no PageSpeed Insights**

Rodar `https://babascuidarecrescer.com.br` (ou a URL Vercel) no PageSpeed.

Expected: Element Render Delay cai drasticamente (de ~2.5s para < 200ms), pois o `<h1>` está no HTML inicial.

---

## Troubleshooting esperado

### Erro: `Cannot find module './dist/server/entry-server.js'`
O build SSR não rodou ou falhou. Verificar: `ls dist/server/` — se vazio, checar o output do `vite build --config vite.config.ssr.ts`.

### Erro: `window is not defined` durante prerender
Algum componente acessa `window` no render (não dentro de `useEffect`). Adicionar guard:
```typescript
if (typeof window === 'undefined') return null
```
no componente problemático, identificado pelo stack trace.

### Erro: `@shared/schema not found` nas Vercel functions
O Vercel não está resolvendo o path alias. Solução: mudar os imports em `api/*.ts` para caminhos relativos:
```typescript
import { leadCaptureSchema } from "../shared/schema";
// em vez de @shared/schema
```
(os imports nos arquivos `api/` já usam `../shared/schema` conforme o plano — verificar se `server/email.ts` também usa relativo ou se precisa de ajuste).

### Warning de hidratação no console
Pode acontecer se o HTML do servidor e o HTML do cliente diferem (ex: data/hora dinâmica). Identificar o componente e tornar o valor consistente ou suprimir com `suppressHydrationWarning`.

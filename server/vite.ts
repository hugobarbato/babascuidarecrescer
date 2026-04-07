import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // SEO: per-route meta tag injection so crawlers see unique title/description
  // without needing to execute JavaScript
  const routeMeta: Record<string, { title: string; description: string; canonical: string }> = {
    "/": {
      title: "Babás em Santos SP · Cuidar & Crescer — Babá Profissional",
      description: "Babás profissionais em Santos e Baixada Santista. Seleção rigorosa, treinamento próprio e metodologia Montessoriana. Solicite orçamento online gratuito.",
      canonical: "https://babascuidarecrescer.com.br/",
    },
    "/services/nanny-cuidar": {
      title: "Babá para Rotina Diária em Santos · Nanny Cuidar — Cuidar & Crescer",
      description: "Babá profissional para cuidado diário em Santos SP. Refeições, escola, banho e atividades. Planos a partir de R$130/dia.",
      canonical: "https://babascuidarecrescer.com.br/services/nanny-cuidar",
    },
    "/services/nanny-desenvolver": {
      title: "Babá Especializada em Desenvolvimento Infantil · Santos SP",
      description: "Babá com foco em desfralde, seletividade alimentar e estimulação sensorial em Santos. Profissionais com formação específica.",
      canonical: "https://babascuidarecrescer.com.br/services/nanny-desenvolver",
    },
    "/services/vale-night": {
      title: "Babá Noturna em Santos · Vale Night — Cuidar & Crescer",
      description: "Babá para cuidado noturno em Santos SP. A partir de R$160, inclui transporte. Pacotes de 4h a 12h.",
      canonical: "https://babascuidarecrescer.com.br/services/vale-night",
    },
    "/services/aulas-particulares": {
      title: "Aulas Particulares e Reforço Escolar em Santos SP",
      description: "Reforço escolar e aulas particulares para crianças em Santos. Professores selecionados, R$80–90/hora.",
      canonical: "https://babascuidarecrescer.com.br/services/aulas-particulares",
    },
    "/services/eventos": {
      title: "Babá para Eventos e Festas em Santos · Cuidar & Crescer",
      description: "Babá profissional para acompanhamento em eventos, festas e reuniões em Santos. R$40–45/hora.",
      canonical: "https://babascuidarecrescer.com.br/services/eventos",
    },
    "/services/viagens": {
      title: "Babá para Viagens · Acompanhamento Infantil — Cuidar & Crescer",
      description: "Babá para acompanhar sua família em viagens. R$150/dia, tudo incluso. Santos e região.",
      canonical: "https://babascuidarecrescer.com.br/services/viagens",
    },
    "/trabalhe-conosco": {
      title: "Vagas para Babá em Santos SP · Trabalhe na Cuidar & Crescer",
      description: "Faça parte da equipe Cuidar & Crescer. Vagas para babás profissionais em Santos e região. Treinamento incluso e crescimento profissional.",
      canonical: "https://babascuidarecrescer.com.br/trabalhe-conosco",
    },
  };

  // fall through to index.html with per-route meta tags injected
  app.use("*", (_req, res) => {
    const url = _req.originalUrl.split("?")[0].replace(/\/$/, "") || "/";
    const meta = routeMeta[url] ?? routeMeta["/"];

    let html = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

    // Replace title
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${meta.title}</title>`,
    );

    // Replace meta description
    html = html.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${meta.description}">`,
    );

    // Replace canonical
    html = html.replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${meta.canonical}">`,
    );

    // Replace og:title
    html = html.replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${meta.title}">`,
    );

    // Replace og:description
    html = html.replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${meta.description}">`,
    );

    // Replace og:url
    html = html.replace(
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="${meta.canonical}">`,
    );

    res.set("Content-Type", "text/html").send(html);
  });
}

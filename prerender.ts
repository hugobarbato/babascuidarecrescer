import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Importa o bundle SSR gerado pelo vite build --config vite.config.ssr.ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — arquivo gerado em tempo de build, não existe na checagem estática
const { render, routes } = await import("./dist/server/entry-server.js");

const templatePath = resolve(__dirname, "dist/public/index.html");
const rawTemplate = readFileSync(templatePath, "utf-8");

// Extrai URLs de woff2 do CSS gerado para injetar preloads de font no <head>
// Isso quebra a cadeia HTML→CSS→Fonts, reduzindo o LCP
function extractFontPreloads(html: string): string {
  const cssHrefMatch = html.match(/href="(\/assets\/[^"]+\.css)"/);
  if (!cssHrefMatch) return html;

  const cssFilePath = resolve(__dirname, "dist/public", cssHrefMatch[1].replace(/^\//, ""));
  let cssContent: string;
  try {
    cssContent = readFileSync(cssFilePath, "utf-8");
  } catch {
    return html;
  }

  // Extrai URLs woff2 do CSS — apenas subsets latin/latin-ext (site em pt-BR)
  const allFontUrls = [...cssContent.matchAll(/url\(["']?(\/assets\/[^"')]+\.woff2)["']?\)/g)]
    .map((m) => m[1])
    .filter((u) => /latin/.test(u) && !/cyrillic|vietnamese|greek|devanagari/.test(u));
  const nunitoUrls = allFontUrls.filter((u) => u.toLowerCase().includes("nunito")).slice(0, 4);
  const otherUrls = allFontUrls.filter((u) => !u.toLowerCase().includes("nunito")).slice(0, 2);
  const fontUrls = [...nunitoUrls, ...otherUrls];

  if (fontUrls.length === 0) return html;

  const preloadTags = fontUrls
    .map((href) => `  <link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`)
    .join("\n");

  return html.replace("</head>", `${preloadTags}\n</head>`);
}

// Converte <link rel="stylesheet"> em preload não-bloqueante para eliminar render-blocking CSS
const template = extractFontPreloads(rawTemplate).replace(
  /<link rel="stylesheet"([^>]*)>/g,
  (_, attrs) => {
    const href = (attrs.match(/href="([^"]+)"/) ?? [])[1] ?? "";
    return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
  }
);

for (const route of routes as string[]) {
  console.log(`Pre-rendering: ${route}`);

  let appHtml: string;
  try {
    appHtml = render(route) as string;
  } catch (err) {
    console.error(`  Erro ao renderizar ${route}:`, err);
    process.exit(1);
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

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Importa o bundle SSR gerado pelo vite build --config vite.config.ssr.ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — arquivo gerado em tempo de build, não existe na checagem estática
const { render, routes } = await import("./dist/server/entry-server.js");

const templatePath = resolve(__dirname, "dist/public/index.html");
const rawTemplate = readFileSync(templatePath, "utf-8");

// Converte <link rel="stylesheet"> em preload não-bloqueante para eliminar render-blocking CSS
const template = rawTemplate.replace(
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

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

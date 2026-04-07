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
  ssr: {
    noExternal: ["react-helmet-async"],
  },
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

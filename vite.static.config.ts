import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

// Standalone static-SPA build for GitHub Pages.
// Does NOT use TanStack Start (SSR) — plain Vite + TanStack Router CSR.
export default defineConfig({
  base: "/young_engineers_portal/",
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    viteTsConfigPaths(),
  ],
  build: {
    outDir: "dist-static",
  },
});

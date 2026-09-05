import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { screensaverApiPlugin } from "./server/screensaverPlugin.ts";

export default defineConfig({
  plugins: [react(), tailwindcss(), screensaverApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    host: true,
  },
});

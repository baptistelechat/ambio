import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { qrcode } from "vite-plugin-qrcode";
import { screensaverApiPlugin } from "./server/screensaverPlugin.ts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    screensaverApiPlugin(),
    checker({ typescript: true }),
    qrcode(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    host: true,
  },
});

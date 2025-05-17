// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  outDir: "docs",
  site: "https://anmarhani.com",
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "en",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

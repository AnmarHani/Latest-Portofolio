// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  outDir: "docs",
  base: "/docs/",
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "en",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

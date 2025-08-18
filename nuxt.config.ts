// nuxt.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  // css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss', 
    '@pinia/nuxt', 
    '@nuxt/ui',
  ],

  // postcss: {
  //   plugins: {
  //     tailwindcss: {},
  //   },
  // },

  // vite: {
  //   plugins: [tailwindcss()],
  // },

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    justWatchApiKey: process.env.JUSTWATCH_API_KEY,
    public: { apiBase: process.env.API_BASE || "/api" },
  },

  nitro: { experimental: { wasm: true } },

  app: {
    head: {
      title: "Anime Finder - AI Scene Identification",
      meta: [
        { name: "description", content: "Describe any anime scene and instantly discover what anime it's from using AI-powered recognition." },
        { property: "og:title", content: "Anime Finder - AI Scene Identification" },
        { property: "og:description", content: "Describe any anime scene and instantly discover what anime it's from using AI-powered recognition." },
        { property: "og:image", content: "/og-image.png" },
        { property: "og:type", content: "website" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
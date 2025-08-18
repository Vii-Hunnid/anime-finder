// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss', 
    '@pinia/nuxt', 
    // '@nuxt/ui'
  ],

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    justWatchApiKey: process.env.JUSTWATCH_API_KEY,
    public: { apiBase: process.env.API_BASE || "/api" },
  },

  nitro: { experimental: { wasm: true } },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        class: '' // Ensure no dark class by default
      },
      title: "Anime Finder - AI Scene Identification",
      meta: [
        { name: "description", content: "Describe any anime scene and instantly discover what anime it's from using AI-powered recognition." },
        { property: "og:title", content: "Anime Finder - AI Scene Identification" },
        { property: "og:description", content: "Describe any anime scene and instantly discover what anime it's from using AI-powered recognition." },
        { property: "og:image", content: "/og-image.png" },
        { property: "og:type", content: "website" },
        { name: "color-scheme", content: "light dark" }, // Support both but prefer light
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      // Add script to prevent flash of dark mode
      script: [
        {
          innerHTML: `
            // Prevent flash of dark mode
            (function() {
              const theme = localStorage.getItem('theme');
              if (theme !== 'dark') {
                document.documentElement.classList.remove('dark');
              }
            })();
          `,
          type: 'text/javascript'
        }
      ]
    },
  },
});
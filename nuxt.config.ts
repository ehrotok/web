const isDevelopment = process.env.NODE_ENV === "development";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image"],
  runtimeConfig: {
    public: {
      token: process.env.TOKEN,
      development: {
        gistId: process.env.GISTID_DEV,
        fileName: process.env.FILENAME_DEV,
      },
      isDevelopment: isDevelopment,
      bearerToken: process.env.BEARER_TOKEN,
    },
  },
  imports: {
    dirs: ["models/**", "config/**", "repositories/**"],
  },

  routeRules: {
    "/v1/**": {
      proxy: `${process.env.PROXY_URL}/**`,
    },
  },

  image: isDevelopment
    ? {}
    : {
        provider: "netlify",
        domains: ["pics.dmm.co.jp"],
      },
});

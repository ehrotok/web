// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    public: {
      token: process.env.TOKEN,
      gistId:
        process.env.NODE_ENV === "development"
          ? process.env.GISTID_DEV
          : process.env.GISTID,
      fileName:
        process.env.NODE_ENV === "development"
          ? process.env.FILENAME_DEV
          : process.env.FILENAME,
      // gistId: process.env.GISTID,
      // fileName: process.env.FILENAME,
    },
  },
  imports: {
    dirs: ["models/**"],
  },

  routeRules: {
    "/v1/**": {
      proxy: `${process.env.PROXY_URL}/**`, // '/api/' から始まるすべてのリクエストをプロキシ
    },
  },
});

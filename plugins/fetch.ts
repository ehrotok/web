import { ofetch } from 'ofetch'

export default defineNuxtPlugin((_nuxtApp) => {
  globalThis.$fetch = ofetch.create({
    async onResponseError({ response }) {
      const statusCode = response?.status || 500
      navigateTo(`/errors/${statusCode}`, { redirectCode: statusCode })
    },
  }) as any
})

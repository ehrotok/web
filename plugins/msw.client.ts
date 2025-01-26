import { worker } from '~/mocks/node'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  if (config.public.isDevelopment) {
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
})

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  if (config.public.isNetlify) {
    return navigateTo('https://ehrotok.com/', { external: true })
  }

  return
})

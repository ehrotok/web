export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig()

  if (config.public.isNetlify) {
    return navigateTo('https://ehrotok.com/', { external: true })
  }

  if (to.path === '/genre') {
    return
  }

  return navigateTo('/genre')
})

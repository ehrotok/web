export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig()

  if (config.public.isNetlify) {
    return navigateTo('https://ehrotok.com/', { external: true })
  }

  if (to.path === '/genre' || useGenreState().value.length > 0) {
    return
  }

  return navigateTo('/genre')
})

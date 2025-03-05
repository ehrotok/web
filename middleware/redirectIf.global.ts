export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  if (config.public.isNetlify) {
    return navigateTo('https://ehrotok.com/', { external: true })
  }

  if (to.fullPath === '/sitemap.xml' || to.fullPath === '/sitemap_index.xml') {
    return navigateTo('https://ja.ehrotok.com/sitemap.xml', { external: true })
  }

  return
})

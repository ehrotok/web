export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()

  if (config.public.isNetlify) {
    return navigateTo('https://ehrotok.com/', { external: true })
  }

  if (!import.meta.client) {
    return
  }

  const storage = await localStorageUtil.getItem<string[]>(Constants.STORAGE_KEYS.HASHTAGS)

  if (storage.length || to.path === '/genre' || to.params.id) {
    return
  }

  return navigateTo('/genre')
})

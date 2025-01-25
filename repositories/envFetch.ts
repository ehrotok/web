export const $envFetch = async <T>(url: string, opts: any = {}): Promise<T> => {
  const config = useRuntimeConfig()
  opts.headers = { Authorization: `Bearer ${config.public.bearerToken}` }
  return await $fetch<T>(url, { ...opts })
}

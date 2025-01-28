import type { RuntimeConfig } from 'nuxt/schema'

export const $envFetch = async <T>(url: string, opts: any = {}): Promise<T> => {
  const config = useRuntimeConfig()
  const tokenState = useTokenState()

  await fetchByAuth(config)

  opts.query = opts.query || {}
  opts.query.token = tokenState.value
  opts.headers = { Authorization: `Bearer ${config.public.bearerToken}` }
  return await $fetch<T>(url, { ...opts })
}

const fetchByAuth = async (config: RuntimeConfig): Promise<void> => {
  const tokenState = useTokenState()
  if (tokenState.value) {
    return
  }

  let accounts = await localStorageUtil.getItem<Accounts>(Constants.STORAGE_KEYS.ACCOUNTS)
  if (accounts.token) {
    tokenState.value = accounts.token
    return
  }

  const query = { token: accounts.token }
  accounts = await $fetch<Accounts>(Constants.API_URLS.ACCOUNTS, {
    headers: { Authorization: `Bearer ${config.public.bearerToken}` },
    query,
  })
  localStorageUtil.updateItem(Constants.STORAGE_KEYS.ACCOUNTS, accounts)

  tokenState.value = accounts.token
}

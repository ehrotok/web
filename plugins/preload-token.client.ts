export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const tokenState = useTokenState()
  let accounts = await localStorageUtil.getItem<Accounts>(Constants.STORAGE_KEYS.ACCOUNTS)

  const query = accounts.token ? { token: accounts.token } : {}
  accounts = await $envFetch<Accounts>(Constants.API_URLS.ACCOUNTS, {
    headers: { Authorization: `Bearer ${config.public.bearerToken}` },
    query,
  })
  localStorageUtil.updateItem(Constants.STORAGE_KEYS.ACCOUNTS, accounts)

  tokenState.value = accounts.token
})

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const tokenState = useTokenState();
  let accounts = await localStorageUtil.getItem<Accounts>(
    Constants.STORAGE_KEYS.ACCOUNTS
  );

  if (!tokenState.value || !accounts.token) {
    accounts = await $fetch<Accounts>(Constants.API_URLS.ACCOUNTS, {
      headers: { Authorization: `Bearer ${config.public.bearerToken}` },
    });
    localStorageUtil.updateItem(Constants.STORAGE_KEYS.ACCOUNTS, accounts);
  }

  tokenState.value = accounts.token;
});

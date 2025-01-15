export const fetchBookmarks = async (page: number): Promise<Videos> => {
  const tokenState = useTokenState()

  return await $envFetch<Videos>(Constants.API_URLS.BOOKMARKS, {
    query: {
      token: tokenState.value,
      page,
    },
  })
}

export const fetchHistories = async (page: number): Promise<Videos> => {
  const tokenState = useTokenState()

  return await $envFetch<Videos>(Constants.API_URLS.HISTORIES, {
    query: {
      token: tokenState.value,
      page,
    },
  })
}

export const fetchBookmarks = async (page: number): Promise<Videos> => {
  return await $envFetch<Videos>(Constants.API_URLS.BOOKMARKS, {
    query: {
      page,
    },
  })
}

export const fetchHistories = async (page: number): Promise<Videos> => {
  return await $envFetch<Videos>(Constants.API_URLS.HISTORIES, {
    query: {
      page,
    },
  })
}

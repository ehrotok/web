export const fetchBookmarksAll = async (): Promise<Videos> => {
  return await fetch(Constants.API_URLS.BOOKMARKS);
};

export const fetchHistoriesAll = async (): Promise<Videos> => {
  return await fetch(Constants.API_URLS.HISTORIES);
};

const fetch = async (url: string): Promise<Videos> => {
  const tokenState = useTokenState();

  const video = await $envFetch<Videos>(url, {
    query: {
      token: tokenState.value,
      page: 1,
    },
  });

  const pages = Array.from({ length: video.pages - 1 }, (_, i) => i + 2);
  const requests = pages.map((page) =>
    $envFetch<Videos>(url, {
      query: {
        token: tokenState.value,
        page,
      },
    })
  );

  const results = await Promise.all(requests);
  results.unshift(video);
  video.result = results.map((item) => item.result).flat();
  return video;
};

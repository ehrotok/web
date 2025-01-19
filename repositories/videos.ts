export const fetchVideos = async (page: number, hashtag?: string[]): Promise<Videos> => {
  const tokenState = useTokenState()
  const videos = await $envFetch<Videos>(Constants.API_URLS.VIDEOS, {
    query: { token: tokenState.value, page, 'hashtag[]': hashtag },
  })
  return videos
}

export const fetchVideo = async (contentId: string): Promise<VideoItem> => {
  const tokenState = useTokenState()
  return await $envFetch<VideoItem>(`${Constants.API_URLS.VIDEOS}/${contentId}`, {
    query: { token: tokenState.value },
  })
}

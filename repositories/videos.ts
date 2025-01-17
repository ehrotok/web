export const fetchVideos = async (page: number, hashtag?: string[]): Promise<Videos> => {
  const tokenState = useTokenState()
  const videos = await $envFetch<Videos>(Constants.API_URLS.VIDEOS, {
    query: { token: tokenState.value, page, 'hashtag[]': hashtag },
  })
  videos.result = videos.result.map(
    (v) =>
      ({
        ...v,
        is_recommend: !!videos.recommended,
      }) as VideoItemWithDisplayParams,
  )
  return videos
}

export const fetchVideo = async (contentId: string): Promise<VideoItem> => {
  return await $envFetch<VideoItem>(`${Constants.API_URLS.VIDEOS}/${contentId}`)
}

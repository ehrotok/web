export const fetchVideos = async (page: number, hashtag?: string): Promise<Videos> => {
  const videos = await $envFetch<Videos>(Constants.API_URLS.VIDEOS, {
    query: { page, hashtag: hashtag },
  })
  return videos
}

export const fetchVideo = async (contentId: string): Promise<VideoItem> => {
  return await $envFetch<VideoItem>(`${Constants.API_URLS.VIDEOS}/${contentId}`)
}

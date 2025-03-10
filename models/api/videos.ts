export interface Videos {
  status: number
  page: number
  pages: number
  count: number
  result: VideoItem[]
}

export interface VideoItem {
  id: number
  title: string
  content_id: string
  product_id: string
  url: string
  product_url: string
  genre_name: string | null
  series_name: string | null
  maker_name: string
  actress_name: string
  director_name: string | null
  label_name: string | null
  seconds: number
  review_count: number
  review_average: number
  created_at: string
  updated_at: string
  image_url: string
  bookmarked?: boolean
  recommended?: boolean
  hashtags: Hashtag[]
  related_videos: VideoItem[]
}

interface Hashtag {
  kind: 'genre' | 'maker' | 'actress' | 'label'
  name: string
  followers_count: number
  image_url?: string // "actress" の場合にのみ必要
}

export interface Hashtags {
  page: number
  pages: number
  count: number
  result: Genre[]
}

export interface Genre {
  id: number
  kind: string
  name: string
  code: string
  created_at: string
  updated_at: string
  visibility: string
  image_url: string | null
  checked: boolean
}

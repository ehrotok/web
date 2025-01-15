/**
 * ローカルストレージに保存するキー
 */
const STORAGE_KEYS = {
  ACCOUNTS: 'accounts',
} as const

const COOKIE_KEYS = {
  AGE_CHECK: 'age_check',
  BOOKMARK_ALERT: 'bookmark_alert',
} as const

/**
 * プレースホルダーのイメージ
 */
const IMAGES = {
  LOGO: '/logo.webp',
  LOGO_WITH_TEXT: '/logo_with_text.webp',
  BG_GRAY: 'data:image/gif;base64,R0lGODdhAQABAIEAAO/v7wAAAAAAAAAAACwAAAAAAQABAAAIBAABBAQAOw==',
  BG_BLACK:
    'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
}

const API_URLS = {
  VIDEOS: '/v1/api/videos',
  ACCOUNTS: '/v1/api/accounts',
  BOOKMARK: '/v1/api/accounts/bookmark',
  UNBOOKMARK: '/v1/api/accounts/unbookmark',
  BOOKMARKS: '/v1/api/accounts/bookmarks',
  HISTORIES: '/v1/api/accounts/histories',
  WATCH: '/v1/api/accounts/watch',
} as const

export const Constants = {
  STORAGE_KEYS,
  COOKIE_KEYS,
  API_URLS,
  IMAGES,
}

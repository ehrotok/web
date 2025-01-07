/**
 * ローカルストレージに保存するキー
 */
const STORAGE_KEYS = {
  ACCOUNTS: "accounts",
} as const;

const COOKIE_KEYS = {
  AGE_CHECK: "age_check",
  BOOKMARK_ALERT: "bookmark_alert",
} as const;

const API_URLS = {
  VIDEOS: "/v1/api/videos",
  ACCOUNTS: "/v1/api/accounts",
  BOOKMARKS: "/v1/api/accounts/bookmarks",
  HISTORIES: "/v1/api/accounts/histories",
  WATCH: "/v1/api/accounts/watch",
} as const;

export const Constants = {
  STORAGE_KEYS,
  COOKIE_KEYS,
  API_URLS,
};

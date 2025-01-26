import { http, HttpResponse, passthrough } from 'msw'
import { video } from '~/mocks/json/video'

export const handlers = [
  http.get(Constants.API_URLS.VIDEOS, () => {
    return HttpResponse.json(video)
  }),

  http.get(Constants.API_URLS.HISTORIES, () => {
    return HttpResponse.json(video)
  }),

  http.get(Constants.API_URLS.BOOKMARKS, () => {
    return HttpResponse.json(video)
  }),

  http.get(Constants.API_URLS.ACCOUNTS, () => {
    return HttpResponse.json(video)
  }),

  http.post(Constants.API_URLS.BOOKMARK, () => {
    return HttpResponse.json(video)
  }),

  http.post(Constants.API_URLS.BOOKMARK, () => {
    return HttpResponse.json(video)
  }),

  http.delete(Constants.API_URLS.HASHTAG_INTEREST, () => {
    return HttpResponse.json(video)
  }),

  http.post(Constants.API_URLS.WATCH, () => {
    return HttpResponse.json(video)
  }),
]

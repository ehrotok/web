<template>
  <IconButton
      buttonClass="absolute top-10 m-4 rounded-full shadow-lg z-50 transition active:scale-150"
      :icon="mdiArrowULeftTop"
      @click="onClickReturn"
    ></IconButton>
  <Swipe
    :contentId="contentId"
    :fetchFunc="fetch"
  />
</template>

<script setup lang="ts">
import Swipe from '~/components/index/swipe.vue'

const route = useRoute()
const contentId = ref<string>(route.params.id as string)

const fetch = async (page: number) => {
  let videos: Videos
  switch (route.query.ref) {
    case 'bookmarks':
      videos = await fetchBookmarks(page)
      break
    case 'histories':
      videos = await fetchHistories(page)
      break
    default:
      videos = await fetchVideos(page)
  }

  const video = page === 1 ? await fetchVideo(contentId.value) : undefined
  if (video) {
    const index = videos.result.findIndex((v) => v.content_id === video.content_id)
    if (index >= 0) {
      videos.result.splice(index, 1)
    }

    videos.result.unshift(video)
  }

  return videos
}

const onClickReturn = async () => {
  window.history.back()
}
</script>

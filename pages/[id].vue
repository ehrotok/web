<template>
  <IconButton
      buttonClass="absolute top-2 m-3 rounded-full shadow-lg z-50 transition active:scale-150"
      :icon="mdiArrowLeft"
      @click="onClickReturn"
    ></IconButton>
  <div
    class="relative">
    <IconButton
      buttonClass="absolute top-2 right-0 m-3 rounded-full shadow-lg z-50 transition active:scale-150"
      :icon="mdiMagnify"
      @click="navigateTo('/search') "
    />
  </div>
  <IndexSwipe
    :contentId="contentId"
    :fetchFunc="fetch"
  />
</template>

<script setup lang="ts">
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

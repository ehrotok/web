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
  const hashtags = route.query.q ? [route.query.q as string] : undefined
  return await fetchVideos(page, hashtags)
}

const onClickReturn = async () => {
  window.history.back()
}
</script>

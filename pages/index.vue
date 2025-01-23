<template>
  <IndexSwipe
    :contentId="contentId"
    :fetchFunc="fetch"
  />
</template>

<script setup lang="ts">
const route = useRoute()
const contentId = ref<string>(route.params.id as string)

const fetch = async (page: number) => {
  const hashtags = route.query.q ? [route.query.q as string] : undefined
  return await fetchVideos(page, hashtags)
}
</script>

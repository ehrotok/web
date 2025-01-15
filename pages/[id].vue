<template>
  <IndexPage
    v-if="videoData.count"
    :videoData="videoData"
    :contentId="contentId"
  />
</template>

<script setup lang="ts">
import IndexPage from './index.vue'

const route = useRoute()
const videoData = ref<ExtendedVideo>({} as ExtendedVideo)
const contentId = ref<string>(route.params.id as string)

onMounted(() => {
  useWait(async () => {
    const video = await fetchVideo(contentId.value)
    videoData.value = await fetchVideos(1)
    videoData.value.result.unshift(video)
  })
})
</script>

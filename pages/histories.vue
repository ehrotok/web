<template>
  <IndexPage
    v-if="videoData.result.length > 0"
    :videoData="videoData"
    :contentId="contentId"
  />
</template>

<script setup lang="ts">
import IndexPage from "./index.vue";

const route = useRoute();
const videoData = ref<ExtendedVideo>({
  result: [] as VideoItemWithDisplayParams[],
} as ExtendedVideo);
const contentId = ref<string>(route.query?.content_id as string);

onMounted(() => {
  useWait(async () => {
    videoData.value.result.push(await fetchVideo(contentId.value));
  });
});
</script>

<template>
  <IndexSearchLabel
    v-if="query"
    :value="query"
    @click="navigateTo(`/search?q=${query}`)"
    @back="navigateTo('/', { external: true })"
  />
  <div
    class="relative" v-if="!query">
    <IconButton
      buttonClass="absolute top-5 right-0 m-3 rounded-full shadow-lg z-50 transition active:scale-150"
      :icon="mdiMagnify"
      @click="onClickSearch"
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
const query = computed(() => (route.query.q ? (route.query.q as string) : undefined))

const fetch = async (page: number, hashtag?: string) => {
  return await fetchVideos(page, hashtag)
}

const onClickSearch = async () => {
  await navigateTo('/search')
}
</script>
<template>
  <MyPageModal ref="settingRef"></MyPageModal>
  <div class="text-white text-center px-5 pt-5 pb-1">
    <div class="flex justify-end">
      <IconButton
        buttonClass="rounded-full shadow-lg"
        :icon="mdiCogOutline"
        @click="onClickSetting"
      ></IconButton>
    </div>
    <nuxt-img
      class="rounded-md m-auto h-40 object-cover"
      :src="currentVideo.image_url" 
    />
    <NuxtLink
      v-if="currentVideo.actress_name"
      :to="`/?q=${currentVideo.actress_name}`"
    >
      <div  class="w-full m-3 font-bold hover:underline text-sky-400">
        {{ currentVideo.actress_name }}
      </div>
    </NuxtLink>
    <div class="w-full m-3">
      {{ currentVideo.title }}
    </div>
    <div class="flex w-full justify-evenly my-3">
      <button
        @click="onClickVideo"
        class="bg-red-400 rounded-md text-neutral-50 font-bold p-2 transition active:scale-150"
      >
        この動画をみる
      </button>
      <button
        @click="onClickFanza"
        class="bg-red-400 rounded-md text-neutral-50 font-bold p-2 transition active:scale-150"
      >
        Fanzaで購入する
      </button>
    </div>
  </div>
  <div>
    <div class="text-sm text-center m-3 text-white">この動画に関連する作品</div>
    <Thumbnails :tiles="relatedTiles" v-model:isLoading="isLoading" @click="onClickTile"></Thumbnails>
    <div class="text-sm text-center m-3 text-white">この女優に関連する作品</div>
    <Thumbnails :tiles="actressTiles" v-model:isLoading="isLoading" @click="onClickTile"></Thumbnails>
  </div>
  
</template>

<script setup lang="ts">
import type { MyPageModal } from '#build/components'

const route = useRoute()

const page = ref(1)
const isLoading = ref(false)
const currentVideo = ref<VideoItem>({} as VideoItem)
const relatedVideos = ref<VideoItem[]>([])
const actressVideos = ref<VideoItem[]>([])
const settingRef = ref<InstanceType<typeof MyPageModal> | null>(null)

const relatedTiles = computed(() =>
  relatedVideos.value.map((v) => ({
    image: v.image_url,
    title: v.title,
  })),
)

const actressTiles = computed(() =>
  actressVideos.value.map((v) => ({
    image: v.image_url,
    title: v.title,
  })),
)

onMounted(async () => {
  useWait(async () => {
    await fetch(page.value)
  })
})

onUnmounted(() => {})

const onClickTile = async (index: number) => {
  await navigateTo(`/${relatedVideos.value[index].content_id}`)
}

const fetch = async (page: number) => {
  currentVideo.value = await fetchVideo(route.params.id as string)
  relatedVideos.value = currentVideo.value.related_videos
  useSeoWithSpa(`${currentVideo.value.title}をくわしく`)
  if (currentVideo.value.actress_name) {
    fetchVideos(page, currentVideo.value.actress_name).then((v) => {
      actressVideos.value = v.result
    })
  }
}

const onClickSetting = async () => {
  settingRef.value?.open()
}

const onClickVideo = async () => {
  navigateTo(`/${currentVideo.value.content_id}`)
}

const onClickFanza = async () => {
  window.open(currentVideo.value.product_url, '_blank')
}
</script>

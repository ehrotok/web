<template>
  <MyPageModal ref="settingRef"></MyPageModal>
  <div class="text-white text-center p-5">
    <div class="flex justify-end">
      <IconButton
        buttonClass="rounded-full shadow-lg"
        :icon="mdiCogOutline"
        @click="onClickSetting"
      ></IconButton>
    </div>
    <nuxt-img
      class="m-auto rounded-full h-20 w-20 object-contain"
      :placeholder="Constants.IMAGES.BG_GRAY"
      :src="Constants.IMAGES.LOGO_WITH_TEXT"
    />
    <div class="flex justify-evenly p-3">
      <div class="w-full border-r border-gray-500">
        <div class="text-2xl font-bold">{{ histories.count }}</div>
        <div class="text-xs mt-1">再生</div>
      </div>
      <div class="w-full">
        <div class="text-2xl font-bold">{{ bookmarks.count }}</div>
        <div class="text-xs mt-1">ブックマーク</div>
      </div>
    </div>
    <div class="w-full text-sm m-2">
      お気に入りの動画を簡単にブックマーク！履歴から見つけて、いつでも楽しめるよう保存しましょう
    </div>
  </div>
  <div
    class="py-2 bg-black sticky top-0 z-50 text-white grid grid-cols-3 text-center border-b border-gray-300 border-t"
  >
    <div class="border-r border-gray-500">
      <IconButton
        iconClass="h-8 w-8 text-white m-auto opacity-30 transition active:scale-150"
        buttonClass="rounded-full shadow-lg w-full"
        :icon="mdiHomeOutline"
        @click="onClickHome"
      ></IconButton>
      <div class="text-white text-xs leading-3">おすすめ</div>
    </div>
    <div class="border-r border-gray-500">
      <IconButton
        :icon="mdiBookmarkOutline"
        buttonClass="rounded-full shadow-lg w-full transition active:scale-150"
        :iconClass="`h-8 w-8 text-white m-auto ${
          isSelectBookmarkTab ? '' : 'opacity-30'
        }`"
        @click="onClickIcon('bookmarks')"
      ></IconButton>
      <div class="text-white text-xs leading-3">ブックマーク</div>
    </div>
    <div>
      <IconButton
        buttonClass="rounded-full shadow-lg w-full transition active:scale-150"
        :iconClass="`h-8 w-8 text-white m-auto ${
          !isSelectBookmarkTab ? '' : 'opacity-30'
        }`"
        :icon="mdiHistory"
        @click="onClickIcon('histories')"
      ></IconButton>
      <div class="text-white text-xs leading-3">履歴</div>
    </div>
  </div>

  <Thumbnails :tiles="tiles" v-model:isLoading="isLoading" @click="onClickTile"></Thumbnails>
</template>

<script setup lang="ts">
import type { MyPageModal } from '#build/components'

const route = useRoute()
useSeoWithSpa('マイページ')

const PATHS = {
  BOOKMARK: 'bookmarks',
  HISTORY: 'histories',
} as const

const page = ref(1)
const isLoading = ref(false)
const bookmarks = ref<Videos>({} as Videos)
const histories = ref<Videos>({} as Videos)
const settingRef = ref<InstanceType<typeof MyPageModal> | null>(null)

const isSelectBookmarkTab = computed(
  () => !route.query.selected || route.query.selected === PATHS.BOOKMARK,
)

const tiles = computed(() =>
  (isSelectBookmarkTab.value ? bookmarks : histories).value.result?.map((v) => ({
    image: v.image_url,
    title: v.title,
  })),
)

onMounted(async () => {
  await fetch()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const onClickHome = async () => {
  await navigateTo('/')
}

const onClickTile = async (index: number) => {
  let param: 'bookmarks' | 'histories'
  let videoItems: VideoItem[] = []
  if (isSelectBookmarkTab.value) {
    videoItems = bookmarks.value.result
    param = PATHS.BOOKMARK
  } else {
    videoItems = histories.value.result
    param = PATHS.HISTORY
  }

  await navigateTo(`/${videoItems[index].content_id}?ref=${param}`)
}

const onClickIcon = async (selected: (typeof PATHS)[keyof typeof PATHS]) => {
  await fetch()
  await navigateTo({
    path: '/my-page',
    query: {
      selected: selected,
    },
  })
}

const onClickSetting = async () => {
  settingRef.value?.open()
}

const handleScroll = async () => {
  const scrollPosition = window.scrollY + window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  const pages = isSelectBookmarkTab.value ? bookmarks.value.pages : histories.value.pages

  if (scrollPosition >= documentHeight && !isLoading.value && pages > page.value) {
    isLoading.value = true
    page.value++
    isSelectBookmarkTab.value ? await fetchBookmark() : await fetchHistory()
    isLoading.value = false
  }
}

const fetch = async () => {
  useWait(async () => {
    const [_bookmarks, _histories] = await Promise.all([
      bookmarks.value.count ? bookmarks.value : fetchBookmarks(page.value),
      histories.value.count ? histories.value : fetchHistories(page.value),
    ])
    bookmarks.value = _bookmarks
    histories.value = _histories
  })
}

const fetchBookmark = async () => {
  const _histories = await fetchBookmarks(page.value)
  if (!histories.value.count) {
    histories.value = _histories
  }

  histories.value.result.push(..._histories.result)
}

const fetchHistory = async () => {
  const _histories = await fetchHistories(page.value)
  if (!histories.value.count) {
    histories.value = _histories
  }

  histories.value.result.push(..._histories.result)
}
</script>

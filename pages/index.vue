<template>
  <div
    class="relative overflow-hidden"
    :style="{ height: `${itemHeight}px` }"
    @touchstart="onSwipeStart"
    @touchmove="onSwipeMove"
    @touchend="onSwipeEnd"
  >
    <IconButton
      v-if="routeName && routeName !== 'id'"
      buttonClass="absolute top-10 m-4 rounded-full shadow-lg z-50 transition active:scale-150"
      :icon="mdiArrowULeftTop"
      @click="onClickReturn"
    ></IconButton>
    <div
      class="flex flex-col transition-transform duration-300 ease-out"
      :style="{ transform: `translateY(${currentOffset}px)` }"
    >
      <div
        v-for="(video, index) in videos.result"
        :key="index"
        class="relative flex items-center justify-center bg-black"
        :style="{ height: `${itemHeight}px` }"
      >
        <video
          class="h-dvh w-full object-contain"
          controls
          muted
          playsinline
          loop
          autoplay
        ></video>

        <div class="absolute bottom-20 left-5 text-white w-3/4">
          <a
            @touchstart="onSwipeStart"
            @touchmove="onSwipeMove"
            @touchend="onSwipeEndByTitle"
            :href="video.product_url"
            target="_blank"
          >
            <h3 class="text-lg font-semibold mb-2">
              {{ video.actress_name }}
            </h3>
          </a>
          <p class="text-sm text-gray-300">
            {{ video.title }}
          </p>
        </div>

        <IndexSideMenu
          :reviewCount="video.review_count"
          :reviewAverage="video.review_average"
          :imageUrl="video.image_url"
          :productUrl="video.product_url"
          :isBookmark="current.bookmark.result"
          :isRecommend="video.is_recommend"
          @click:home="onClickHome"
          @click:bookmark="onClickBookmark"
        ></IndexSideMenu>
      </div>
    </div>
    <div v-if="!isTouchDevice">
      <IconButton
        v-if="currentIndex > 0"
        buttonClass="text-lg absolute top-10 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg z-50 transition active:scale-150"
        iconClass="h-10 w-10 text-white m-auto"
        :icon="mdiArrowUp"
        @click="onClickArrow(-1)"
      ></IconButton>
      <IconButton
        buttonClass="text-lg absolute bottom-10 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg z-50 transition active:scale-150"
        iconClass="h-10 w-10 text-white m-auto"
        :icon="mdiArrowDown"
        @click="onClickArrow(1)"
      ></IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'

const props = defineProps({
  contentId: {
    type: String,
    default: undefined,
  },
  videoData: {
    type: Object as () => ExtendedVideo,
    default: undefined,
  },
})
const route = useRoute()
const tokenState = useTokenState()
const bookmarkState = useBookmarkState()
const isFullscreenMode = useFullScreenMode()

const videos = ref<ExtendedVideo>({} as ExtendedVideo)
const videoData = ref<ExtendedVideo>({} as ExtendedVideo)
const startY = ref(0)
const currentOffset = ref(0)
const currentIndex = ref(0)
const itemHeight = ref(0)
const currentPage = ref(1)
const bookmarks = ref<VideoItemWithDisplayParams[]>(bookmarkState.value)
const isTouchDevice = ref(true)

const videoSelectorAll = computed(() => Array.from(document.querySelectorAll('video')))
const current = computed(() => {
  const video = videos.value.result[currentIndex.value]
  const index = bookmarks.value.findIndex((v) => v.content_id === video.content_id)
  return {
    video,
    bookmark: {
      index,
      result: index >= 0,
    },
  }
})

const routeName = computed(
  () =>
    (['bookmarks', 'histories', 'id'].includes(route.name as string) ? route.name : undefined) as
      | string
      | undefined,
)

onMounted(() => {
  useWait(async () => {
    init()
    await fetch(currentPage.value)
    await setupSeo()
    await replaceDom(currentIndex.value, 0)
    await play(currentIndex.value)
    setOffset()
  })
})

onUnmounted(() => {
  removeEvents()
  useEndTimer(videoSelectorAll.value[currentIndex.value])
  cleanupResources()
})

const init = () => {
  isTouchDevice.value = 'ontouchstart' in window
  setupEvents()
  updateItemHeight()
}

const setupSeo = async () => {
  const video = videoData.value.result[currentIndex.value]
  useSeoWithSpa(`/${video.content_id}`, `${video.title} - EhroTok`, video.image_url)
}

const setupEvents = () => {
  window.addEventListener('resize', updateItemHeight)
  window.addEventListener('fullscreenchange', checkFullscreen)
}

const removeEvents = () => {
  window.removeEventListener('resize', updateItemHeight)
  window.removeEventListener('fullscreenchange', checkFullscreen)
  videoSelectorAll.value[currentIndex.value]?.removeEventListener('volumechange', checkVolumeChange)
}

const updateItemHeight = () => {
  itemHeight.value = window.innerHeight
}

const checkFullscreen = () => {
  isFullscreenMode.value = !!document.fullscreenElement
  current.value.video.is_fullscreen = current.value.video.is_fullscreen || isFullscreenMode.value
}

const checkVolumeChange = () => {
  current.value.video.unmuted = !videoSelectorAll.value[currentIndex.value].muted
}

const onClickHome = async () => {
  await navigateTo('/my-page')
}

const onClickReturn = async () => {
  await navigateTo(`/my-page?selected=${routeName.value}`)
}

const onClickBookmark = async () => {
  const query = {
    token: tokenState.value,
    content_id: current.value.video.content_id,
  }

  if (current.value.bookmark.result) {
    await unbookmark(query)
    return
  }

  if (!Cookies.get(Constants.COOKIE_KEYS.BOOKMARK_ALERT)) {
    Cookies.set(Constants.COOKIE_KEYS.BOOKMARK_ALERT, 'true', { expires: 90 })
    alert(
      '動画をブックマークしました\nブックマークした動画は、プロフィール（👤）からいつでも確認できます',
    )
  }

  await bookmark(query, current.value.video.content_id)
}

const onSwipeStart = (e: any) => {
  stopEvent(e)
  startY.value = e.touches[0].clientY
  openControls()
}

const onSwipeMove = (e: any) => {
  stopEvent(e)
  const deltaY = e.touches[0].clientY - startY.value
  currentOffset.value = -currentIndex.value * itemHeight.value + deltaY
}

const onSwipeEnd = async (e: any) => {
  stopEvent(e)
  const deltaY = e.changedTouches[0].clientY - startY.value

  if (Math.abs(deltaY) > 50) {
    const direction = deltaY > 0 ? -1 : 1
    const newIndex = currentIndex.value + direction

    if (newIndex >= 0 && newIndex < videos.value.result.length) {
      setVideo(newIndex)
    }
  }

  await setupSeo()
  setOffset()
}

const onClickArrow = async (direction: number) => {
  const newIndex = currentIndex.value + direction
  setVideo(newIndex)
  await setupSeo()
  setOffset()
}

const bookmark = async (query: object, contentId: string) => {
  bookmarks.value.push({ content_id: contentId } as VideoItemWithDisplayParams)

  await $envFetch<Videos>(Constants.API_URLS.BOOKMARK, {
    method: 'POST',
    query,
  })
}

const unbookmark = async (query: object) => {
  bookmarks.value.splice(current.value.bookmark.index, 1)

  await $envFetch<Videos>(Constants.API_URLS.UNBOOKMARK, {
    method: 'DELETE',
    query,
  })
}

const fetchVideo = async (page: number) => {
  const items: VideoItem[] = []
  if (page === 1) {
    const hashtags = await localStorageUtil.getItem<string[]>(Constants.STORAGE_KEYS.HASHTAGS)
    items.push(...(await fetchVideos(page, hashtags)).result)
  }

  items.push(...(await fetchVideos(page)).result)

  return items
}

const fetch = async (page: number) => {
  videoData.value.result = routeName.value
    ? (props.videoData as ExtendedVideo).result
    : await fetchVideo(page)

  videos.value.result =
    videoData.value.result.length > 1
      ? Array.from(
          { length: videoData.value.result.length - 1 },
          () => ({}) as VideoItemWithDisplayParams,
        )
      : []

  if (props.contentId) {
    currentIndex.value = videoData.value.result.findIndex((v) => v.content_id === props.contentId)
  }
}

const reFetch = async (page: number) => {
  useWait(async () => {
    currentIndex.value = 0
    await fetch(page)
    await replaceDom(currentIndex.value, 0)
    await play(currentIndex.value)
  })
}

const setVideo = async (newIndex: number) => {
  finish()
  const prevIndex = currentIndex.value
  currentIndex.value = newIndex

  if (!routeName.value && !videoData.value.result[newIndex + 1]) {
    await reFetch(++currentPage.value)
  }

  videoSelectorAll.value[newIndex].muted = videoSelectorAll.value[prevIndex].muted
  cleanupResources()
  replaceDom(currentIndex.value).then(() => {
    play(currentIndex.value)
  })
}

const onSwipeEndByTitle = async (e: any) => {
  const prevIndex = currentIndex.value
  onSwipeEnd(e)
  if (prevIndex === currentIndex.value) {
    location.href = current.value.video.product_url
  }
}

const stopEvent = (e: any) => {
  e.preventDefault()
  e.stopPropagation()
}

const openControls = () => {
  const video = videoSelectorAll.value[currentIndex.value]
  video.removeAttribute('controls')
  video.setAttribute('controls', 'controls')
  video.focus()
  setTimeout(() => {
    video.blur()
  }, 3000)
}

const setOffset = () => {
  currentOffset.value = -currentIndex.value * itemHeight.value
}

const cleanupResources = async (): Promise<void> => {
  videoSelectorAll.value
    .filter((v) => !v.paused)
    .forEach((video) => {
      video.pause()
      video.src = ''
      video.load()
      video.removeEventListener('volumechange', checkVolumeChange)
    })
}

const replaceDom = async (currentIndex: number, deleteCount = 1): Promise<void> => {
  videos.value.result.splice(currentIndex, deleteCount, videoData.value.result[currentIndex])

  nextTick()
}

const play = async (currentIndex: number): Promise<void> => {
  const element = videoSelectorAll.value[currentIndex]
  const video = videos.value.result[currentIndex]

  element.addEventListener('volumechange', checkVolumeChange)

  element.src = video.url
  element.load()

  usePlayTimer(element)

  element.currentTime = 10
  element.play().catch((err) => {
    console.error(`動画が再生できません！潔くこの動画は諦めろ！！！:${err}`)
  })

  checkVolumeChange()
}

const finish = async (): Promise<void> => {
  const time = useEndTimer(videoSelectorAll.value[currentIndex.value])

  if (time <= 1) {
    return
  }

  $envFetch<Videos>(Constants.API_URLS.WATCH, {
    method: 'POST',
    query: {
      token: tokenState.value,
      content_id: current.value.video.content_id,
      time: Math.floor(time),
      fullscreened: !!current.value.video.is_fullscreen,
      unmuted: !!current.value.video.unmuted,
    },
  })
}
</script>

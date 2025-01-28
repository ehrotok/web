<template>
  <div
    class="relative overflow-hidden"
    :style="{ height: `${itemHeight}px` }"
    @touchstart="onSwipeStart"
    @touchmove="onSwipeMove"
    @touchend="onSwipeEnd"
  >
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

        <div class="absolute bottom-20 left-0 pr-16 pt-8 pb-2 pl-5 text-white w-3/4 bg-gradient-to-b from-black/0 to-black w-full">
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
          <div class="text-sm text-gray-300">
            <div class="flex">
              <p
                class="flex-1 mb-2"
                :class="{ 'line-clamp-1': isMore }">
                {{ video.title }}
              </p>
              <div 
                v-if="isMore"
                @touchend="onClickMore"
                @click="onClickMore"
                class="flex-none font-bold"
              >もっと見る</div>
            </div>
            <p v-if="!isMore" class="">
              <span
                class="ml-1"
                @touchend="onClickHashtag(hashtag)"
                @click="onClickHashtag(hashtag)"
                v-for="(hashtag, index) in hashtags"
                :key="index"  
              >
              {{ hashtag }}
              </span>
            </p>
            
            <div 
                v-if="!isMore"
                @touchend="onClickMore"
                @click="onClickMore"
                class="mt-2 flex justify-end font-bold"
              >表示を減らす</div>
          </div>
        </div>
        <IndexSideMenu
          :content-id="video.content_id"
          :text="video.title"
          :reviewCount="video.review_count"
          :reviewAverage="video.review_average"
          :imageUrl="video.image_url"
          :productUrl="video.product_url"
          :isBookmark="current.bookmarked"
          :isRecommend="!!video.recommended"
          @click:home="onClickHome"
          @click:bookmark="onClickBookmark"
        ></IndexSideMenu>
      </div>
    </div>
    <div v-if="!isTouchDevice">
      <IconButton
        v-if="currentIndex > 0"
        buttonClass="absolute top-20 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg z-50 transition active:scale-150"
        iconClass="h-8 w-8 text-white m-auto"
        :icon="mdiArrowUp"
        @click="onClickArrow(-1)"
      ></IconButton>
      <IconButton
        buttonClass="absolute bottom-5 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg z-50 transition active:scale-150"
        iconClass="h-8 w-8 text-white m-auto"
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
  fetchFunc: {
    type: Function,
    default: () => {},
  },
})
const route = useRoute()
const tokenState = useTokenState()
const isFullscreenMode = useFullScreenMode()

const videos = ref<ExtendedVideo>({} as ExtendedVideo)
const videoData = ref<ExtendedVideo>({} as ExtendedVideo)
const startY = ref(0)
const currentOffset = ref(0)
const currentIndex = ref(0)
const itemHeight = ref(0)
const currentPage = ref(1)
const isTouchDevice = ref(true)
const isMore = ref(true)

const videoSelectorAll = computed(() => Array.from(document.querySelectorAll('video')))
const current = computed(() => {
  const video = videos.value.result[currentIndex.value]
  return {
    video,
    bookmarked: !!video?.bookmarked,
  }
})

const hashtags = computed(() => current.value.video.hashtags?.map((v) => `#${v.name}`))
const isEnd = computed(
  () =>
    !videoData.value.result[currentIndex.value + 1] && videoData.value.pages === currentPage.value,
)

onMounted(() => {
  useWait(async () => {
    await init(route.query.q as string)
  })
})

onBeforeRouteUpdate((to, _) => {
  useWait(async () => {
    await init(to.query.q as string)
  })
})

onUnmounted(() => {
  removeEvents()
  useEndTimer(videoSelectorAll.value[currentIndex.value])
  cleanupResources()
})

const onClickHome = async () => {
  await navigateTo('/my-page')
}

const onClickHashtag = async (q: string) => {
  await navigateTo(`/?q=${q.replace('#', '')}`)
}

const onClickBookmark = async () => {
  const query = {
    token: tokenState.value,
    content_id: current.value.video.content_id,
  }

  if (current.value.bookmarked) {
    await unbookmark(query)
    return
  }

  if (!Cookies.get(Constants.COOKIE_KEYS.BOOKMARK_ALERT)) {
    Cookies.set(Constants.COOKIE_KEYS.BOOKMARK_ALERT, 'true', { expires: 90 })
    alert(
      '動画をブックマークしました\nブックマークした動画は、プロフィール（👤）からいつでも確認できます',
    )
  }

  await bookmark(query)
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

    if (newIndex >= 0 && newIndex <= videos.value.result.length) {
      setVideo(newIndex)
    }
  }

  setOffset()
}

const onSwipeEndByTitle = async (e: any) => {
  const prevIndex = currentIndex.value
  onSwipeEnd(e)
  if (prevIndex === currentIndex.value) {
    await navigateTo(`/?q=${current.value.video.actress_name}`)
  }
}

const onClickArrow = async (direction: number) => {
  const newIndex = currentIndex.value + direction
  setVideo(newIndex)
  setOffset()
}

const onClickMore = async () => {
  isMore.value = !isMore.value
}

const fetch = async (page: number, hashtag?: string) => {
  videoData.value = await props.fetchFunc(page, hashtag)
  videos.value.result =
    videoData.value.result.length > 1
      ? Array.from(
          { length: videoData.value.result.length - 1 },
          () => ({}) as VideoItemWithDisplayParams,
        )
      : []
}

const init = async (hashtag?: string) => {
  isMore.value = true
  isTouchDevice.value = 'ontouchstart' in window
  setupEvents()
  updateItemHeight()
  await fetch(currentPage.value, hashtag)
  await replaceDom(currentIndex.value, 0)
  await play(currentIndex.value)
  setOffset()
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

const reFetch = async (page: number) => {
  useWait(async () => {
    currentIndex.value = 0
    await fetch(page)
    await replaceDom(currentIndex.value, 0)
    await play(currentIndex.value)
  })
}

const bookmark = async (query: object) => {
  current.value.video.bookmarked = true

  await $envFetch<Videos>(Constants.API_URLS.BOOKMARK, {
    method: 'POST',
    query,
  })
}

const unbookmark = async (query: object) => {
  current.value.video.bookmarked = false

  await $envFetch<Videos>(Constants.API_URLS.UNBOOKMARK, {
    method: 'DELETE',
    query,
  })
}

const setVideo = async (newIndex: number) => {
  isMore.value = true
  if (isEnd.value) {
    return
  }
  finish()
  const prevIndex = currentIndex.value
  currentIndex.value = newIndex

  if (!videoData.value.result[newIndex]) {
    await reFetch(++currentPage.value)
  } else {
    videoSelectorAll.value[newIndex].muted = videoSelectorAll.value[prevIndex].muted
  }

  cleanupResources()
  replaceDom(currentIndex.value).then(() => {
    play(currentIndex.value)
  })
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
    console.warn(err)
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

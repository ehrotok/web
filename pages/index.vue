<template>
  <div
    class="relative overflow-hidden"
    :style="{ height: `${itemHeight}px` }"
    @touchstart="startSwipe"
    @touchmove="moveSwipe"
    @touchend="endSwipe"
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
          :src="video.url"
        ></video>

        <div class="absolute bottom-20 left-5 text-white w-3/4">
          <a
            @touchstart="startSwipe"
            @touchmove="moveSwipe"
            @touchend="endSwipeByTitle"
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
          :isBookmark="currentBookmark.result"
          :isRecommend="video.is_recommend"
          @click:home="onClickHome"
          @click:bookmark="onClickBookmark"
        ></IndexSideMenu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";
import { useFullScreenMode } from "~/composables/state";

const props = defineProps({
  contentId: {
    type: String,
    default: undefined,
  },
  videoData: {
    type: Object as () => ExtendedVideo,
    default: undefined,
  },
});
const route = useRoute();
const tokenState = useTokenState();
const bookmarkState = useBookmarkState();
const isFullscreenMode = useFullScreenMode();

const videos = ref<ExtendedVideo>({} as ExtendedVideo);
const videoData = ref<ExtendedVideo>({} as ExtendedVideo);
const startY = ref(0);
const currentOffset = ref(0);
const currentIndex = ref(0);
const itemHeight = ref(0);
const currentPage = ref(1);
const bookmarks = ref<VideoItemWithDisplayParams[]>(bookmarkState.value);

const currentBookmark = computed(() => {
  const index = bookmarks.value.findIndex(
    (v) => v.content_id === videos.value.result[currentIndex.value]?.content_id,
  );
  return {
    index,
    result: index >= 0,
  };
});

const videoSelectorAll = computed(() => {
  return Array.from(document.querySelectorAll("video"));
});

const routeName = computed(
  () =>
    (["bookmarks", "histories", "id"].includes(route.name as string)
      ? route.name
      : undefined) as string | undefined,
);

onMounted(() => {
  useWait(async () => {
    init();
    await fetch(currentPage.value);
    await replaceDom(currentIndex.value, 0);
    await play(currentIndex.value);
    setOffset();
  });
});

onUnmounted(() => {
  removeEvents();
  useEndTimer(videoSelectorAll.value[currentIndex.value]);
  cleanupResources();
});

const init = () => {
  setupEvents();
  updateItemHeight();
};

const setupEvents = () => {
  window.addEventListener("resize", updateItemHeight);
  window.addEventListener("fullscreenchange", checkFullscreen);
};

const removeEvents = () => {
  window.removeEventListener("resize", updateItemHeight);
  window.removeEventListener("fullscreenchange", checkFullscreen);
  videoSelectorAll.value[currentIndex.value].removeEventListener(
    "volumechange",
    checkVolumeChange,
  );
};

const updateItemHeight = () => {
  itemHeight.value = window.innerHeight;
};

const checkFullscreen = () => {
  isFullscreenMode.value = !!document.fullscreenElement;
  videos.value.result[currentIndex.value].is_fullscreen =
    videos.value.result[currentIndex.value].is_fullscreen ||
    isFullscreenMode.value;
};

const checkVolumeChange = () => {
  const element = videoSelectorAll.value[currentIndex.value];
  const video = videos.value.result[currentIndex.value];
  video.unmuted = video.unmuted || !element.muted;
};

const onClickHome = async () => {
  await navigateTo("/my-page");
};

const onClickReturn = async () => {
  await navigateTo(`/my-page?selected=${routeName.value}`);
};

const onClickBookmark = async () => {
  const contentId = videos.value.result[currentIndex.value].content_id;
  const query = {
    token: tokenState.value,
    content_id: contentId,
  };

  if (currentBookmark.value.result) {
    await unbookmark(query);
    return;
  }

  if (!Cookies.get(Constants.COOKIE_KEYS.BOOKMARK_ALERT)) {
    Cookies.set(Constants.COOKIE_KEYS.BOOKMARK_ALERT, "true", { expires: 90 });
    alert(
      "動画をブックマークしました\nブックマークした動画は、プロフィール（👤）からいつでも確認できます",
    );
  }

  await bookmark(query, contentId);
};

const bookmark = async (query: object, contentId: string) => {
  bookmarks.value.push({ content_id: contentId } as VideoItemWithDisplayParams);

  await $envFetch<Videos>(Constants.API_URLS.BOOKMARK, {
    method: "POST",
    query,
  });
};

const unbookmark = async (query: object) => {
  bookmarks.value.splice(currentBookmark.value.index, 1);

  await $envFetch<Videos>(Constants.API_URLS.UNBOOKMARK, {
    method: "DELETE",
    query,
  });
};

const fetch = async (page: number) => {
  videoData.value.result = routeName.value
    ? (props.videoData as ExtendedVideo).result
    : (await fetchVideos(page)).result;

  videos.value.result =
    videoData.value.result.length > 1
      ? Array.from(
          { length: videoData.value.result.length - 1 },
          () => ({}) as VideoItemWithDisplayParams,
        )
      : [];

  if (props.contentId) {
    currentIndex.value = videoData.value.result.findIndex(
      (v) => v.content_id === props.contentId,
    );
  }
};

const reFetch = async (page: number) => {
  useWait(async () => {
    currentIndex.value = 0;
    await fetch(page);
    await replaceDom(currentIndex.value, 0);
    await play(currentIndex.value);
  });
};

const startSwipe = (e: any) => {
  stopEvent(e);
  startY.value = e.touches[0].clientY;
};

const moveSwipe = (e: any) => {
  stopEvent(e);
  const deltaY = e.touches[0].clientY - startY.value;
  currentOffset.value = -currentIndex.value * itemHeight.value + deltaY;
};

const endSwipe = async (e: any) => {
  stopEvent(e);
  const deltaY = e.changedTouches[0].clientY - startY.value;

  if (Math.abs(deltaY) > 50) {
    const direction = deltaY > 0 ? -1 : 1;
    const newIndex = currentIndex.value + direction;

    if (newIndex >= 0 && newIndex < videos.value.result.length) {
      finish();
      const prevIndex = currentIndex.value;
      currentIndex.value = newIndex;

      if (!routeName.value && !videoData.value.result[newIndex + 1]) {
        await reFetch(++currentPage.value);
      }

      videoSelectorAll.value[newIndex].muted =
        videoSelectorAll.value[prevIndex].muted;
      cleanupResources();
      replaceDom(currentIndex.value).then(() => {
        play(currentIndex.value);
      });
    }
  }

  const currentVideo = videos.value.result[currentIndex.value];
  useSeoWithSpa(
    `/${currentVideo.content_id}`,
    `${currentVideo.title} - EhroTok`,
    currentVideo.image_url,
  );

  setOffset();
};

const endSwipeByTitle = async (e: any) => {
  const prevIndex = currentIndex.value;
  endSwipe(e);
  if (prevIndex === currentIndex.value) {
    location.href = videos.value.result[currentIndex.value].product_url;
  }
};

const stopEvent = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
};

const setOffset = () => {
  currentOffset.value = -currentIndex.value * itemHeight.value;
};

const cleanupResources = async (): Promise<void> => {
  videoSelectorAll.value
    .filter((v) => !v.paused)
    .forEach((video) => {
      video.pause();
      video.src = "";
      video.load();
      video.removeEventListener("volumechange", checkVolumeChange);
    });
};

const replaceDom = async (
  currentIndex: number,
  deleteCount = 1,
): Promise<void> => {
  videos.value.result.splice(
    currentIndex,
    deleteCount,
    videoData.value.result[currentIndex],
  );

  nextTick();
};

const play = async (currentIndex: number): Promise<void> => {
  const element = videoSelectorAll.value[currentIndex];
  const video = videos.value.result[currentIndex];

  element.addEventListener("volumechange", checkVolumeChange);

  element.src = video.url;
  element.load();

  usePlayTimer(element);

  element.currentTime = 10;
  element.play().catch((err) => {
    console.error(`動画が再生できません！潔くこの動画は諦めろ！！！:${err}`);
  });

  checkVolumeChange();
};

const finish = async (): Promise<void> => {
  const time = useEndTimer(videoSelectorAll.value[currentIndex.value]);

  if (routeName.value || time <= 1) {
    return;
  }

  $envFetch<Videos>(Constants.API_URLS.WATCH, {
    method: "POST",
    query: {
      token: tokenState.value,
      content_id: videos.value.result[currentIndex.value].content_id,
      time: Math.floor(time),
      fullscreened: !!videos.value.result[currentIndex.value].is_fullscreen,
      unmuted: !!videos.value.result[currentIndex.value].unmuted,
    },
  });
};
</script>

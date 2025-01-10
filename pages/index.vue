<template>
  <div
    class="relative overflow-hidden"
    :style="{ height: `${itemHeight}px` }"
    @touchstart="startSwipe"
    @touchmove="moveSwipe"
    @touchend="endSwipe"
  >
    <IconButton
      v-if="props.fetchType"
      buttonClass="absolute top-10 m-4 rounded-full shadow-lg z-50"
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
          @click:home="onClickHome"
          @click:bookmark="onClickBookmark"
        ></IndexSideMenu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";

const props = defineProps({
  fetchType: {
    type: String as PropType<"bookmarks" | "histories">,
    default: undefined,
  },
});

const route = useRoute();
const positionState = usePositionState();
const tokenState = useTokenState();
const recommendationState = useRecommendationsState();
const videos = ref<Videos>({} as Videos);
const videoData = ref<Videos>({} as Videos);
const startY = ref(0);
const currentOffset = ref(0);
const currentIndex = ref(positionState.value);
const itemHeight = ref(0);
const currentPage = ref(1);
const bookmarks = ref<VideoItem[]>([]);

const currentBookmark = computed(() => {
  const index = bookmarks.value.findIndex(
    (v) => v.content_id === videos.value.result[currentIndex.value]?.content_id
  );
  return {
    index,
    result: index >= 0,
  };
});

const videoSelectorAll = computed(() => {
  return Array.from(document.querySelectorAll("video"));
});

onMounted(async () => {
  useWait(async () => {
    init();
    await fetch(currentPage.value);
    await play(currentIndex.value);
    bookmarks.value = (
      await $envFetch<Videos>(Constants.API_URLS.BOOKMARKS, {
        query: { token: tokenState.value },
      })
    ).result;
  });
});

onUnmounted(() => {
  cleanupResources();
  useEndTimer(videoSelectorAll.value[currentIndex.value]);
});

const init = () => {
  itemHeight.value = window.innerHeight;
  setOffset();
  if (route.query.position) {
    currentIndex.value = +route.query.position;
  }
};

const onClickHome = async () => {
  positionState.value = currentIndex.value;
  await navigateTo(`/my-page`);
};

const onClickReturn = async () => {
  await navigateTo(`/my-page?selected=${props.fetchType}`);
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

  await bookmark(query, contentId);

  if (!Cookies.get(Constants.COOKIE_KEYS.BOOKMARK_ALERT)) {
    Cookies.set(Constants.COOKIE_KEYS.BOOKMARK_ALERT, "true", { expires: 90 });
    alert(
      "動画をブックマークしました\nブックマークした動画は、プロフィール（👤）からいつでも確認できます"
    );
  }
};

const bookmark = async (query: object, contentId: string) => {
  bookmarks.value.push({ content_id: contentId } as VideoItem);

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
  const videoFetch = async () => {
    const result = (
      await $envFetch<Videos>(Constants.API_URLS.VIDEOS, {
        query: { page: page },
      })
    ).result;

    if (page === 1) {
      result.unshift(...recommendationState.value);
    }

    return result;
  };

  videoData.value.result = props.fetchType
    ? (
        await $envFetch<Videos>(
          `${Constants.API_URLS.ACCOUNTS}/${props.fetchType}`,
          { query: { token: tokenState.value } }
        )
      ).result
    : await videoFetch();

  videos.value.result =
    videoData.value.result.length > 1
      ? Array.from(
          { length: videoData.value.result.length - 1 },
          () => ({} as VideoItem)
        )
      : [];

  await replaceDom(currentIndex.value, 0);
};

const reFetch = async (page: number) => {
  useWait(async () => {
    currentIndex.value = 0;
    await fetch(page);
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
      const prevIndex = currentIndex.value;
      currentIndex.value = newIndex;

      if (!props.fetchType && !videoData.value.result[newIndex + 1]) {
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
    });
};

const replaceDom = async (
  currentIndex: number,
  deleteCount: number = 1
): Promise<void> => {
  videos.value.result.splice(
    currentIndex,
    deleteCount,
    videoData.value.result[currentIndex]
  );

  nextTick();
};

const play = async (currentIndex: number): Promise<void> => {
  const element = videoSelectorAll.value[currentIndex];
  const video = videos.value.result[currentIndex];

  element.src = video.url;
  element.load();

  useEndTimer(element);
  usePlayTimer(element);

  element.play().catch((err) => {
    console.error(`動画が再生できません！潔くこの動画は諦めろ！！！:${err}`);
  });

  pushWatch(video.content_id);
};

const pushWatch = async (contentId: string): Promise<void> => {
  if (props.fetchType) {
    return;
  }

  $envFetch<Videos>(Constants.API_URLS.WATCH, {
    method: "POST",
    query: {
      token: tokenState.value,
      content_id: contentId,
    },
  });
};
</script>

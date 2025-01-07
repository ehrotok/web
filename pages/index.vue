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
            @touchstart.stop
            @touchmove.stop
            @touchend.stop
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
    currentOffset.value = -currentIndex.value * itemHeight.value;
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
  removeEvents();
});

const init = () => {
  updateItemHeight();
  setupEvents();
  if (route.query.position) {
    currentIndex.value = +route.query.position;
  }
};

const setupEvents = () => {
  window.addEventListener("resize", updateItemHeight);
};

const removeEvents = () => {
  window.removeEventListener("resize", updateItemHeight);
};

const updateItemHeight = () => {
  itemHeight.value = window.innerHeight;
};

const onClickHome = async () => {
  positionState.value = currentIndex.value;
  await cleanupVideoDom(currentIndex.value);
  await navigateTo(`/my-page`);
};

const onClickReturn = async () => {
  await cleanupVideoDom(currentIndex.value);
  await navigateTo(`/my-page?selected=${props.fetchType}`);
};

const onClickBookmark = async () => {
  const query = {
    token: tokenState.value,
    content_id: videos.value.result[currentIndex.value].content_id,
  };
  let method = "POST";
  let url: string = Constants.API_URLS.BOOKMARK;
  if (currentBookmark.value.result) {
    method = "DELETE";
    url = Constants.API_URLS.UNBOOKMARK;
    bookmarks.value.splice(currentBookmark.value.index, 1);
  } else {
    bookmarks.value.push({
      content_id: videos.value.result[currentIndex.value].content_id,
    } as VideoItem);
  }

  $envFetch<Videos>(url, {
    method,
    query,
  });

  if (!Cookies.get(Constants.COOKIE_KEYS.BOOKMARK_ALERT)) {
    Cookies.set(Constants.COOKIE_KEYS.BOOKMARK_ALERT, "true", { expires: 90 });
    alert(
      "動画をブックマークしました\nブックマークした動画は、プロフィール（👤）からいつでも確認できます"
    );
  }
};

const fetch = async (page: number) => {
  videoData.value.result = props.fetchType
    ? // @todo 1ページ目しかとれないのであとでどうにかする
      (
        await $envFetch<Videos>(
          `${Constants.API_URLS.ACCOUNTS}/${props.fetchType}`,
          { query: { token: tokenState.value } }
        )
      ).result
    : (
        await $envFetch<Videos>(Constants.API_URLS.VIDEOS, {
          query: { page: page },
        })
      ).result;

  videos.value.result =
    videoData.value.result.length > 1
      ? Array.from(
          { length: videoData.value.result.length - 1 },
          () => ({} as VideoItem)
        )
      : [];

  videos.value.result.splice(
    currentIndex.value,
    0,
    videoData.value.result[currentIndex.value]
  );

  await nextTick();
};

const reFetch = async (page: number) => {
  return await useWait(async () => {
    currentIndex.value = 0;
    await fetch(page);
    await play(currentIndex.value);
    await nextTick();
  });
};

const startSwipe = (e: any) => {
  e.preventDefault();
  startY.value = e.touches[0].clientY;
};

const moveSwipe = (e: any) => {
  e.preventDefault();
  const deltaY = e.touches[0].clientY - startY.value;
  currentOffset.value = -currentIndex.value * itemHeight.value + deltaY;
};

const endSwipe = async (e: any) => {
  e.preventDefault();
  const deltaY = e.changedTouches[0].clientY - startY.value;
  const swipeThreshold = 50;

  if (Math.abs(deltaY) > swipeThreshold) {
    const direction = deltaY > 0 ? -1 : 1;
    const newIndex = currentIndex.value + direction;

    if (newIndex >= 0 && newIndex < videos.value.result.length) {
      const prevIndex = currentIndex.value;
      currentIndex.value = newIndex;

      // @note 次のvideoが見つからなかったら再取得を行う
      if (!props.fetchType && !videoData.value.result[newIndex + 1]) {
        currentPage.value++;
        await reFetch(currentPage.value);
      }

      inheritPreviousState(newIndex, prevIndex);
      cleanupVideoDom(currentIndex.value).then(() => play(currentIndex.value));
    }
  }

  currentOffset.value = -currentIndex.value * itemHeight.value;
};

/**
 * 前回表示した動画の状態を引き継ぐ
 *
 * @param newIndex
 * @param prevIndex
 */
const inheritPreviousState = async (newIndex: number, prevIndex: number) => {
  // @note 前回表示した動画のミュート状態を引き継ぐ
  videoSelectorAll.value[newIndex].muted =
    videoSelectorAll.value[prevIndex].muted;
};

/**
 * VideoのDOMをクリーンアップする
 *
 * @param videoElements
 * @param currentIndex
 */
const cleanupVideoDom = async (currentIndex: number): Promise<void> => {
  // @note 再生中の動画を解放する
  videoSelectorAll.value
    .filter((v) => !v.paused)
    .forEach((video) => {
      video.pause();
      video.src = "";
      video.load();
    });

  // @note domを再描画する
  videos.value.result.splice(
    currentIndex,
    1,
    videoData.value.result[currentIndex]
  );
  await nextTick();
};

/**
 * 動画を再生する
 *
 * @param currentIndex
 */
const play = async (currentIndex: number): Promise<void> => {
  const currentVideoElements = videoSelectorAll.value[currentIndex];
  // @note 再描画してもvideo起動しないのでsrcを入れ直す
  currentVideoElements.src = videoData.value.result[currentIndex].url;
  currentVideoElements.load();
  if (!props.fetchType) {
    $envFetch<Videos>(Constants.API_URLS.WATCH, {
      method: "POST",
      query: {
        token: tokenState.value,
        content_id: videoData.value.result[currentIndex].content_id,
      },
    });
  }

  return currentVideoElements.play().catch((err) => {
    console.error(`動画が再生できません！潔くこの動画は諦めろ！！！:${err}`);
  });
};
</script>

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
      buttonClass="absolute top-0 m-4 rounded-full shadow-lg z-50"
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
          class="h-full w-full object-contain"
          controls
          muted
          playsinline
          loop
          :src="video.url"
        ></video>

        <div class="absolute bottom-20 left-5 text-white w-3/4">
          <a :href="video.product_url" target="_blank">
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
          :isBookmark="isBookmark"
          @click:home="onClickHome"
          @click:bookmark="onClickBookmark"
        ></IndexSideMenu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiArrowULeftTop } from "@mdi/js";
import { ref, onMounted, onUnmounted } from "vue";
import { fetchVideos } from "~/repositories";
import { Constants } from "~/config";

const props = defineProps({
  fetchType: {
    type: String as PropType<"bookmarks" | "histories">,
    default: undefined,
  },
});

const route = useRoute();

const videos = ref<Videos>({} as Videos);
const videoData = ref<Videos>({} as Videos);
const startY = ref(0);
const currentOffset = ref(0);
const currentIndex = ref(0);
const itemHeight = ref(0);
const currentPage = ref(1);
const updateItemHeight = () => {
  itemHeight.value = window.innerHeight;
};
const bookmarks = ref<LocalStorage[]>([]);

const isBookmark = computed(() => {
  return !!bookmarks.value.find(
    (v) => v.url === videos.value.result[currentIndex.value]?.url
  );
});

const localStorageItem = computed(
  () =>
    ({
      url: videos.value.result[currentIndex.value].url,
      product_url: videos.value.result[currentIndex.value].product_url,
      actress_name: videos.value.result[currentIndex.value].actress_name,
      title: videos.value.result[currentIndex.value].title,
      review_count: videos.value.result[currentIndex.value].review_count,
      review_average: videos.value.result[currentIndex.value].review_average,
      created_at: Date(),
      image_url: videos.value.result[currentIndex.value].image_url,
    } as LocalStorage)
);

const videoSelectorAll = computed(() => {
  return Array.from(document.querySelectorAll("video"));
});

onMounted(async () => {
  updateItemHeight();
  window.addEventListener("resize", updateItemHeight);

  useWait(async () => {
    if (route.query.position) {
      currentIndex.value = +route.query.position;
      currentOffset.value = -currentIndex.value * itemHeight.value;
    }
    await fetch(currentPage.value);
    await play(currentIndex.value);
    bookmarks.value = await localStorageUtil.getItem<LocalStorage>(
      Constants.STORAGE_KEYS.BOOKMARK
    );
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateItemHeight);
});

const onClickHome = async () => {
  await cleanupVideoDom(currentIndex.value);
  await navigateTo(`/my-page`);
};

const onClickReturn = async () => {
  await cleanupVideoDom(currentIndex.value);
  await navigateTo(`/my-page?selected=${props.fetchType}`);
};

const onClickBookmark = async () => {
  if (isBookmark.value) {
    await localStorageUtil.splice({
      key: Constants.STORAGE_KEYS.BOOKMARK,
      duplicateCheckKey: "url",
      items: [localStorageItem.value],
    });
    alert("ブックマークを解除しました");
  } else {
    await setLocalStorage(Constants.STORAGE_KEYS.BOOKMARK);
    alert(
      "動画をブックマークしました\nブックマークした動画は、プロフィール（👤）からいつでも確認できます"
    );
  }

  bookmarks.value = await localStorageUtil.getItem<LocalStorage>(
    Constants.STORAGE_KEYS.BOOKMARK
  );
};

const fetch = async (page: number) => {
  const key = props.fetchType
    ? props.fetchType === "bookmarks"
      ? Constants.STORAGE_KEYS.BOOKMARK
      : Constants.STORAGE_KEYS.HISTORY
    : "";

  videoData.value.result = key
    ? (await localStorageUtil.getItem<LocalStorage>(key)).map(
        (v) => ({ ...v } as VideoItem)
      )
    : (await fetchVideos(page)).result;

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
  });
};

const startSwipe = (e: any) => {
  startY.value = e.touches[0].clientY;
};

const moveSwipe = (e: any) => {
  const deltaY = e.touches[0].clientY - startY.value;
  currentOffset.value = -currentIndex.value * itemHeight.value + deltaY;
};

const endSwipe = async (e: any) => {
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
      await cleanupVideoDom(currentIndex.value);
      play(currentIndex.value);
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
  setLocalStorage(Constants.STORAGE_KEYS.HISTORY);
  return currentVideoElements.play().catch((err) => {
    console.error(`動画が再生できません！潔くこの動画は諦めろ！！！:${err}`);
  });
};

const setLocalStorage = async (
  key: (typeof Constants.STORAGE_KEYS)[keyof typeof Constants.STORAGE_KEYS]
): Promise<void> => {
  if (props.fetchType) {
    return;
  }

  localStorageUtil.push<LocalStorage>({
    key: key,
    duplicateCheckKey: "url",
    items: [localStorageItem.value],
  });
};
</script>

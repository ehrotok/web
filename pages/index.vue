<template>
  <div
    class="relative overflow-hidden"
    :style="{ height: `${itemHeight}px` }"
    @touchstart="startSwipe"
    @touchmove="moveSwipe"
    @touchend="endSwipe"
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
          class="h-full w-full object-contain"
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
          :reviewCoun="video.review_count"
          :reviewAverage="video.review_average"
          :imageUrl="'/logo.webp'"
          :productUrl="video.product_url"
          @click:home="onClickHome"
        ></IndexSideMenu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { fetchVideos } from "../repositories";

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

const videoSelectorAll = computed(() => {
  return Array.from(document.querySelectorAll("video"));
});

onMounted(async () => {
  updateItemHeight();
  window.addEventListener("resize", updateItemHeight);

  useWait(async () => {
    await fetch(currentPage.value);
    await play(currentIndex.value);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateItemHeight);
});

const onClickHome = async (page: number) => {
  await navigateTo(`/my-page`);
};

const fetch = async (page: number) => {
  const _videos = await fetchVideos(page);
  videoData.value = _videos;
  videos.value.result = [];
  videos.value.result.push(
    ...Array.from(
      { length: videoData.value.result.length - 1 },
      () => ({} as VideoItem)
    )
  );

  videos.value.result.unshift(
    videoData.value.result[videos.value.result.findIndex((v) => !v.title)]
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
      if (!videoData.value.result[newIndex + 1]) {
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
 * @param videoElements
 * @param currentIndex
 */
const play = async (currentIndex: number): Promise<void> => {
  const currentVideoElements = videoSelectorAll.value[currentIndex];
  // @note 再描画してもvideo起動しないのでsrcを入れ直す
  currentVideoElements.src = videoData.value.result[currentIndex].url;
  currentVideoElements.load();
  return currentVideoElements.play().catch((err) => {
    console.error(`動画が再生できません！潔くこの動画は諦めろ！！！:${err}`);
  });
};
</script>

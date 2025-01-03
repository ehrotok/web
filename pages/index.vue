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
      inheritPreviousMuted(currentIndex.value, newIndex);
      currentIndex.value = newIndex;
      if (!videoData.value.result[newIndex + 1]) {
        currentPage.value++;
        await reFetch(currentPage.value);
      }
      play(currentIndex.value);
    }
  }

  currentOffset.value = -currentIndex.value * itemHeight.value;
};

const inheritPreviousMuted = async (
  prevIndex: number,
  currentIndex: number
): Promise<void> => {
  const videoElements = Array.from(document.querySelectorAll("video"));
  videoElements[currentIndex].muted = videoElements[prevIndex].muted;
};

const play = async (index: number): Promise<void> => {
  const videoElements = Array.from(document.querySelectorAll("video"));
  videoElements
    .filter((v) => !v.paused)
    .forEach((video) => {
      videos.value.result[index] = {} as VideoItem;

      // @note リソース解放
      video.pause();
      video.src = "";
      video.load();
    });

  videos.value.result.splice(index, 1, videoData.value.result[index]);
  await nextTick();

  // @note 再描画してもvideo起動しないのでsrcを入れ直す
  videoElements[index].src = videoData.value.result[index].url;
  videoElements[index].load();
  return videoElements[index].play().catch((err) => {
    console.error(`動画が再生できません！潔くこの動画は諦めろ！！！:${err}`);
  });
};
</script>

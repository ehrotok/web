<template>
  <Loader></Loader>
  <div class="bg-black">
    <div
      class="m-auto max-w-md relative overflow-hidden"
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
            <h3 class="text-lg font-semibold mb-2">
              {{ video.actress_name }}
            </h3>
            <p class="text-sm text-gray-300">
              {{ video.title }}
            </p>
          </div>

          <div
            class="absolute bottom-20 right-5 flex flex-col items-center space-y-4"
          >
            <div class="flex flex-col items-center">
              <IconButton
                :icon="mdiHeart"
                :text="video.review_count"
              ></IconButton>
            </div>

            <div class="flex flex-col items-center">
              <IconButton
                :icon="mdiStar"
                :text="`${video.review_average}点`"
              ></IconButton>
            </div>

            <div class="flex flex-col items-center">
              <IconButton :icon="mdiBookmark"></IconButton>
            </div>
            <div class="flex flex-col items-center">
              <nuxt-img
                class="rounded-full h-10 w-10 object-contain"
                placeholder="data:image/gif;base64,R0lGODdhAQABAIEAAO/v7wAAAAAAAAAAACwAAAAAAQABAAAIBAABBAQAOw=="
                src="/logo.webp"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { mdiHeart, mdiBookmark, mdiStar } from "@mdi/js";
import { fetchVideos } from "./repositories";

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
    alert(`動画が再生できません！潔くこの動画は諦めろ！！！:${err}`);
    currentIndex.value++;
  });
};
</script>

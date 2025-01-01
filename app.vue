<template>
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
          v-for="(video, index) in videos"
          :key="index"
          class="relative flex items-center justify-center bg-black"
          :style="{ height: `${itemHeight}px` }"
        >
          <video
            ref="videoElements"
            class="h-full w-full object-contain"
            controls
            muted
            playsinline
            loop
            :src="video.url"
          ></video>

          <div class="absolute bottom-20 left-5 text-white w-3/4">
            <h3 class="text-lg font-semibold mb-2">
              {{ video.title }}
            </h3>
            <p class="text-sm text-gray-300">
              {{ video.description }}
            </p>
          </div>

          <div
            class="absolute bottom-20 right-5 flex flex-col items-center space-y-4"
          >
            <div class="flex flex-col items-center">
              <button class="p-1 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-8 w-8 text-white"
                >
                  <path :d="mdiHeart" />
                </svg>
              </button>
              <span class="text-white text-sm mt-1">123</span>
            </div>

            <div class="flex flex-col items-center">
              <button class="p-1 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-8 w-8 text-white"
                >
                  <path :d="mdiComment" />
                </svg>
              </button>
              <span class="text-white text-sm mt-1">45</span>
            </div>

            <div class="flex flex-col items-center">
              <button class="p-1 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-8 w-8 text-white"
                >
                  <path :d="mdiBookmark" />
                </svg>
              </button>
              <span class="text-white text-sm mt-1">23</span>
            </div>

            <div class="flex flex-col items-center">
              <button class="p-1 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-8 w-8 text-white"
                >
                  <path :d="mdiShare" />
                </svg>
              </button>
              <span class="text-white text-sm mt-1">1,535</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { mdiHeart, mdiShare, mdiBookmark, mdiComment } from "@mdi/js";

interface Video {
  title: string;
  url: string;
  description: string;
}

const config = useRuntimeConfig();
const videos = ref<Video[]>([]);
const videoData = ref<Video[]>([]);
const startY = ref(0);
const currentOffset = ref(0);
const currentIndex = ref(0);
const itemHeight = ref(0);
const videoElements = ref<HTMLVideoElement[]>([] as HTMLVideoElement[]);

const updateItemHeight = () => {
  itemHeight.value = window.innerHeight;
};

onMounted(async () => {
  updateItemHeight();
  window.addEventListener("resize", updateItemHeight);

  // ref. https://gist.github.com/ikuosaito1989/6f0c86b520aafb30ec4125646e033d57
  const response = (await $fetch(
    `https://api.github.com/gists/${config.public.gistId}`,
    {
      headers: {
        Authorization: `token ${config.public.token}`,
      },
    }
  )) as any;
  const content = await $fetch(response.files[config.public.fileName].raw_url);
  const _videos = JSON.parse(content) as Videos;
  videoData.value = _videos.result.map((v) => ({
    title: v.actress_name,
    url: v.url,
    description: v.title,
  }));

  videos.value = Array.from(
    { length: videoData.value.length - 1 },
    () =>
      ({
        title: "",
        url: "",
        description: "",
      } as Video)
  );
  videos.value.unshift(videoData.value[0]);
  await nextTick();
  play(currentIndex.value);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateItemHeight);
});

const startSwipe = (e: any) => {
  e.preventDefault();
  startY.value = e.touches[0].clientY;
};

const moveSwipe = (e: any) => {
  e.preventDefault();
  const deltaY = e.touches[0].clientY - startY.value;
  currentOffset.value = -currentIndex.value * itemHeight.value + deltaY;
};

const endSwipe = (e: any) => {
  e.preventDefault();

  const deltaY = e.changedTouches[0].clientY - startY.value;
  const swipeThreshold = 50;

  if (Math.abs(deltaY) > swipeThreshold) {
    const direction = deltaY > 0 ? -1 : 1;
    const newIndex = currentIndex.value + direction;

    if (newIndex >= 0 && newIndex < videos.value.length) {
      currentIndex.value = newIndex;
      play(currentIndex.value);
    }
  }

  currentOffset.value = -currentIndex.value * itemHeight.value;
};

const play = async (index: number) => {
  const videoElements = Array.from(document.querySelectorAll("video"));
  videoElements
    .filter((v) => !v.paused)
    .forEach((video) => {
      videos.value[index] = {
        title: "",
        url: "",
        description: "",
      };

      // @note リソース解放
      video.pause();
      video.src = "";
      video.load();
    });

  if (!videos.value[index].title) {
    videos.value.splice(index, 1, videoData.value[index]);
    await nextTick();
  }

  // @note 再描画してもvideo起動しないのでsrcを入れ直す
  videoElements[index].src = videoData.value[index].url;
  videoElements[index].load();
  videoElements[index].play().catch((err) => {
    console.error("動画が再生できません！！！:", err);
  });
};
</script>

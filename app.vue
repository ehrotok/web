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
  const content = await $fetch(response.files["ehrotok.json"].raw_url);
  videos.value = JSON.parse(content) as Video[];

  await nextTick();

  videoElements.value.forEach((video) => {
    video.play().catch((_) => {
      alert("ビデオが読み込めませんでした！");
    });
  });
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

  if (deltaY > 50 && currentIndex.value > 0) {
    currentIndex.value -= 1;
  } else if (deltaY < -50 && currentIndex.value < videos.value.length - 1) {
    currentIndex.value += 1;
  }

  currentOffset.value = -currentIndex.value * itemHeight.value;
};
</script>

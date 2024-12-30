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
            :src="video"
          ></video>

          <div class="absolute bottom-20 left-5 text-white w-3/4">
            <h3 class="text-lg font-semibold mb-2">
              ようわからん芸人の動画 {{ index + 1 }}
            </h3>
            <p class="text-sm text-gray-300">
              完全再現できたのでこれで大金持ち確定です。仕事辞めます
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

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { mdiHeart, mdiShare, mdiBookmark, mdiComment } from "@mdi/js";

const videos = ref([
  "//cc3001.dmm.co.jp/litevideo/freepv/n/n_6/n_613pcbe12119/n_613pcbe12119_mhb_w.mp4",
  "//cc3001.dmm.co.jp/litevideo/freepv/n/n_6/n_666ssbx2668/n_666ssbx2668_mhb_w.mp4",
  "//cc3001.dmm.co.jp/litevideo/freepv/5/523/5234ctl00011/5234ctl00011_dmb_w.mp4",
  "https://cc3001.dmm.co.jp/litevideo/freepv/n/n_6/n_666ansb55213/n_666ansb55213_dmb_w.mp4",
  "https://cc3001.dmm.co.jp/litevideo/freepv/n/n_9/n_976zepe75/n_976zepe75mhb.mp4",
]);

const startY = ref(0);
const currentOffset = ref(0);
const currentIndex = ref(0);
const itemHeight = ref(0);

const updateItemHeight = () => {
  itemHeight.value = window.innerHeight;
};

onMounted(() => {
  updateItemHeight();
  window.addEventListener("resize", updateItemHeight);

  const videoElements = document.querySelectorAll("video");
  videoElements.forEach((video) => {
    video.play().catch((err) => {
      console.error("Video autoplay failed:", err);
    });
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateItemHeight);
});

const startSwipe = (e) => {
  e.preventDefault();
  startY.value = e.touches[0].clientY;
};

const moveSwipe = (e) => {
  e.preventDefault();
  const deltaY = e.touches[0].clientY - startY.value;
  currentOffset.value = -currentIndex.value * itemHeight.value + deltaY;
};

const endSwipe = (e) => {
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

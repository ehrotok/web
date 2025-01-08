<template>
  <div
    v-if="isLandscapeMode.value"
    class="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg bg-black flex justify-center items-center flex-col w-full min-h-dvh perspective-[100px] fixed top-0 left-0 z-[9999]"
  >
    <nuxt-img
      :src="Constants.IMAGES.LOGO"
      :placeholder="Constants.IMAGES.BG_BLACK"
      class="w-[150px] h-auto animation origin-center"
    />
    <div class="text-white text-xl text-center font-bold leading-8">
      横画面は動画のフルスクリーン表示時にのみ対応しています<br />
      通常の表示では縦画面でお楽しみください
    </div>
  </div>
</template>

<script setup lang="ts">
const isLandscapeMode = computed(() => useLandscapeMode());
</script>

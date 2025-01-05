<template>
  <div
    v-if="isLandscapeMode.value"
    class="bg-black flex justify-center items-center flex-col w-full h-screen perspective-[100px] fixed top-0 left-0 z-[9999]"
  >
    <nuxt-img
      src="/logo.webp"
      placeholder="data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
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

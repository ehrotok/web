<template>
  <div
    class="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg p-4 bg-black flex justify-center items-center flex-col w-full min-h-dvh perspective-[100px] fixed top-0 left-0 z-[9999]"
  >
    <nuxt-img
      :src="Constants.IMAGES.LOGO"
      :placeholder="Constants.IMAGES.BG_BLACK"
      class="w-[150px] h-auto animation origin-center"
    />
    <div class="text-gray-400 leading-8">
      <div class="text-white text-center text-lg font-bold mb-4">
        このページはすでに削除されているか、URLが間違っている可能性があります。
      </div>
    </div>

    <div class="flex w-full justify-evenly">
      <button
        @click="onClick"
        class="w-5/12 bg-red-400 rounded-md text-neutral-50 p-3 transition active:scale-150"
      >
        トップへ戻る
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const onClick = async () => {
  location.href = 'https://ehrotok.com/'
}
</script>

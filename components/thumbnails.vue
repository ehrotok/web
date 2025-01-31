<template>
  <div class="grid grid-cols-3">
    <div
      v-for="(tile, index) in tiles"
      :key="index"
      class="border-r border-b border-gray-500 [&:nth-child(3n)]:border-r-0"
      @click="onClick(index)"
    >
      <div class="relative overflow-hidden shadow-md transition active:scale-150">
        <nuxt-img
          class="w-full h-40 object-contain"
          :placeholder="Constants.IMAGES.BG_GRAY"
          :src="tile.image"
        />
        <div
          class="absolute bottom-0 left-0 w-full bg-gradient-to-b from-black/0 to-black/50 text-white p-2"
        >
          <p class="line-clamp-1 text-xs mt-1">{{ tile.title }}</p>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="isLoading"
    class="fixed bottom-5 left-1/2 transform -translate-x-1/2"
  >
    <div
      class="animate-spin h-10 w-10 border-4 border-[#fe2c55] rounded-full border-t-transparent"
    ></div>
  </div>
</template>

<script setup lang="ts">
export interface Tiles {
  image: string
  title: string
}

defineProps({
  tiles: {
    type: Array as () => Array<Tiles>,
    required: true,
  },
})

const emit = defineEmits(['click'])
// @note ここから末尾にいったかemitした方が良さそう
const isLoading = defineModel<boolean>('isLoading')

const onClick = (index: number) => {
  emit('click', index)
}
</script>

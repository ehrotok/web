<template>
  <div class="absolute bottom-20 right-5 flex flex-col items-center space-y-4">
    <div class="flex flex-col items-center">
      <IconButton :icon="mdiHeart" :text="reviewCount"></IconButton>
    </div>

    <div class="flex flex-col items-center">
      <IconButton :icon="mdiStar" :text="`${reviewAverage}点`"></IconButton>
    </div>

    <div class="flex flex-col items-center">
      <IconButton :icon="mdiBookmark"></IconButton>
    </div>
    <div class="flex flex-col items-center">
      <nuxt-img
        class="rounded-full h-10 w-10 object-contain"
        placeholder="data:image/gif;base64,R0lGODdhAQABAIEAAO/v7wAAAAAAAAAAACwAAAAAAQABAAAIBAABBAQAOw=="
        :src="imageUrl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiHeart, mdiBookmark, mdiStar } from "@mdi/js";
defineProps({
  reviewCount: {
    type: Number,
    default: 0,
  },
  reviewAverage: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: "/logo.webp",
  },
});
</script>

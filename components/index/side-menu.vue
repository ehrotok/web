<template>
  <div class="absolute bottom-20 right-5 flex flex-col items-center space-y-4">
    <div class="flex flex-col items-center">
      <a
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
        :href="productUrl"
        target="_blank"
      >
        <nuxt-img
          class="rounded-full h-10 w-10 object-contain"
          placeholder="data:image/gif;base64,R0lGODdhAQABAIEAAO/v7wAAAAAAAAAAACwAAAAAAQABAAAIBAABBAQAOw=="
          :src="imageUrl"
        />
      </a>
    </div>
    <div class="flex flex-col items-center">
      <IconButton :icon="mdiHeart" :text="reviewCount"></IconButton>
    </div>

    <div class="flex flex-col items-center">
      <IconButton :icon="mdiStar" :text="`${reviewAverage}点`"></IconButton>
    </div>

    <div class="flex flex-col items-center">
      <IconButton
        :iconClass="isBookmark ? `h-8 w-8 text-yellow-300` : undefined"
        @click="onClickBookmark"
        :icon="mdiBookmark"
      ></IconButton>
    </div>

    <div class="flex flex-col items-center">
      <IconButton @click="onClickHome" :icon="mdiAccountOutline"></IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiHeart, mdiBookmark, mdiStar, mdiAccountOutline } from "@mdi/js";
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
  productUrl: {
    type: String,
    default: "/logo.webp",
  },
  isBookmark: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["click:home", "click:bookmark"]);

const onClickHome = () => {
  emit("click:home");
};

const onClickBookmark = () => {
  emit("click:bookmark");
};
</script>

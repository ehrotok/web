<template>
  <div class="absolute bottom-20 right-2 flex flex-col items-center space-y-3">
    <div
      class="h-12 w-12 flex flex-col items-center rounded-full"
      :class="{ ' bg-gradient-to-br from-[#f67b01] to-[#eaf601]': isRecommend }"
    >
      <a
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
        :href="productUrl"
        target="_blank"
      >
        <nuxt-img
          class="h-11 w-11 object-cover m-0.5 rounded-full"
          :placeholder="Constants.IMAGES.BG_GRAY"
          :src="imageUrl"
        />
      </a>
    </div>
    <div class="flex flex-col items-center">
      <IconButton :icon="mdiHeart" :text="reviewCount"></IconButton>
    </div>

    <div class="flex flex-col items-center">
      <IconButton :icon="mdiStar" :text="reviewAverageText"></IconButton>
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
const props = defineProps({
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
    default: Constants.IMAGES.BG_GRAY,
  },
  productUrl: {
    type: String,
    default: Constants.IMAGES.BG_GRAY,
  },
  isBookmark: {
    type: Boolean,
    default: false,
  },
  isRecommend: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['click:home', 'click:bookmark'])

const reviewAverageText = computed(() =>
  props.reviewAverage > 0 ? `${props.reviewAverage}点` : '',
)

const onClickHome = () => {
  emit('click:home')
}

const onClickBookmark = () => {
  if (navigator.vibrate) {
    navigator.vibrate(100)
  }
  emit('click:bookmark')
}
</script>

<template>
  <div
    v-if="loading.value"
    class="bg-black flex justify-center items-center w-full min-h-dvh perspective-[100px] fixed top-0 left-0 z-[100]"
  >
    <nuxt-img
      :src="Constants.IMAGES.LOGO_WITH_TEXT"
      class="w-[200px] h-auto animation origin-center"
    />
  </div>
</template>

<script setup lang="ts">
const loading = computed(() => useLoader())
</script>

<style scoped>
.animation {
  animation: bounceScale 2s infinite ease-in-out;
}

@keyframes bounceScale {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
}
</style>

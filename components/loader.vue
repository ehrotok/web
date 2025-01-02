<template>
  <div
    v-if="loading.value"
    class="bg-black h-screen flex justify-center items-center w-full h-screen perspective-[100px] fixed top-0 left-0 z-[100]"
  >
    <nuxt-img
      src="/logo.webp"
      class="w-[150px] h-auto animation origin-center"
    />
  </div>
</template>

<script setup lang="ts">
const loading = computed(() => useLoader());
</script>

<style scoped>
.animation {
  animation: rotate3d 2s infinite linear;
}

@keyframes rotate3d {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
    opacity: 1;
  }
  50% {
    transform: rotateY(180deg);
    opacity: 0.8;
  }

  100% {
    transform: rotateY(360deg);
    opacity: 1;
  }
}
</style>

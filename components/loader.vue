<template>
  <div
    v-if="loading.value"
    class="bg-black flex flex-col items-center items-start w-full min-h-dvh perspective-[100px] fixed top-0 left-0 z-[100]"
  >
    <nuxt-img
      :src="Constants.IMAGES.LOGO_WITH_TEXT"
      class="w-36 mt-[20vh] h-auto animation origin-center"
    />
    <div class="flex items-center absolute bottom-10">
      <div class="text-white text-xs mr-2">powered by</div>
      <nuxt-img
        src="/FANZA_logo.svg.png"
        class="w-16 h-auto origin-center"
      />
    </div>
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
    opacity: 0.8;
  }
  50% {
    transform: translateY(-5px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
}
</style>

<template>
  <div class="bg-black">
    <NuxtLayout>
      <Loader></Loader>
      <LandscapeMode></LandscapeMode>
      <div class="min-h-dvh m-auto max-w-md">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const isLandscapeMode = useLandscapeMode();

const isFullscreen = ref(false);

const checkOrientation = () => {
  if (isFullscreen.value) {
    return;
  }

  isLandscapeMode.value = window.innerHeight < window.innerWidth;
};

const checkFullscreen = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

onMounted(async () => {
  window.addEventListener("fullscreenchange", checkFullscreen);
  window.addEventListener("resize", checkOrientation);
  checkFullscreen();
  checkOrientation();
});

onUnmounted(() => {
  window.removeEventListener("fullscreenchange", checkFullscreen);
  window.removeEventListener("resize", checkOrientation);
});
</script>

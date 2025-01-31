<script setup lang="ts">
const statusCode = computed(() => {
  if (location.href.includes('404')) {
    return 404
  }

  return 500
})
</script>

<template>
  <div class="bg-black">
    <NuxtLayout>
      <div class="min-h-dvh m-auto max-w-md">
        <Errors404 v-if="statusCode === 404"></Errors404>
        <Errors500 v-if="statusCode !== 404"></Errors500>
      </div>
    </NuxtLayout>
  </div>
</template>

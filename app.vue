<template>
  <div class="bg-black">
    <NuxtLayout>
      <Loader></Loader>
      <AgeCheck></AgeCheck>
      <div class="min-h-dvh m-auto max-w-md">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import { useFullScreenMode } from './composables/state'
import { Constants } from './config'

const isLandscapeMode = useLandscapeMode()
const isAgeChecked = useAgeCheckState()
const isFullscreenMode = useFullScreenMode()

onMounted(async () => {
  init()
  setupEvents()
  setupWebStorage()
})

onUnmounted(() => {
  removeEvents()
})

const init = async () => {
  checkOrientation()
}

const setupEvents = async () => {
  window.addEventListener('resize', checkOrientation)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      cleanupResources()
    }
  })
}

const removeEvents = async () => {
  window.removeEventListener('resize', checkOrientation)
}

const setupWebStorage = () => {
  if (!Cookies.get(Constants.COOKIE_KEYS.AGE_CHECK)) {
    isAgeChecked.value = false
  }
}

const checkOrientation = () => {
  if (isFullscreenMode.value) {
    return
  }

  isLandscapeMode.value = window.innerHeight < window.innerWidth
}

const cleanupResources = async (): Promise<void> => {
  try {
    Array.from(document.querySelectorAll('video'))
      .filter((v) => !v.paused)
      .forEach((video) => {
        video.pause()
      })
  } catch {}
}
</script>

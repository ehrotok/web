<template>
  <div class="bg-black">
    <NuxtLayout>
      <Loader></Loader>
      <LandscapeMode></LandscapeMode>
      <AgeCheck></AgeCheck>
      <div class="min-h-dvh m-auto max-w-md">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";
import { Constants } from "./config";

const isLandscapeMode = useLandscapeMode();
const isAgeChecked = useAgeCheckState();
const tokenState = useTokenState();
const isFullscreen = ref(false);

onMounted(async () => {
  init();
  setupEvents();
  await setupWebStorage();
});

onUnmounted(() => {
  removeEvents();
});

const init = async () => {
  checkFullscreen();
  checkOrientation();
};

const setupEvents = async () => {
  window.addEventListener("fullscreenchange", checkFullscreen);
  window.addEventListener("resize", checkOrientation);
};

const removeEvents = async () => {
  window.removeEventListener("fullscreenchange", checkFullscreen);
  window.removeEventListener("resize", checkOrientation);
};

const setupWebStorage = async () => {
  if (!Cookies.get(Constants.COOKIE_KEYS.AGE_CHECK)) {
    isAgeChecked.value = false;
  }

  let accounts = await localStorageUtil.getItem<Accounts>(
    Constants.STORAGE_KEYS.ACCOUNTS
  );

  if (!accounts.token) {
    accounts = await $envFetch<Accounts>(Constants.API_URLS.ACCOUNTS);
    localStorageUtil.updateItem(Constants.STORAGE_KEYS.ACCOUNTS, accounts);
  }

  tokenState.value = accounts.token;
};

const checkOrientation = () => {
  if (isFullscreen.value) {
    return;
  }

  isLandscapeMode.value = window.innerHeight < window.innerWidth;
};

const checkFullscreen = () => {
  isFullscreen.value = !!document.fullscreenElement;
};
</script>

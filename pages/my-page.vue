<template>
  <div
    class="py-2 bg-black sticky top-0 z-50 text-white grid grid-cols-3 text-center border-b border-gray-300"
  >
    <div class="border-r border-gray-500">
      <IconButton
        iconClass="h-8 w-8 text-white opacity-30"
        buttonClass="p-1 rounded-full shadow-lg"
        :icon="mdiArrowULeftTop"
        @click="onClickHome"
      ></IconButton>
    </div>
    <div class="border-r border-gray-500">
      <IconButton
        :icon="mdiBookmarkOutline"
        :iconClass="`h-8 w-8 text-white ${
          isSelectTab === 'bookmark' ? '' : 'opacity-30'
        }`"
        @click="onClickBookmark"
      ></IconButton>
    </div>
    <div>
      <IconButton
        :iconClass="`h-8 w-8 text-white ${
          isSelectTab === 'history' ? '' : 'opacity-30'
        }`"
        :icon="mdiHistory"
        @click="onClickHistory"
      ></IconButton>
    </div>
  </div>

  <div class="overflow-scroll grid grid-cols-3">
    <div
      v-for="(tile, index) in tiles"
      :key="index"
      class="border-r border-b border-gray-500 [&:nth-child(3n)]:border-r-0"
    >
      <div class="relative overflow-hidden shadow-md">
        <nuxt-img
          class="w-full h-40 object-contain"
          placeholder="data:image/gif;base64,R0lGODdhAQABAIEAAO/v7wAAAAAAAAAAACwAAAAAAQABAAAIBAABBAQAOw=="
          :src="tile.image"
        />
        <div
          class="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 text-white p-2"
        >
          <p class="line-clamp-1 text-xs mt-1">{{ tile.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiHistory, mdiBookmarkOutline, mdiArrowULeftTop } from "@mdi/js";
import { Constants } from "~/config";

const isSelectTab = ref<"bookmark" | "history">("bookmark");
const bookmarks = ref<LocalStorage[]>([]);
const histories = ref<LocalStorage[]>([]);

const tiles = computed(() => {
  if (isSelectTab.value === "history") {
    return histories.value.map((v) => ({
      image: "/logo.webp",
      title: v.title,
    }));
  }

  return bookmarks.value.map((v) => ({
    image: "/logo.webp",
    title: v.title,
  }));
});

onMounted(async () => {
  bookmarks.value = await localStorageUtil.getItem<LocalStorage>(
    Constants.STORAGE_KEYS.BOOKMARK
  );
});

const onClickHome = async () => {
  await navigateTo(`/`);
};

const onClickBookmark = async () => {
  isSelectTab.value = "bookmark";
  bookmarks.value = await localStorageUtil.getItem<LocalStorage>(
    Constants.STORAGE_KEYS.BOOKMARK
  );
};

const onClickHistory = async () => {
  isSelectTab.value = "history";
  histories.value = await localStorageUtil.getItem<LocalStorage>(
    Constants.STORAGE_KEYS.HISTORY
  );
};
</script>

<template>
  <div class="text-white text-center p-5">
    <nuxt-img
      class="m-auto rounded-full h-20 w-20 object-contain"
      placeholder="data:image/gif;base64,R0lGODdhAQABAIEAAO/v7wAAAAAAAAAAACwAAAAAAQABAAAIBAABBAQAOw=="
      src="/logo.webp"
    />
    <div class="flex justify-evenly p-3">
      <div class="w-full border-r border-gray-500">
        <div class="text-2xl font-bold">{{ histories.count }}</div>
        <div class="text-xs mt-1">再生</div>
      </div>
      <div class="w-full">
        <div class="text-2xl font-bold">{{ bookmarks.count }}</div>
        <div class="text-xs mt-1">ブックマーク</div>
      </div>
    </div>
    <div class="w-full text-sm m-2">
      お気に入りの動画を簡単にブックマーク！履歴から見つけて、いつでも楽しめるよう保存しましょう
    </div>
  </div>
  <div
    class="py-2 bg-black sticky top-0 z-50 text-white grid grid-cols-3 text-center border-b border-gray-300 border-t"
  >
    <div class="border-r border-gray-500">
      <IconButton
        iconClass="h-8 w-8 text-white m-auto opacity-30"
        buttonClass="rounded-full shadow-lg w-full"
        :icon="mdiHomeOutline"
        @click="onClickHome"
      ></IconButton>
      <div class="text-white text-xs leading-3">レコメンド</div>
    </div>
    <div class="border-r border-gray-500">
      <IconButton
        :icon="mdiBookmarkOutline"
        buttonClass="rounded-full shadow-lg w-full"
        :iconClass="`h-8 w-8 text-white m-auto ${
          isSelectBookmarkTab ? '' : 'opacity-30'
        }`"
        @click="onClickIcon('bookmarks')"
      ></IconButton>
      <div class="text-white text-xs leading-3">ブックマーク</div>
    </div>
    <div>
      <IconButton
        buttonClass="rounded-full shadow-lg w-full"
        :iconClass="`h-8 w-8 text-white m-auto ${
          !isSelectBookmarkTab ? '' : 'opacity-30'
        }`"
        :icon="mdiHistory"
        @click="onClickIcon('histories')"
      ></IconButton>
      <div class="text-white text-xs leading-3">履歴</div>
    </div>
  </div>

  <div class="overflow-scroll grid grid-cols-3">
    <div
      v-for="(tile, index) in tiles"
      :key="index"
      class="border-r border-b border-gray-500 [&:nth-child(3n)]:border-r-0"
      @click="onClickTile(index)"
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
const route = useRoute();
const tokenState = useTokenState();

const PATHS = {
  BOOKMARK: "bookmarks",
  HISTORY: "histories",
} as const;

const bookmarks = ref<Videos>({} as Videos);
const histories = ref<Videos>({} as Videos);

const isSelectBookmarkTab = computed(
  () => !route.query.selected || route.query.selected === PATHS.BOOKMARK
);

const tiles = computed(() =>
  (isSelectBookmarkTab.value ? bookmarks : histories).value.result?.map(
    (v) => ({
      image: v.image_url,
      title: v.title,
    })
  )
);

onMounted(async () => {
  await fetch();
});

const fetch = async () => {
  useWait(async () => {
    const query = { token: tokenState.value };
    const [_bookmarks, _histories] = await Promise.all([
      $envFetch<Videos>(Constants.API_URLS.BOOKMARKS, { query }),
      $envFetch<Videos>(Constants.API_URLS.HISTORIES, { query }),
    ]);
    bookmarks.value = _bookmarks;
    histories.value = _histories;
  });
};

const onClickHome = async () => {
  await navigateTo(`/`);
};

const onClickTile = async (index: number) => {
  const param = isSelectBookmarkTab.value ? PATHS.BOOKMARK : PATHS.HISTORY;
  await navigateTo(`/${param}?position=${index}`);
};

const onClickIcon = async (selected: (typeof PATHS)[keyof typeof PATHS]) => {
  await fetch();
  await navigateTo({
    path: "/my-page",
    query: {
      selected: selected,
    },
  });
};
</script>

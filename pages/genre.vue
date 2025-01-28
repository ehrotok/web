<template>
  <div
    v-if="!!hashtags.count"
    class="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg p-4 bg-black flex justify-center items-center flex-col w-full min-h-dvh perspective-[100px] fixed top-0 left-0"
  >
    <nuxt-img
      :src="Constants.IMAGES.LOGO_WITH_TEXT"
      :placeholder="Constants.IMAGES.BG_BLACK"
      class="w-[100px] h-auto animation origin-center"
    />
    <div class="text-gray-400 leading-8 mb-3">
      <div class="text-white text-center font-bold">
        選択したジャンル合わせた動画をお送りします
      </div>
    </div>

    <div class="flex flex-wrap justify-center mb-3">
      <div
        v-for="(genre, index) in hashtags.result"
        :key="index"
        class="mb-2 mr-2 rounded-md bg-white border border-slate-300 py-0.5 px-2.5 text-center transition-all shadow-sm text-slate-600 transition active:scale-150"
        :class="{ '!bg-slate-800 text-white': genre.checked }"
        @click="onClickChip(index)"
      >
        {{ genre.name }}
      </div>
    </div>

    <button
      :disabled="!isSelected"
      @click="onClickStart"
      :class="{ 'opacity-60': !isSelected }"
        class="bg-red-400 font-bold rounded-md text-neutral-50 px-3 py-2 transition active:scale-150"
      >
        動画をみる
    </button>
  </div>
</template>

<script setup lang="ts">
const hashtags = ref<Hashtags>({} as Hashtags)
const isSelected = computed(() => hashtags.value?.result.some((v) => v.checked))

onMounted(() => {
  useWait(async () => {
    hashtags.value = await $envFetch<Hashtags>(Constants.API_URLS.HASHTAGS, {
      query: { kind: 'genre', page: 1 },
    })
  })
})

const onClickChip = async (index: number) => {
  hashtags.value.result[index].checked = !hashtags.value.result[index].checked
}

const onClickStart = async () => {
  const _hashtags = hashtags.value.result.filter((v) => v.checked).map((v) => v.name)
  localStorageUtil.updateItem(Constants.STORAGE_KEYS.HASHTAGS, _hashtags)
  await useWait(async () => {
    $envFetch(Constants.API_URLS.HASHTAG_INTEREST, {
      method: 'POST',
      query: {
        'hashtags[]': _hashtags,
      },
    })
    useGenreState().value = _hashtags
    alert('あなたにとって最高の動画体験をお届けします。さあ、楽しみましょう！')
    navigateTo('/')
  })
}
</script>

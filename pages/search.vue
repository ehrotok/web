<template>
  <div
    class=" top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg p-4 bg-white flex flex-col w-full min-h-dvh perspective-[100px] fixed top-0 left-0"
  >
    <div class="flex">   
      <IconButton
        buttonClass="p-1 rounded-full z-50 transition active:scale-150"
        iconClass="h-6 w-6 text-black"
        :icon="mdiArrowULeftTop"
        @click="onClickBack"
      ></IconButton>
      <label for="search" class="mb-2 text-sm text-gray-900 sr-only">検索</label>
      <div class="relative w-full">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
          </div>
          <input 
            @input="onInput"
            @keypress="onClickEnter"
            ref="inputRef"
            v-model="input"
            type="search"
            class="search-input block w-full p-3 ps-10 text-gray-900 rounded-lg bg-gray-50"
            placeholder="ジャンルや女優名を入力" />
          <button
            :disabled="!hasInput"
            :class="{ 'opacity-60': !hasInput }"
            @click="onClickSearch()"
            type="submit"
            class="top-1 text-red-400 absolute end-1.5 bottom-1.5 font-bold rounded-lg px-4 py-2"
            >
            検索
          </button>
      </div>
    </div> 
    
    <div class="text-lg my-3 font-bold">あなたにおすすめ</div>
    <ul class="overflow-y-auto max-h-[calc(100dvh-150px)]">
    <li 
      class="p-2 hover:bg-gray-300"
      v-for="(tag, index) in suggests"
      :key="index"
      @click="onClickSearch(tag)"
      >
      <span class="font-bold text-red-400">・</span>
      <span class="text-black">{{ tag }}</span>
    </li>
  </ul>
  </div>
</template>

<script setup lang="ts">
const defaultSugests = [
  '巨乳',
  '中出し',
  '痴女',
  '騎乗位',
  'パイズリ',
  'フェラ',
  '寝取り・寝取られ・NTR',
  '美少女',
  '淫乱・ハード系',
]
const hasInput = computed(() => !!input.value.length)
const suggests = ref<string[]>(defaultSugests)
const input = ref<string>('')
const inputRef: Ref<HTMLInputElement | null> = ref(null)
const isComposing = ref<boolean>(false)

onMounted(async () => {
  inputRef.value?.focus()
  inputRef.value?.click()
})

const onClickBack = async () => {
  window.history.back()
}

const onInput = async () => {
  debouncedFetch()
}

const onClickSearch = async (tag?: string) => {
  if (isComposing.value) {
    return
  }

  input.value = tag || input.value
  await navigateTo(`/?q=${input.value}`)
}

const onClickEnter = (e: any) => {
  // @note 非推奨だけど実装めんどいので一旦これで
  if (e.keyCode === 13) {
    onClickSearch()
  }
}

const fetch = () => {
  if (!input.value) {
    suggests.value = defaultSugests
    return
  }

  $envFetch<string[]>(formatUtil.replace(Constants.API_URLS.SUGGEST, input.value))
    .then((v) => {
      if (v.length === 0) {
        suggests.value = defaultSugests
        return
      }
      suggests.value = v
    })
    .catch(() => {
      suggests.value = defaultSugests
    })
}

const debouncedFetch = debounce(fetch, 300)
</script>

<style scoped>
.search-input::-webkit-search-cancel-button {
  @apply hidden;
}

.search-input::-ms-clear {
  @apply hidden;
}

.search-input::-moz-search-clear {
  @apply hidden;
}
</style>
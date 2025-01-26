<template>
  <div
    class="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg p-4 z-50 flex flex-col w-full min-h-dvh perspective-[100px] fixed top-0 left-0"
  >
    <div class="flex">   
      <IconButton
        @click="onClickBack"
        buttonClass="pr-1 rounded-full z-50 transition active:scale-150"
        iconClass="h-6 w-6 text-white"
        :icon="mdiArrowLeft"
      ></IconButton>
      <label for="search" class="mb-2 text-sm text-white sr-only">検索</label>
      <div @click="onClick" class="relative w-full">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
          </div>
          <input 
            ref="inputRef"
            type="search"
            class="search-input border block w-full p-3 ps-10 text-white rounded-lg bg-transparent"
            :value="value" />
          <button
            type="submit"
            class="top-1 text-red-400 absolute end-1.5 bottom-1.5 font-bold rounded-lg px-4 py-2"
            >
            検索
          </button>
      </div>  
    </div> 
    <slot></slot>
  </div> 
</template>

<script setup lang="ts">
defineProps({
  value: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['click', 'back'])

const onClick = () => {
  emit('click')
}

const onClickBack = async () => {
  emit('back')
}
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
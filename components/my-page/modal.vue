<template>
    <div v-if="isVisible" tabindex="-1" aria-hidden="true" class="overflow-y-auto overflow-x-hidden fixed z-[9999] justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="m-auto relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        EhroTokについて
                    </h3>
                    <button @click="onClickClose" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crypto-modal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <div class="p-4 md:p-5">
                    <p class="text-sm font-normal text-gray-500 dark:text-gray-400">お問い合わせやご要望がございましたら、下記のお問い合わせフォームまたはXよりご連絡ください。</p>
                    <ul class="my-4 space-y-3">
                        <li>
                        <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLScM8Xnw26Vh1OxwatPjzlWO9hyG2pjkCRpgMFx-dwp2Z4dtwg/viewform?usp=dialog" 
                        target="_blank"
                        class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                            <span class="flex-1 ms-3 whitespace-nowrap">お問い合わせ</span>
                        </a>
                        </li>
                        <li>
                        <a
                        href="https://x.com/ehrotok"
                        target="_blank"
                        class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                        >
                            <span class="flex-1 ms-3 whitespace-nowrap">X公式（旧Twitter）</span>
                        </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const isVisible = ref(false)
const open = () => {
  isVisible.value = !isVisible.value
}

const onClickClose = async () => {
  open()
}

defineExpose({
  open,
})
</script>

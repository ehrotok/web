<template>
  <div
    v-if="!isAgeChecked.value"
    class="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg p-4 bg-black flex justify-center items-center flex-col w-full min-h-dvh perspective-[100px] fixed top-0 left-0 z-[9999]"
  >
    <nuxt-img
      :src="Constants.IMAGES.LOGO"
      :placeholder="Constants.IMAGES.BG_BLACK"
      class="w-[150px] h-auto animation origin-center"
    />
    <div class="text-gray-400 leading-8">
      <div class="text-sm mb-4">
        ここから先は、アダルトサイトとなります。18歳未満の方のアクセスは固くお断りします。
      </div>
      <div class="text-white text-center text-lg font-bold mb-4">
        あなたは18歳以上ですか？
      </div>
    </div>

    <div class="flex w-full justify-evenly">
      <button
        @click="onClickYes"
        class="w-5/12 bg-red-400 rounded-md text-neutral-50 px-6 transition active:scale-150"
      >
        はい
      </button>
      <button
        @click="onClickNo"
        class="w-5/12 h-12 rounded-md bg-white text-black px-6 transition active:scale-150"
      >
        いいえ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";
const ageCheckedState = useAgeCheckState();
const isAgeChecked = computed(() => ageCheckedState);

const onClickYes = async () => {
  Cookies.set(Constants.COOKIE_KEYS.AGE_CHECK, "true", { expires: 30 });
  ageCheckedState.value = true;
};

const onClickNo = async () => {
  location.href = "https://example.com";
};
</script>

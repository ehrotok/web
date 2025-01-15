<template>
  <button
    @touchstart.stop
    @touchmove.stop
    @touchend.stop
    @click="onClick"
    :class="buttonClass"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      :class="iconClass"
      :fill="fill"
    >
      <path :d="icon" />
    </svg>
  </button>
  <span v-if="text" class="text-white text-sm mt-1">{{ text }}</span>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true,
  },
  buttonClass: {
    type: String,
    default: 'p-1 rounded-full shadow-lg z-50 w-full transition active:scale-150',
  },
  iconClass: {
    type: String,
    default: 'h-8 w-8 text-white m-auto',
  },
  fill: {
    type: String,
    default: 'currentColor',
  },
  text: {
    type: [Number, String],
    default: undefined,
  },
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click')
}
</script>

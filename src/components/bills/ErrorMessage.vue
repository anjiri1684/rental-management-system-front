<script setup>
import { defineProps } from 'vue';

defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative shadow-md animate__animated animate__shakeX" role="alert">
    <strong class="font-bold mr-2">Error!</strong>
    <span class="block sm:inline">{{ message }}</span>
  </div>
</template>

<style scoped>
.animate__shakeX {
  animation-duration: 0.6s;
}
</style>

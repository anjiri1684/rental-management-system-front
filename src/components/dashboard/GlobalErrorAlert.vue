<script setup>
import { defineProps, defineEmits } from 'vue';

 defineProps({
  message: String,
});

const emit = defineEmits(['dismiss']);

const dismiss = () => {
  emit('dismiss');
};
</script>

<template>
  <Transition name="fade">
    <div v-if="message" class="mb-6 p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg flex items-center justify-between shadow-sm animate__animated animate__fadeIn">
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">{{ message }}</span>
      </div>
      <button @click="dismiss" class="text-red-600 hover:text-red-800 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* Vue Transition for error message */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

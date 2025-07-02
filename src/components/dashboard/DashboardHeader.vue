<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
 greeting: String,
 adminName: String,
 currentDate: String,
 currentTime: String,
});

const emit = defineEmits(['navigate']);

const handleNavigate = (path) => {
 emit('navigate', path);
};
</script>

<template>
 <header class="relative mb-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden shadow-lg animate__animated animate__fadeIn">
  <div class="absolute inset-0 bg-black opacity-20"></div>
  <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
   <div class="flex items-center">
    <div class="p-3 bg-white bg-opacity-20 rounded-full mr-5 flex-shrink-0">
     <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
     </svg>
    </div>
    <div>
     <h1 class="text-3xl font-bold text-white leading-tight tracking-wide">{{ greeting }}, {{ adminName }}!</h1>
     <p class="text-md text-blue-100 opacity-90 mt-1">{{ currentDate }} | {{ currentTime }}</p>
    </div>
   </div>
   <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
    <button @click="handleNavigate('/dashboard/tenants/add')" class="header-button bg-white text-blue-600 hover:bg-blue-50">
     <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
     </svg>
     Add Tenant
    </button>
    <button @click="handleNavigate('/dashboard/messages')" class="header-button bg-green-500 text-white hover:bg-green-600">
     <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
     </svg>
     Send Message
    </button>
    <button @click="handleNavigate('/dashboard/messages')" class="header-button bg-gray-700 text-white hover:bg-gray-800">
     <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
     </svg>
     Message History
    </button>
   </div>
  </div>
 </header>
</template>

<style scoped>
.header-button {
 padding: 0.625rem 1.25rem; /* Equivalent to py-2.5 px-5 */
 border-radius: 0.5rem; /* rounded-lg */
 transition: all 0.3s ease-in-out;
 display: inline-flex;
 align-items: center;
 font-weight: 600; /* font-semibold */
 font-size: 0.875rem; /* text-sm */
 box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
}

.header-button:hover {
 transform: translateY(-2px);
 box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
}
</style>

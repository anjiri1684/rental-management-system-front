<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['navigate']);

const handleNavigate = (path) => {
  emit('navigate', path);
};
</script>

<template>
  <section class="mb-8 p-4 bg-white rounded-lg shadow-md animate__animated animate__fadeIn">
    <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center">
      <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Quick Actions
    </h2>
    <div class="flex flex-wrap gap-4">
      <button
        @click="handleNavigate('/dashboard/tenants')"
        class="action-button bg-blue-600 hover:bg-blue-700 text-white"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        View Tenants
      </button>
      <button
        @click="handleNavigate('/dashboard/reports')"
        class="action-button bg-gray-200 hover:bg-gray-300 text-gray-800"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        View Reports
      </button>
      <button
        @click="handleNavigate('/dashboard/employees')"
        class="action-button bg-blue-600 hover:bg-blue-700 text-white"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a2 2 0 00-2-2h-3m-8 0H4a2 2 0 00-2 2v2h5m5-16a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
        Manage Employees
      </button>
    </div>
  </section>
</template>

<style scoped>
.action-button {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;      /* py-2 */
  padding-bottom: 0.5rem;
  border-radius: 0.5rem;     /* rounded-lg */
  transition: all 300ms ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
  display: flex;
  align-items: center;
  font-size: 0.875rem;       /* text-sm */
  font-weight: 600;          /* font-semibold */
}

/* Hover animation */
.action-button:hover {
  transform: translateY(-2px); /* hover:-translate-y-0.5 (~2px) */
}

</style>

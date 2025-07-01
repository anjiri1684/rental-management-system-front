<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  tenant: {
    type: Object,
    required: true // Should pass the full tenant object
  },
  vacantApartmentsExist: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div v-if="props.show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn">
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl animate__animated animate__zoomIn">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Vacate Action</h2>

      <div v-if="props.vacantApartmentsExist">
        <p class="text-gray-700 mb-6">
          Are you sure you want to vacate **{{ props.tenant.firstName }} {{ props.tenant.lastName }}**
          from **{{ props.tenant.houseNumber }}**?
          This will deactivate the tenant and free up the apartment.
        </p>
        <div class="flex justify-end gap-4">
          <button @click="emit('cancel')"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 transition-all duration-300 text-sm font-medium">
            Cancel
          </button>
          <button @click="emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:ring-4 focus:ring-red-200 transition-all duration-300 text-sm font-medium">
            Confirm Vacate
          </button>
        </div>
      </div>

      <div v-else>
        <p class="text-yellow-700 bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert w-5 h-5 flex-shrink-0">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
          Currently, there are **no vacant apartments** available. You cannot vacate a tenant if there's nowhere for them to move, or no other units available for their replacement. Please ensure at least one apartment is vacant before vacating a tenant.
        </p>
        <div class="flex justify-end">
          <button @click="emit('cancel')"
            class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

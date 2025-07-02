<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  tenants: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['close', 'add-bill']);

const newBill = ref({
  tenantId: '',
  currentReading: '',
});

// Reset form when modal is opened
watch(() => props.show, (newVal) => {
  if (newVal) {
    newBill.value = { tenantId: '', currentReading: '' };
  }
});

const handleSubmit = () => {
  emits('add-bill', newBill.value);
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate__animated animate__fadeInDown">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-2xl font-bold text-gray-900">Add Water Bill</h2>
        <button @click="emits('close')" class="text-gray-500 hover:text-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-5">
          <label for="tenant" class="block text-sm font-medium text-gray-700 mb-2">Tenant</label>
          <select
            id="tenant"
            v-model="newBill.tenantId"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
            required
          >
            <option value="" disabled>Select Tenant</option>
            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
              {{ tenant.first_name }} {{ tenant.last_name }} ({{ tenant.house_number }})
            </option>
          </select>
        </div>
        <div class="mb-6">
          <label for="currentReading" class="block text-sm font-medium text-gray-700 mb-2">Current Reading (m³)</label>
          <input
            id="currentReading"
            v-model="newBill.currentReading"
            type="number"
            step="0.01"
            min="0"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800"
            placeholder="Enter current meter reading"
            required
          />
        </div>
        <div class="flex gap-4">
          <button
            type="submit"
            class="flex-1 px-5 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-300 text-base font-semibold flex items-center justify-center"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>Add Bill</span>
          </button>
          <button
            type="button"
            @click="emits('close')"
            class="flex-1 px-5 py-2.5 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-base font-medium"
            :disabled="isLoading"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Add component-specific animations or styles */
.animate__fadeInDown {
  animation-duration: 0.4s;
}
</style>

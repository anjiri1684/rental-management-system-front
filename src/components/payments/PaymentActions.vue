<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  payment: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['confirm', 'validate', 'close'])
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Payment Actions</h2>
      <div class="mb-4">
        <p class="text-sm text-gray-600">
          Tenant: {{ payment.tenant.first_name }} {{ payment.tenant.last_name }}
        </p>
        <p class="text-sm text-gray-600">House Number: {{ payment.apartment.house_number }}</p>
        <p class="text-sm text-gray-600">Amount: KSh {{ payment.amount.toFixed(2) }}</p>
        <p class="text-sm text-gray-600">Status: {{ payment.status }}</p>
        <p class="text-sm text-gray-600">Transaction ID: {{ payment.transaction_id }}</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="emits('confirm')"
          class="w-full px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm font-medium"
          :disabled="payment.status === 'confirmed'"
        >
          Confirm Payment
        </button>
        <button
          @click="emits('validate')"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium"
          :disabled="payment.status === 'confirmed'"
        >
          Validate Payment
        </button>
      </div>
      <button
        @click="emits('close')"
        class="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-400 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
      >
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional modal-specific styles here */
</style>

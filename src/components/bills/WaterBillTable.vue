<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  waterBills: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(['update-status']);

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed':
    case 'paid':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'overdue':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8">
    <div class="overflow-x-auto">
      <table class="w-full text-left table-auto">
        <thead>
          <tr class="border-b border-gray-200 text-gray-700 text-sm uppercase tracking-wider">
            <th class="py-4 px-4 font-semibold">Tenant</th>
            <th class="py-4 px-4 font-semibold">Apartment</th>
            <th class="py-4 px-4 font-semibold">Amount (KES)</th>
            <th class="py-4 px-4 font-semibold">Usage (m³)</th>
            <th class="py-4 px-4 font-semibold">Due Date</th>
            <th class="py-4 px-4 font-semibold">Status</th>
            <th class="py-4 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="bill in waterBills"
            :key="bill.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
          >
            <td class="py-3 px-4 text-gray-800 font-medium">
              {{ bill.tenant?.first_name || 'N/A' }} {{ bill.tenant?.last_name || '' }}
            </td>
            <td class="py-3 px-4 text-gray-700">{{ bill.apartment?.house_number || 'N/A' }}</td>
            <td class="py-3 px-4 text-gray-700">KES {{ Number(bill.amount).toFixed(2) }}</td>
            <td class="py-3 px-4 text-gray-700">{{ Number(bill.usage).toFixed(2) }}</td>
            <td class="py-3 px-4 text-gray-700">{{ new Date(bill.due_date).toLocaleDateString() }}</td>
            <td class="py-3 px-4">
              <span
                :class="getStatusClass(bill.status)"
                class="px-3 py-1 rounded-full text-xs font-semibold uppercase"
              >
                {{ bill.status }}
              </span>
            </td>
            <td class="py-3 px-4">
              <button
                @click="emits('update-status', bill)"
                class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium shadow-md"
                :disabled="bill.status === 'confirmed' || bill.status === 'paid'"
              >
                Update Status
              </button>
            </td>
          </tr>
          <tr v-if="waterBills.length === 0">
            <td colspan="7" class="py-8 text-center text-gray-500 text-base">No water bills found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>

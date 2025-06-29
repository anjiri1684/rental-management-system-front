<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const payments = ref([])
const loading = ref(false)
const errorMessage = ref('')
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(1)
const tenantName = ref('')
const houseNumber = ref('')
const router = useRouter()
const toast = useToast()

// Fetch payments
const fetchPayments = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8080/api/v1/payments', {
      params: {
        page: page.value,
        limit: limit.value,
        tenant_name: tenantName.value,
        house_number: houseNumber.value,
      },
    })
    payments.value = response.data.data
    total.value = response.data.meta.total
    totalPages.value = response.data.meta.totalPages
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Failed to fetch payments'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    fetchPayments()
  }
}

// Filter payments
const filterPayments = () => {
  page.value = 1
  fetchPayments()
}

// Load payments on mount
onMounted(fetchPayments)
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Payments</h1>
      <div class="flex space-x-4">
        <button
          @click="router.push('/dashboard/payments/add')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Add Payment
        </button>
        <button
          @click="router.push('/dashboard')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400"
        >
          Back to Dashboard
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 mb-6 animate__animated animate__fadeInUp">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
          <input
            v-model="tenantName"
            type="text"
            class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by tenant name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">House Number</label>
          <input
            v-model="houseNumber"
            type="text"
            class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by house number"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="filterPayments"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            :disabled="loading"
          >
            Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b">
            <th class="py-2 px-4">Tenant</th>
            <th class="py-2 px-4">House Number</th>
            <th class="py-2 px-4">Amount (KSh)</th>
            <th class="py-2 px-4">Payment Date</th>
            <th class="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in payments" :key="payment.id" class="border-b hover:bg-gray-50">
            <td class="py-2 px-4">{{ payment.tenant.first_name }} {{ payment.tenant.last_name }}</td>
            <td class="py-2 px-4">{{ payment.apartment.house_number }}</td>
            <td class="py-2 px-4">{{ payment.amount.toFixed(2) }}</td>
            <td class="py-2 px-4">{{ new Date(payment.payment_date).toLocaleDateString() }}</td>
            <td class="py-2 px-4">
              <span :class="{
                'text-green-600': payment.status === 'confirmed',
                'text-yellow-600': payment.status === 'pending',
                'text-red-600': payment.status === 'failed'
              }">
                {{ payment.status }}
              </span>
            </td>
          </tr>
          <tr v-if="payments.length === 0">
            <td colspan="5" class="py-4 text-center text-gray-600">No payments found</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <div>
          Showing {{ (page - 1) * limit + 1 }} to {{ Math.min(page * limit, total) }} of {{ total }} payments
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(page - 1)"
            :disabled="page === 1 || loading"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Previous
          </button>
          <button
            @click="changePage(page + 1)"
            :disabled="page === totalPages || loading"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

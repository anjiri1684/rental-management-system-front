<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const payments = ref([])
const loading = ref(false)
const errorMessage = ref('')
const page = ref(1)
const limit = ref(5)
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
    totalPages.value = Math.ceil(total.value / limit.value)
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

// Reset filters
const resetFilters = () => {
  tenantName.value = ''
  houseNumber.value = ''
  page.value = 1
  fetchPayments()
}

// View payment details
const viewPaymentDetails = (paymentId) => {
  router.push(`/dashboard/payments/${paymentId}`)
}

// Load payments on mount
onMounted(fetchPayments)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate__animated animate__fadeIn">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Payments</h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
          @click="router.push('/dashboard/payments/add')"
          class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium"
        >
          Add Payment
        </button>
        <button
          @click="router.push('/dashboard')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-400 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
        >
          Back to Dashboard
        </button>
        <button
          @click="toast.success('Test toast')"
          class="px-4 py-2 bg-blue-300 text-white rounded-full hover:bg-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-sm font-medium"
        >
          Test Toast
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 animate__animated animate__fadeIn animate__delay-1s">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Tenant Name</label>
          <input
            v-model="tenantName"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
            placeholder="Search by tenant name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">House Number</label>
          <input
            v-model="houseNumber"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
            placeholder="Search by house number"
          />
        </div>
        <div class="flex items-end gap-3">
          <button
            @click="filterPayments"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium"
            :disabled="loading"
          >
            Filter
          </button>
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-400 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
            :disabled="loading"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate__animated animate__fadeIn animate__delay-2s">
      <div class="overflow-x-auto relative">
        <!-- Loading Spinner -->
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
          <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-100 text-gray-600">
              <th class="py-4 px-4 font-medium text-sm">Tenant</th>
              <th class="py-4 px-4 font-medium text-sm">House Number</th>
              <th class="py-4 px-4 font-medium text-sm">Amount (KSh)</th>
              <th class="py-4 px-4 font-medium text-sm">Payment Date</th>
              <th class="py-4 px-4 font-medium text-sm">Status</th>
              <th class="py-4 px-4 font-medium text-sm">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="payment in payments"
              :key="payment.id"
              @click="viewPaymentDetails(payment.id)"
              class="border-b border-gray-100 hover:bg-gray-100 transition-colors duration-200 cursor-pointer relative group"
            >
              <td class="py-4 px-4 text-gray-800">{{ payment.tenant.first_name }} {{ payment.tenant.last_name }}</td>
              <td class="py-4 px-4 text-gray-800">{{ payment.apartment.house_number }}</td>
              <td class="py-4 px-4 text-gray-800">{{ payment.amount.toFixed(2) }}</td>
              <td class="py-4 px-4 text-gray-800">{{ new Date(payment.payment_date).toLocaleDateString() }}</td>
              <td class="py-4 px-4">
                <span
                  :class="{
                    'text-green-600': payment.status === 'confirmed',
                    'text-yellow-600': payment.status === 'pending',
                    'text-red-600': payment.status === 'overdue'
                  }"
                  class="font-medium"
                >
                  {{ payment.status }}
                </span>
              </td>
              <td class="py-4 px-4">
                <span class="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  View Details
                </span>
              </td>
            </tr>
            <tr v-if="payments.length === 0 && !loading">
              <td colspan="6" class="py-6 text-center text-gray-500 text-sm">No payments found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div class="text-sm text-gray-600">
          Showing {{ (page - 1) * limit + 1 }} to {{ Math.min(page * limit, total) }} of {{ total }} payments
        </div>
        <div class="flex gap-2 items-center">
          <button
            @click="changePage(page - 1)"
            :disabled="page === 1 || loading"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-400 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <div class="flex gap-1">
            <button
              v-for="p in totalPages"
              :key="p"
              @click="changePage(p)"
              :class="{
                'px-3 py-1 rounded-full text-sm font-medium transition-all duration-300': true,
                'bg-blue-600 text-white hover:bg-blue-700': p === page,
                'bg-gray-300 text-gray-900 hover:bg-gray-400': p !== page
              }"
            >
              {{ p }}
            </button>
          </div>
          <button
            @click="changePage(page + 1)"
            :disabled="page === totalPages || loading"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-400 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-6 text-red-600 text-sm font-medium text-center animate__animated animate__shakeX">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__fadeIn { animation-duration: 0.5s; }
.animate__delay-1s { animation-delay: 0.3s; }
.animate__delay-2s { animation-delay: 0.6s; }
.animate__shakeX { animation-duration: 0.5s; }

/* Smooth scrollbar for table overflow */
::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 9999px;
}

/* Table row hover effect */
tbody tr:hover {
  transform: translateY(-1px);
}

/* Ensure table is responsive */
table {
  min-width: 100%;
}
</style>

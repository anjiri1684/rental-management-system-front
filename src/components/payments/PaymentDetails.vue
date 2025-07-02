<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { User, Home, DollarSign, Calendar, Clock, AlertCircle, ArrowLeft } from 'lucide-vue-next' // Added ArrowLeft for the back button

const payment = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Fetch payment details
const fetchPayment = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/payments/${route.params.id}`)
    payment.value = response.data.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Failed to fetch payment details'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Load payment on mount
onMounted(fetchPayment)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10 font-sans">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Payment Details</h1>
      <div class="mt-4 md:mt-0">
        <button
          @click="router.push('/dashboard/payment-received')"
          class="inline-flex items-center px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 ease-in-out shadow-sm text-base font-medium"
        >
          <ArrowLeft class="w-5 h-5 mr-2" />
          Back to Payments
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-xl p-6 md:p-8 lg:p-10 border border-gray-100">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="errorMessage" class="text-red-600 text-lg font-semibold text-center py-10">
        <AlertCircle class="w-8 h-8 inline-block mr-3 text-red-500" />
        {{ errorMessage }}
      </div>
      <div v-else-if="payment" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="flex flex-col p-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg shadow-md text-white">
          <div class="flex items-center mb-4">
            <DollarSign class="w-8 h-8 mr-3 opacity-90" />
            <h2 class="text-2xl font-bold">Payment #{{ payment.id }}</h2>
          </div>
          <p class="text-lg font-semibold mb-2">KSh {{ payment.amount.toFixed(2) }}</p>
          <p class="text-sm opacity-90">Made on {{ new Date(payment.payment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>

          <div class="mt-auto pt-6 border-t border-blue-400/50">
            <div class="flex items-center text-sm opacity-90">
              <Calendar class="w-4 h-4 mr-2" />
              <span>Payment Date: {{ new Date(payment.payment_date).toLocaleDateString() }}</span>
            </div>
            <div class="flex items-center text-sm opacity-90 mt-2">
              <Clock class="w-4 h-4 mr-2" />
              <span>Recorded: {{ new Date(payment.created_at).toLocaleString('en-US', { timeZone: 'Africa/Nairobi', dateStyle: 'short', timeStyle: 'short' }) }}</span>
            </div>
            <div class="flex items-center mt-3">
              <span
                :class="{
                  'bg-green-100 text-green-700': payment.status === 'confirmed',
                  'bg-yellow-100 text-yellow-700': payment.status === 'pending',
                  'bg-red-100 text-red-700': payment.status === 'overdue'
                }"
                class="px-3 py-1 rounded-full text-sm font-semibold tracking-wide capitalize"
              >
                {{ payment.status }}
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Tenant Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                <User class="w-5 h-5 text-blue-600" />
                <div>
                  <p class="text-sm font-medium text-gray-600">Tenant Name</p>
                  <p class="text-base font-semibold text-gray-900">{{ payment.tenant.first_name }} {{ payment.tenant.last_name }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-600">Tenant ID</p>
                  <p class="text-base font-semibold text-gray-900">{{ payment.tenant_id }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Apartment Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                <Home class="w-5 h-5 text-blue-600" />
                <div>
                  <p class="text-sm font-medium text-gray-600">House Number</p>
                  <p class="text-base font-semibold text-gray-900">{{ payment.apartment.house_number }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-600">Apartment ID</p>
                  <p class="text-base font-semibold text-gray-900">{{ payment.apartment_id }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


/* Custom spinner for loading state */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

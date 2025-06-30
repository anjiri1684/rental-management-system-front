<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { User, Home, DollarSign, Calendar, Clock, AlertCircle } from 'lucide-vue-next'

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
  <div class="min-h-screen bg-gray-50 p-6 md:p-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate__animated animate__fadeIn">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Payment Details</h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
          @click="router.push('/dashboard/payments')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-400 hover:scale-105 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium flex items-center gap-2"
        >
          <span>Back to Payments</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Payment Details -->
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 animate__animated animate__fadeIn animate__delay-1s">
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="errorMessage" class="text-red-600 text-base font-medium text-center animate__animated animate__bounceIn">
        <AlertCircle class="w-6 h-6 inline-block mr-2" />
        {{ errorMessage }}
      </div>
      <div v-else-if="payment" class="space-y-6">
        <!-- Header with Gradient -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-4 text-white">
          <h2 class="text-xl font-semibold">Payment #{{ payment.id }}</h2>
          <p class="text-sm opacity-80">Details for payment made on {{ new Date(payment.payment_date).toLocaleDateString() }}</p>
        </div>

        <!-- Payment Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4 border-b border-gray-200 pb-2">Payment Information</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <DollarSign class="w-5 h-5 text-blue-600" />
              <div>
                <span class="text-sm font-medium text-gray-600">Amount (KSh):</span>
                <span class="ml-2 text-gray-800 font-medium">{{ payment.amount.toFixed(2) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Calendar class="w-5 h-5 text-blue-600" />
              <div>
                <span class="text-sm font-medium text-gray-600">Payment Date:</span>
                <span class="ml-2 text-gray-800 font-medium">{{ new Date(payment.payment_date).toLocaleDateString() }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span class="text-sm font-medium text-gray-600">Status:</span>
                <span
                  :class="{
                    'bg-green-100 text-green-600': payment.status === 'confirmed',
                    'bg-yellow-100 text-yellow-600': payment.status === 'pending',
                    'bg-red-100 text-red-600': payment.status === 'overdue'
                  }"
                  class="ml-2 px-2 py-1 rounded-full text-sm font-medium"
                >
                  {{ payment.status }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Clock class="w-5 h-5 text-blue-600" />
              <div>
                <span class="text-sm font-medium text-gray-600">Created At:</span>
                <span class="ml-2 text-gray-800 font-medium">{{ new Date(payment.created_at).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tenant & Apartment Information -->
        <div>
          <h3 class="text-lg font-medium text-gray-700 mb-4 border-b border-gray-200 pb-2">Tenant & Apartment</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <User class="w-5 h-5 text-blue-600" />
              <div>
                <span class="text-sm font-medium text-gray-600">Tenant Name:</span>
                <span class="ml-2 text-gray-800 font-medium">{{ payment.tenant.first_name }} {{ payment.tenant.last_name }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <div>
                <span class="text-sm font-medium text-gray-600">Tenant ID:</span>
                <span class="ml-2 text-gray-800 font-medium">{{ payment.tenant_id }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Home class="w-5 h-5 text-blue-600" />
              <div>
                <span class="text-sm font-medium text-gray-600">House Number:</span>
                <span class="ml-2 text-gray-800 font-medium">{{ payment.apartment.house_number }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <span class="text-sm font-medium text-gray-600">Apartment ID:</span>
                <span class="ml-2 text-gray-800 font-medium">{{ payment.apartment_id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__fadeIn { animation-duration: 0.5s; }
.animate__delay-1s { animation-delay: 0.3s; }
.animate__bounceIn { animation-duration: 0.5s; }

/* Smooth transitions for hover effects */
button:hover {
  transform: scale(1.05);
}

/* Card hover effect */
.bg-white\/95:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .space-y-6 > div {
    padding: 0.5rem;
  }
}
</style>

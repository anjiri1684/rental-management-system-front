<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiClient from '../../services/apiClient' 

const route = useRoute()
const toast = useToast()
const messageDetails = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const fetchMessageDetails = async () => {
  loading.value = true
  try {
    const response = await apiClient.get(`/messages/${route.params.id}`)
    messageDetails.value = response.data.data
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.message
    toast.error('Failed to fetch message details: ' + errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Copy message content to clipboard
const copyMessage = () => {
  navigator.clipboard.writeText(messageDetails.value.message)
    .then(() => toast.success('Message copied to clipboard!'))
    .catch(() => toast.error('Failed to copy message'))
}

onMounted(fetchMessageDetails)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate__animated animate__fadeIn">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Message Details</h1>
      <div class="mt-4 sm:mt-0 flex gap-3">
        <button
          @click="$router.push('/dashboard/sent-messages')"
          class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium shadow-md"
        >
          Back to Message History
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-16 animate__animated animate__pulse animate__infinite">
      <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-3 text-gray-600 text-lg">Loading message details...</p>
    </div>

    <!-- Error State -->
    <div v-if="errorMessage && !loading" class="bg-red-50 rounded-2xl shadow-lg p-8 text-center animate__animated animate__fadeIn animate__delay-1s">
      <p class="text-red-600 text-lg font-medium">{{ errorMessage }}</p>
      <button
        @click="fetchMessageDetails"
        class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium shadow-md"
      >
        Retry
      </button>
    </div>

    <!-- Message Details -->
    <div v-if="messageDetails && !loading" class="bg-white rounded-2xl shadow-xl p-8 md:p-10 animate__animated animate__fadeIn animate__delay-1s">
      <!-- Message Content Card -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Message Content</h2>
          <button
            @click="copyMessage"
            class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-300 text-sm font-medium"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy
          </button>
        </div>
        <p class="text-gray-800 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">{{ messageDetails.message }}</p>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="space-y-6">
          <div>
            <h3 class="text-md font-medium text-gray-600">Recipient</h3>
            <p class="text-gray-900 font-semibold">{{ messageDetails.recipient }}</p>
          </div>
          <div>
            <h3 class="text-md font-medium text-gray-600">Status</h3>
            <span :class="{
              'bg-green-100 text-green-800': messageDetails.status === 'sent',
              'bg-red-100 text-red-800': messageDetails.status === 'failed',
              'bg-yellow-100 text-yellow-800': messageDetails.status !== 'sent' && messageDetails.status !== 'failed'
            }" class="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize">
              {{ messageDetails.status }}
            </span>
          </div>
          <div>
            <h3 class="text-md font-medium text-gray-600">Sent At</h3>
            <p class="text-gray-900 font-semibold">{{ new Date(messageDetails.sent_at).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }) }}</p>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <div>
            <h3 class="text-md font-medium text-gray-600">Message ID</h3>
            <p class="text-gray-900 font-semibold">{{ messageDetails.id }}</p>
          </div>
          <div>
            <h3 class="text-md font-medium text-gray-600">Invoice ID</h3>
            <p class="text-gray-900 font-semibold">{{ messageDetails.invoice_id || 'N/A' }}</p>
          </div>
          <div>
            <h3 class="text-md font-medium text-gray-600">Reference</h3>
            <p v-if="messageDetails.reference_type && messageDetails.reference_id" class="text-gray-900 font-semibold">
              {{ messageDetails.reference_type }} #{{ messageDetails.reference_id }}
            </p>
            <p v-else class="text-gray-900 font-semibold">N/A</p>
          </div>
          <div>
            <h3 class="text-md font-medium text-gray-600">Created At</h3>
            <p class="text-gray-900 font-semibold">{{ new Date(messageDetails.created_at).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }) }}</p>
          </div>
          <div>
            <h3 class="text-md font-medium text-gray-600">Updated At</h3>
            <p class="text-gray-900 font-semibold">{{ new Date(messageDetails.updated_at).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }) }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-10 flex justify-end gap-4">
        <button
          @click="fetchMessageDetails"
          class="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium shadow-md"
        >
          Refresh
        </button>
        <button
          @click="$router.push('/dashboard/sent-messages')"
          class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium shadow-md"
        >
          Back to Message History
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__fadeIn { animation-duration: 0.5s; }
.animate__delay-1s { animation-delay: 0.3s; }
.animate__pulse { animation-duration: 1s; }

/* Smooth scrollbar */
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
</style>

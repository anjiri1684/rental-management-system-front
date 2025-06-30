<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

// Message state
const messages = ref([])
const loading = ref(false)
const errorMessage = ref('')
const page = ref(1)
const limit = ref(5) // Changed to 5 messages per page
const total = ref(0)
const totalPages = ref(1)
const recipientFilter = ref('')
const startDate = ref('')
const endDate = ref('')

const router = useRouter()
const toast = useToast()

// Fetch messages
const fetchMessages = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8080/api/v1/messages', {
      params: {
        page: page.value,
        limit: limit.value,
        recipient: recipientFilter.value,
        start_date: startDate.value,
        end_date: endDate.value,
      },
    })
    messages.value = response.data.data
    total.value = response.data.meta.total
    totalPages.value = Math.ceil(total.value / limit.value) // Calculate total pages
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Failed to fetch messages'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
    fetchMessages()
  }
}

// Filter messages
const filterMessages = () => {
  page.value = 1
  fetchMessages()
}

// Reset filters
const resetFilters = () => {
  recipientFilter.value = ''
  startDate.value = ''
  endDate.value = ''
  page.value = 1
  fetchMessages()
}

// View message details
const viewMessageDetails = (messageId) => {
  router.push(`/dashboard/sent-messages/${messageId}`)
}

// Load messages on mount
onMounted(() => {
  fetchMessages()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate__animated animate__fadeIn">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Message History</h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button
          @click="router.push('/messages')"
          class="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm font-medium"
        >
          Send New Message
        </button>
        <button
          @click="router.push('/dashboard/payments')"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
        >
          Back to Payments
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
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 animate__animated animate__fadeIn animate__delay-1s">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Recipient</label>
          <input
            v-model="recipientFilter"
            type="text"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
            placeholder="Filter by phone number"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <div class="flex items-end gap-3">
          <button
            @click="filterMessages"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium"
            :disabled="loading"
          >
            Filter
          </button>
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
            :disabled="loading"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Messages Table -->
    <div class="bg-white rounded-2xl shadow-lg p-6 animate__animated animate__fadeIn animate__delay-2s">
      <div class="overflow-x-auto relative">
        <!-- Loading Spinner -->
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
          <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-100 text-gray-600">
              <th class="py-4 px-4 font-medium text-sm">Recipient</th>
              <th class="py-4 px-4 font-medium text-sm">Message</th>
              <th class="py-4 px-4 font-medium text-sm">Sent At</th>
              <th class="py-4 px-4 font-medium text-sm">Status</th>
              <th class="py-4 px-4 font-medium text-sm">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="message in messages"
              :key="message.id"
              @click="viewMessageDetails(message.id)"
              class="border-b border-gray-100 hover:bg-gray-100 transition-colors duration-200 cursor-pointer relative group"
            >
              <td class="py-4 px-4 text-gray-800">{{ message.recipient }}</td>
              <td class="py-4 px-4 text-gray-800">{{ message.message }}</td>
              <td class="py-4 px-4 text-gray-800">{{ new Date(message.sent_at).toLocaleString() }}</td>
              <td class="py-4 px-4">
                <span
                  :class="{
                    'text-green-600': message.status === 'sent',
                    'text-red-600': message.status === 'failed'
                  }"
                  class="font-medium"
                >
                  {{ message.status }}
                </span>
              </td>
              <td class="py-4 px-4">
                <span class="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  View Details
                </span>
              </td>
            </tr>
            <tr v-if="messages.length === 0 && !loading">
              <td colspan="5" class="py-6 text-center text-gray-500 text-sm">No messages found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div class="text-sm text-gray-600">
          Showing {{ (page - 1) * limit + 1 }} to {{ Math.min(page * limit, total) }} of {{ total }} messages
        </div>
        <div class="flex gap-2 items-center">
          <button
            @click="changePage(page - 1)"
            :disabled="page === 1 || loading"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium disabled:opacity-50"
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
                'bg-gray-200 text-gray-800 hover:bg-gray-300': p !== page
              }"
            >
              {{ p }}
            </button>
          </div>
          <button
            @click="changePage(page + 1)"
            :disabled="page === totalPages || loading"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium disabled:opacity-50"
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

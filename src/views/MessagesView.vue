<script setup>
import { ref, computed } from 'vue'
import Papa from 'papaparse' // Import PapaParse for CSV parsing

// Form state
const recipientType = ref('Single')
const singlePhone = ref('')
const multiplePhones = ref('')
const csvFile = ref(null)
const message = ref('')
const showConfirmModal = ref(false)
const parsedPhoneNumbers = ref([])

// Handle CSV file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'text/csv') {
    Papa.parse(file, {
      complete: (result) => {
        parsedPhoneNumbers.value = result.data
          .map((row) => (row.phone || row[0])?.trim())
          .filter((phone) => phone && /^\+?\d{10,}$/.test(phone)) // Basic phone validation
      },
      header: true,
      skipEmptyLines: true,
    })
  } else {
    alert('Please upload a valid CSV file.')
  }
}

// Validate phone numbers
const validatePhone = (phone) => {
  return /^\+?\d{10,}$/.test(phone.trim())
}

const validateMultiplePhones = (phones) => {
  return phones
    .split(',')
    .map((phone) => phone.trim())
    .filter((phone) => phone)
    .every((phone) => validatePhone(phone))
}

// Computed property to get recipient phone numbers
const recipientPhoneNumbers = computed(() => {
  if (recipientType.value === 'Single') {
    return singlePhone.value && validatePhone(singlePhone.value) ? [singlePhone.value] : []
  } else if (recipientType.value === 'Multiple' && multiplePhones.value) {
    return multiplePhones.value
      .split(',')
      .map((phone) => phone.trim())
      .filter((phone) => validatePhone(phone))
  } else if (recipientType.value === 'Multiple' && parsedPhoneNumbers.value.length) {
    return parsedPhoneNumbers.value
  }
  return []
})

// Handle form submission
const sendMessage = () => {
  if (recipientPhoneNumbers.value.length === 0) {
    alert('Please provide valid phone number(s) or upload a valid CSV.')
    return
  }
  showConfirmModal.value = true
}

const confirmSend = () => {
  // Placeholder for sending logic
  console.log({
    recipients: recipientPhoneNumbers.value,
    message: message.value,
  })
  showConfirmModal.value = false
  // Reset form
  recipientType.value = 'Single'
  singlePhone.value = ''
  multiplePhones.value = ''
  csvFile.value = null
  parsedPhoneNumbers.value = []
  message.value = ''
}

const resetForm = () => {
  recipientType.value = 'Single'
  singlePhone.value = ''
  multiplePhones.value = ''
  csvFile.value = null
  parsedPhoneNumbers.value = []
  message.value = ''
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Send Message</h1>
    </div>

    <!-- Message Form -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
      <form @submit.prevent="sendMessage">
        <!-- Recipient Type -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
          <select
            v-model="recipientType"
            class="w-full border-gray-300 rounded-lg pl-2.5 py-2.5 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Single">Single Recipient</option>
            <option value="Multiple">Multiple Recipients</option>
          </select>
        </div>

        <!-- Single Phone Number -->
        <div class="mb-4" v-if="recipientType === 'Single'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            v-model="singlePhone"
            type="tel"
            class="w-full border-gray-300 pl-2.5 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., +254123456789"
            required
          />
          <p v-if="singlePhone && !validatePhone(singlePhone)" class="text-sm text-red-600 mt-1">
            Please enter a valid phone number (e.g., +254123456789)
          </p>
        </div>

        <!-- Multiple Phone Numbers -->
        <div class="mb-4" v-if="recipientType === 'Multiple'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Numbers (comma-separated)</label>
          <textarea
            v-model="multiplePhones"
            rows="3"
            class="w-full border-gray-300 pl-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., +254123456789, +254987654321"
          ></textarea>
          <p v-if="multiplePhones && !validateMultiplePhones(multiplePhones)" class="text-sm text-red-600 mt-1">
            Please enter valid phone numbers separated by commas
          </p>

          <label class="block text-sm font-medium text-gray-700 mb-1 mt-4">Or Upload CSV</label>
          <input
            type="file"
            accept=".csv"
            @change="handleFileUpload"
            class="w-full border-gray-300 py-2.5 pl-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <p class="text-sm text-gray-600 mt-1">CSV should have a 'phone' column or phone numbers in the first column</p>
          <div v-if="parsedPhoneNumbers.length" class="mt-2">
            <p class="text-sm text-gray-600">Parsed {{ parsedPhoneNumbers.length }} phone numbers</p>
          </div>
        </div>

        <!-- Message -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            v-model="message"
            rows="5"
            class="w-full border-gray-300 pl-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your message"
            required
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
          >
            Clear
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            :disabled="!message || (!singlePhone && recipientType === 'Single') || (recipientType === 'Multiple' && !multiplePhones && !parsedPhoneNumbers.length)"
          >
            Send
          </button>
        </div>
      </form>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Send</h2>
        <p class="text-gray-600 mb-4">
          Send message to {{ recipientPhoneNumbers.length }} recipient{{ recipientPhoneNumbers.length > 1 ? 's' : '' }}?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showConfirmModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="confirmSend"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

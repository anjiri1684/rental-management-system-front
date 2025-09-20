<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiClient from '../../services/apiClient' // Import the API client
import Papa from 'papaparse'

// Form state
const recipientType = ref('Single')
const singleTenantId = ref(null)
const apartmentId = ref(null)
const csvFile = ref(null)
const message = ref('')
const showConfirmModal = ref(false)
const parsedPhoneNumbers = ref([])
const tenants = ref([])
const apartments = ref([])
const loading = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)

const router = useRouter()
const toast = useToast()

// Fetch tenants and apartments
const fetchTenants = async () => {
  try {
    const response = await apiClient.get('/tenants')
    tenants.value = response.data.data
  } catch (error) {
    toast.error('Failed to fetch tenants: ' + (error.response?.data?.error || error.message))
  }
}

const fetchApartments = async () => {
  try {
    const response = await apiClient.get('/apartments?status=occupied')
    apartments.value = response.data.data
  } catch (error) {
    toast.error('Failed to fetch apartments: ' + (error.response?.data?.error || error.message))
  }
}

// Handle CSV file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'text/csv') {
    Papa.parse(file, {
      complete: (result) => {
        parsedPhoneNumbers.value = result.data
          .map((row) => (row.phone || row[0])?.trim())
          .filter((phone) => phone && /^\+?\d{10,}$/.test(phone))
        if (parsedPhoneNumbers.value.length === 0) {
          toast.error('No valid phone numbers found in CSV')
        } else {
          toast.info(`Parsed ${parsedPhoneNumbers.value.length} phone numbers`)
        }
      },
      header: true,
      skipEmptyLines: true,
    })
  } else {
    toast.error('Please upload a valid CSV file')
  }
}

// Validate phone numbers
const validatePhone = (phone) => {
  return /^\+?\d{10,}$/.test(phone.trim())
}

// Computed property for recipient phone numbers
const recipientPhoneNumbers = computed(() => {
  if (recipientType.value === 'Single') {
    const tenant = tenants.value.find(t => t.id === singleTenantId.value)
    return tenant && validatePhone(tenant.phone_number) ? [tenant.phone_number] : []
  } else if (recipientType.value === 'Apartment') {
    return tenants.value
      .filter(t => t.apartment_id === apartmentId.value && validatePhone(t.phone_number))
      .map(t => t.phone_number)
  } else if (recipientType.value === 'CSV') {
    return parsedPhoneNumbers.value
  }
  return []
})

// Handle form submission
const sendMessage = () => {
  if (!message.value) {
    toast.error('Message is required')
    return
  }
  if (recipientType.value === 'Single' && !singleTenantId.value) {
    toast.error('Please select a tenant')
    return
  }
  if (recipientType.value === 'Apartment' && !apartmentId.value) {
    toast.error('Please select an apartment')
    return
  }
  if (recipientType.value === 'CSV' && !parsedPhoneNumbers.value.length) {
    toast.error('Please upload a valid CSV with phone numbers')
    return
  }
  if (recipientPhoneNumbers.value.length === 0) {
    toast.error('No valid recipients selected')
    return
  }
  showConfirmModal.value = true
}

const confirmSend = async () => {
  loading.value = true
  try {
    const payload = {
      recipientType: recipientType.value,
      message: message.value,
    }
    if (recipientType.value === 'Single') {
      payload.tenantId = singleTenantId.value
    } else if (recipientType.value === 'Apartment') {
      payload.apartmentId = apartmentId.value
    } else if (recipientType.value === 'CSV') {
      payload.phoneNumbers = parsedPhoneNumbers.value
    }
    await apiClient.post('/messages', payload)
    loading.value = false
    showConfirmModal.value = false
    showSuccessModal.value = true
  } catch (error) {
    loading.value = false
    showConfirmModal.value = false
    errorMessage.value = error.response?.data?.error || 'Failed to send message'
    toast.error(errorMessage.value)
  }
}

// Close success modal and redirect
const closeSuccessModal = () => {
  showSuccessModal.value = false
  resetForm()
  router.push('/dashboard')
}

// Reset form
const resetForm = () => {
  recipientType.value = 'Single'
  singleTenantId.value = null
  apartmentId.value = null
  csvFile.value = null
  parsedPhoneNumbers.value = []
  message.value = ''
  errorMessage.value = ''
}

// Fetch data on mount
onMounted(() => {
  fetchTenants()
  fetchApartments()
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Send Message</h1>
      <div class="flex space-x-4">
        <button
          @click="router.push('/dashboard/payments')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
        >
          Back to Payments
        </button>

      </div>
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
            :disabled="loading"
          >
            <option value="Single">Single Tenant</option>
            <option value="Apartment">Apartment Tenants</option>
            <option value="CSV">CSV Upload</option>
          </select>
        </div>

        <!-- Single Tenant -->
        <div class="mb-4" v-if="recipientType === 'Single'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
          <select
            v-model="singleTenantId"
            class="w-full border-gray-300 pl-2.5 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading || tenants.length === 0"
          >
            <option value="" disabled>Select a tenant</option>
            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
              {{ tenant.first_name }} {{ tenant.last_name }} ({{ tenant.phone_number }})
            </option>
          </select>
          <p v-if="tenants.length === 0" class="text-sm text-yellow-600 mt-1">No tenants available</p>
          <p v-if="singleTenantId && !recipientPhoneNumbers.length" class="text-sm text-red-600 mt-1">
            Invalid phone number for selected tenant
          </p>
        </div>

        <!-- Apartment Tenants -->
        <div class="mb-4" v-if="recipientType === 'Apartment'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Apartment</label>
          <select
            v-model="apartmentId"
            class="w-full border-gray-300 pl-2.5 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading || apartments.length === 0"
          >
            <option value="" disabled>Select an apartment</option>
            <option v-for="apartment in apartments" :key="apartment.id" :value="apartment.id">
              {{ apartment.house_number }} ({{ apartment.unit_type }})
            </option>
          </select>
          <p v-if="apartments.length === 0" class="text-sm text-yellow-600 mt-1">No occupied apartments available</p>
          <p v-if="apartmentId && !recipientPhoneNumbers.length" class="text-sm text-red-600 mt-1">
            No valid phone numbers for tenants in this apartment
          </p>
        </div>

        <!-- CSV Upload -->
        <div class="mb-4" v-if="recipientType === 'CSV'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Upload CSV</label>
          <input
            type="file"
            accept=".csv"
            @change="handleFileUpload"
            class="w-full border-gray-300 py-2.5 pl-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading"
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
            :disabled="loading"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
            :disabled="loading"
          >
            Clear
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            :disabled="loading || !message || (recipientType === 'Single' && !singleTenantId) || (recipientType === 'Apartment' && !apartmentId) || (recipientType === 'CSV' && !parsedPhoneNumbers.length)"
          >
            {{ loading ? 'Sending...' : 'Send' }}
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
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            @click="confirmSend"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            :disabled="loading"
          >
            {{ loading ? 'Sending...' : 'Send' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-green-600 mb-4">Message Sent Successfully</h2>
        <p class="text-gray-600 mb-4">
          Message sent to {{ recipientPhoneNumbers.length }} recipient{{ recipientPhoneNumbers.length > 1 ? 's' : '' }}.
        </p>
        <div class="flex justify-end">
          <button
            @click="closeSuccessModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            OK
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

// Form state
const tenantId = ref(null)
const apartmentId = ref(null)
const amount = ref('')
const paymentDate = ref('')
const status = ref('')
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const tenants = ref([])
const apartments = ref([])

// Payment statuses
const statuses = ref(['confirmed', 'pending', 'failed'])

// Form errors
const errors = ref({})

// Router and Toast
const router = useRouter()
const toast = useToast()

// Fetch tenants and apartments
const fetchTenants = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/tenants')
    tenants.value = response.data.data
    console.log('Fetched tenants:', tenants.value)
  } catch (error) {
    toast.error('Failed to fetch tenants: ' + (error.response?.data?.error || error.message))
    console.error('Error fetching tenants:', error)
  }
}

const fetchApartments = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/apartments?status=occupied')
    apartments.value = response.data.data
    console.log('Fetched apartments:', apartments.value)
  } catch (error) {
    toast.error('Failed to fetch apartments: ' + (error.response?.data?.error || error.message))
    console.error('Error fetching apartments:', error)
  }
}

// Auto-select apartment based on tenant
const updateApartmentId = () => {
  const selectedTenant = tenants.value.find(tenant => tenant.id === tenantId.value)
  if (selectedTenant) {
    apartmentId.value = selectedTenant.apartment_id
  } else {
    apartmentId.value = null
  }
}

// Validation function
const validateForm = () => {
  errors.value = {}
  console.log('Validating form...')

  if (!tenantId.value) errors.value.tenantId = 'Tenant selection is required'
  if (!apartmentId.value) errors.value.apartmentId = 'Apartment selection is required'
  if (!amount.value) {
    errors.value.amount = 'Amount is required'
  } else if (isNaN(amount.value) || amount.value <= 0) {
    errors.value.amount = 'Amount must be a positive number'
  }
  if (!paymentDate.value) {
    errors.value.paymentDate = 'Payment date is required'
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDate.value)) {
    errors.value.paymentDate = 'Invalid date format (use YYYY-MM-DD)'
  }
  if (!status.value) errors.value.status = 'Status is required'

  console.log('Errors:', errors.value)
  if (Object.keys(errors.value).length > 0) {
    toast.error('Please correct the form errors')
  }

  return Object.keys(errors.value).length === 0
}

// Handle form submission
const submitForm = () => {
  console.log('Submit button clicked')
  if (validateForm()) {
    console.log('Validation passed, showing confirm modal')
    showConfirmModal.value = true
  }
}

// Confirm submission with API call
const confirmSubmit = async () => {
  loading.value = true
  try {
    await axios.post('http://localhost:8080/api/v1/payments', {
      tenantId: tenantId.value,
      apartmentId: apartmentId.value,
      amount: parseFloat(amount.value),
      paymentDate: paymentDate.value,
      status: status.value,
    })
    loading.value = false
    showConfirmModal.value = false
    showSuccessModal.value = true
  } catch (error) {
    loading.value = false
    showConfirmModal.value = false
    errorMessage.value = error.response?.data?.error || 'Failed to add payment. Please try again.'
    if (error.response?.data?.details) {
      errorMessage.value += ` (${error.response.data.details})`
    }
    showErrorModal.value = true
    console.error('Submission error:', error)
  }
}

// Close success modal and redirect
const closeSuccessModal = () => {
  showSuccessModal.value = false
  resetForm()
  router.push('/dashboard/payments')
}

// Close error modal
const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

// Reset form
const resetForm = () => {
  tenantId.value = null
  apartmentId.value = null
  amount.value = ''
  paymentDate.value = ''
  status.value = ''
  errors.value = {}
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
      <h1 class="text-3xl font-bold text-gray-900">Add Payment</h1>
      <div class="flex space-x-4">
        <button
          @click="router.push('/dashboard/payments')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
        >
          Back to Payments
        </button>
        <button
          @click="toast.success('Test toast')"
          class="px-4 py-2 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition-all duration-300"
        >
          Test Toast
        </button>
      </div>
    </div>

    <!-- Payment Form -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
      <form @submit.prevent="submitForm" :disabled="loading">
        <!-- Payment Details -->
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
            <select
              v-model="tenantId"
              @change="updateApartmentId"
              class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              :disabled="loading || tenants.length === 0"
            >
              <option value="" disabled>Select a tenant</option>
              <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                {{ tenant.first_name }} {{ tenant.last_name }} ({{ tenant.email }})
              </option>
            </select>
            <p v-if="errors.tenantId" class="text-sm text-red-600 mt-1">{{ errors.tenantId }}</p>
            <p v-if="tenants.length === 0" class="text-sm text-yellow-600 mt-1">No tenants available</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Apartment</label>
            <select
              v-model="apartmentId"
              class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              readonly
              :disabled="loading || apartments.length === 0"
            >
              <option value="" disabled>Select an apartment</option>
              <option v-for="apartment in apartments" :key="apartment.id" :value="apartment.id">
                {{ apartment.house_number }} ({{ apartment.unit_type }}, KSh {{ apartment.rent_amount }})
              </option>
            </select>
            <p v-if="errors.apartmentId" class="text-sm text-red-600 mt-1">{{ errors.apartmentId }}</p>
            <p v-if="apartments.length === 0" class="text-sm text-yellow-600 mt-1">No occupied apartments available</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (KSh)</label>
            <input
              v-model="amount"
              type="number"
              step="0.01"
              class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              required
              :disabled="loading"
            />
            <p v-if="errors.amount" class="text-sm text-red-600 mt-1">{{ errors.amount }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              v-model="paymentDate"
              type="date"
              class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              :disabled="loading"
            />
            <p v-if="errors.paymentDate" class="text-sm text-red-600 mt-1">{{ errors.paymentDate }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="status"
              class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              :disabled="loading"
            >
              <option value="" disabled>Select status</option>
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
            <p v-if="errors.status" class="text-sm text-red-600 mt-1">{{ errors.status }}</p>
          </div>
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
            :disabled="loading || Object.keys(errors).length > 0"
          >
            {{ loading ? 'Submitting...' : 'Add Payment' }}
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
        <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Payment Addition</h2>
        <p class="text-gray-600 mb-4">
          Add payment of KSh {{ amount }} for
          {{ tenants.find(t => t.id === tenantId)?.first_name }}
          {{ tenants.find(t => t.id === tenantId)?.last_name }}
          on {{ paymentDate }}?
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
            @click="confirmSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            :disabled="loading"
          >
            {{ loading ? 'Submitting...' : 'Confirm' }}
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
        <h2 class="text-xl font-bold text-green-600 mb-4">Payment Added Successfully</h2>
        <p class="text-gray-600 mb-4">
          Payment of KSh {{ amount }} for
          {{ tenants.find(t => t.id === tenantId)?.first_name }}
          {{ tenants.find(t => t.id === tenantId)?.last_name }}
          has been added.
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

    <!-- Error Modal -->
    <div
      v-if="showErrorModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-red-600 mb-4">Failed to Add Payment</h2>
        <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
        <div class="flex justify-end">
          <button
            @click="closeErrorModal"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Close
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

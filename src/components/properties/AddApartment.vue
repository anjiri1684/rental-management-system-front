<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

// Form state
const houseNumber = ref('')
const unitType = ref('')
const rentAmount = ref('')
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const loading = ref(false)

// Unit types
const unitTypes = ref([
  'Bedsitter',
  'Single Room',
  'One Bedroom',
  'Two Bedroom',
  'Three Bedroom',
  'Studio',
  'Penthouse'
])

// Form errors
const errors = ref({})

// Router and Toast
const router = useRouter()
const toast = useToast()

// Validation functions
const validateForm = () => {
  errors.value = {}

  if (!houseNumber.value.trim()) errors.value.houseNumber = 'House number is required'
  if (!unitType.value) errors.value.unitType = 'Unit type is required'
  if (!rentAmount.value) {
    errors.value.rentAmount = 'Rent amount is required'
  } else if (isNaN(rentAmount.value) || rentAmount.value <= 0) {
    errors.value.rentAmount = 'Rent amount must be a positive number'
  }

  if (Object.keys(errors.value).length > 0) {
    toast.error('Please correct the form errors')
  }

  return Object.keys(errors.value).length === 0
}

// Handle form submission
const submitForm = () => {
  if (validateForm()) {
    showConfirmModal.value = true
  }
}

// Confirm submission
const confirmSubmit = async () => {
  loading.value = true
  try {
     await axios.post('http://localhost:8080/api/v1/apartments/add', {
      houseNumber: houseNumber.value,
      unitType: unitType.value,
      rentAmount: parseFloat(rentAmount.value),
    })
    loading.value = false
    showConfirmModal.value = false
    showSuccessModal.value = true
  } catch (error) {
    loading.value = false
    showConfirmModal.value = false
    errorMessage.value = error.response?.data?.error || 'Failed to add apartment'
    if (error.response?.data?.details) {
      errorMessage.value += ` (${error.response.data.details})`
    }
    showErrorModal.value = true
    console.error('Submission error:', error)
  }
}

// Close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false
  resetForm()
  router.push('/dashboard/houses')
}

// Close error modal
const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

// Reset form
const resetForm = () => {
  houseNumber.value = ''
  unitType.value = ''
  rentAmount.value = ''
  errors.value = {}
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Add Apartment</h1>
      <div class="flex space-x-4">
        <button
          @click="router.push('/dashboard/houses')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
        >
          Back to Houses
        </button>
      </div>
    </div>

    <!-- Add Apartment Form -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
      <form @submit.prevent="submitForm" :disabled="loading">
        <!-- Apartment Details -->
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Apartment Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">House Number</label>
            <input
              v-model="houseNumber"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., A1, 101"
              required
              :disabled="loading"
            />
            <p v-if="errors.houseNumber" class="text-sm text-red-600 mt-1">{{ errors.houseNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
            <select
              v-model="unitType"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              :disabled="loading"
            >
              <option :value="null" disabled>Select unit type</option>
              <option v-for="type in unitTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <p v-if="errors.unitType" class="text-sm text-red-600 mt-1">{{ errors.unitType }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rent Amount</label>
            <input
              v-model="rentAmount"
              type="number"
              step="0.01"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter rent amount"
              required
              :disabled="loading"
            />
            <p v-if="errors.rentAmount" class="text-sm text-red-600 mt-1">{{ errors.rentAmount }}</p>
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
            {{ loading ? 'Submitting...' : 'Add Apartment' }}
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
        <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Apartment Addition</h2>
        <p class="text-gray-600 mb-4">
          Add {{ unitType }} {{ houseNumber }} with rent {{ rentAmount }}?
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
        <h2 class="text-xl font-bold text-green-600 mb-4">Apartment Added Successfully</h2>
        <p class="text-gray-600 mb-4">
          {{ unitType }} {{ houseNumber }} has been added with rent {{ rentAmount }}.
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
        <h2 class="text-xl font-bold text-red-600 mb-4">Failed to Add Apartment</h2>
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

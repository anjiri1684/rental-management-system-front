<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

// Form state
const apartmentName = ref('') // Added apartmentName ref
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

  if (!apartmentName.value.trim()) errors.value.apartmentName = 'Apartment name is required' // Added validation for apartmentName
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
      apartmentName: apartmentName.value, // Included apartmentName in the payload
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
  router.push('/dashboard')
}

// Close error modal
const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

// Reset form
const resetForm = () => {
  apartmentName.value = '' // Reset apartmentName
  houseNumber.value = ''
  unitType.value = ''
  rentAmount.value = ''
  errors.value = {}
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
    <div class="w-full max-w-4xl flex justify-between items-center mb-8 animate__animated animate__fadeInDown">
      <h1 class="text-4xl font-extrabold text-gray-900">Add New Apartment</h1>
      <button
        @click="router.push('/dashboard/houses')"
        class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl shadow-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      >
        Back to Apartments
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl animate__animated animate__fadeInUp animate__delay-1">
      <form @submit.prevent="submitForm" :disabled="loading">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Apartment Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label for="apartmentName" class="block text-sm font-medium text-gray-700 mb-2">Apartment Name</label>
            <input
              id="apartmentName"
              v-model="apartmentName"
              type="text"
              class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="e.g., Green Valley Apartments"
              :disabled="loading"
            />
            <p v-if="errors.apartmentName" class="text-sm text-red-600 mt-2">{{ errors.apartmentName }}</p>
          </div>
          <div>
            <label for="houseNumber" class="block text-sm font-medium text-gray-700 mb-2">House Number</label>
            <input
              id="houseNumber"
              v-model="houseNumber"
              type="text"
              class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="e.g., A1, 101"
              :disabled="loading"
            />
            <p v-if="errors.houseNumber" class="text-sm text-red-600 mt-2">{{ errors.houseNumber }}</p>
          </div>
          <div>
            <label for="unitType" class="block text-sm font-medium text-gray-700 mb-2">Unit Type</label>
            <select
              id="unitType"
              v-model="unitType"
              class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              :disabled="loading"
            >
              <option :value="null" disabled selected>Select unit type</option>
              <option v-for="type in unitTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <p v-if="errors.unitType" class="text-sm text-red-600 mt-2">{{ errors.unitType }}</p>
          </div>
          <div>
            <label for="rentAmount" class="block text-sm font-medium text-gray-700 mb-2">Rent Amount</label>
            <input
              id="rentAmount"
              v-model="rentAmount"
              type="number"
              step="0.01"
              class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="Enter rent amount"
              :disabled="loading"
            />
            <p v-if="errors.rentAmount" class="text-sm text-red-600 mt-2">{{ errors.rentAmount }}</p>
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            :disabled="loading"
          >
            Clear Form
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="loading || Object.keys(errors).length > 0"
          >
            {{ loading ? 'Submitting...' : 'Add Apartment' }}
          </button>
        </div>
      </form>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate__animated animate__zoomIn">
        <h2 class="text-2xl font-bold text-gray-900 mb-5 text-center">Confirm Apartment Addition</h2>
        <p class="text-gray-700 text-lg text-center mb-6">
          Are you sure you want to add **{{ unitType }} {{ houseNumber }}** in **{{ apartmentName }}** with a rent of **{{ rentAmount }}**?
        </p>
        <div class="flex justify-center space-x-5">
          <button
            @click="showConfirmModal = false"
            class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            @click="confirmSubmit"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Adding...' : 'Confirm Add' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate__animated animate__zoomIn">
        <h2 class="text-2xl font-bold text-green-600 mb-5 text-center">Success!</h2>
        <p class="text-gray-700 text-lg text-center mb-6">
          **{{ unitType }} {{ houseNumber }}** in **{{ apartmentName }}** has been successfully added with a rent of **{{ rentAmount }}**.
        </p>
        <div class="flex justify-center">
          <button
            @click="closeSuccessModal"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showErrorModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate__animated animate__zoomIn">
        <h2 class="text-2xl font-bold text-red-600 mb-5 text-center">Error!</h2>
        <p class="text-gray-700 text-lg text-center mb-6">{{ errorMessage }}</p>
        <div class="flex justify-center">
          <button
            @click="closeErrorModal"
            class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Try Again
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

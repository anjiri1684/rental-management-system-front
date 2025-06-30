<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// Form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const idNumber = ref('')
const position = ref('')
const showConfirmModal = ref(false)
const submissionStatus = ref(null) // For success/error messages
const isSubmitting = ref(false) // For loading state

// Available position options
const positionOptions = [
  { value: 'care_taker', label: 'Care Taker' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'agent', label: 'Agent' },
  { value: 'watchman_guard', label: 'Watchman/Guard' }
]

// Form errors
const errors = ref({})

// Router
const router = useRouter()

const toast = useToast()

// Validation functions
const validateForm = () => {
  errors.value = {}

  if (!firstName.value.trim()) errors.value.firstName = 'First name is required'
  if (!position.value) errors.value.position = 'Position is required'
  if (!lastName.value.trim()) errors.value.lastName = 'Last name is required'
  if (!email.value.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Invalid email format'
  }
  if (!phoneNumber.value.trim()) {
    errors.value.phoneNumber = 'Phone number is required'
  } else if (!/^\+?\d{10,}$/.test(phoneNumber.value.trim())) {
    errors.value.phoneNumber = 'Invalid phone number (e.g., +254123456789)'
  }
  if (!idNumber.value.trim()) {
    errors.value.idNumber = 'ID number is required'
  } else if (!/^\d{6,}$/.test(idNumber.value.trim())) {
    errors.value.idNumber = 'ID number must be at least 6 digits'
  }

  return Object.keys(errors.value).length === 0
}

// Handle form submission
const submitForm = () => {
  if (validateForm()) {
    showConfirmModal.value = true
  }
}

const confirmSubmit = async () => {
  isSubmitting.value = true
  submissionStatus.value = null

  // Prepare JSON payload
  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    phoneNumber: phoneNumber.value,
    idNumber: idNumber.value,
    position: position.value
  }

  try {
    const response = await fetch('http://localhost:8080/api/v1/employees/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Failed to add employee')
    }

    submissionStatus.value = { type: 'success', message: 'Employee added successfully!' }
    toast.success("Employee added successfully!")
    // Reset form
    resetForm()
    showConfirmModal.value = false

    // Redirect to employees list after a short delay to show success message
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    submissionStatus.value = { type: 'error', message: error.message || 'An error occurred while adding the employee' }
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  phoneNumber.value = ''
  idNumber.value = ''
  position.value = ''
  errors.value = {}
  submissionStatus.value = null
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Add Employee</h1>
      <button
        @click="router.push('/dashboard/employees')"
        class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
      >
        Back to Employees
      </button>
    </div>

    <!-- Add Employee Form -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
      <!-- Submission Status Messages -->
      <div v-if="submissionStatus" :class="{
        'mb-4 p-4 rounded-lg': true,
        'bg-green-100 text-green-700': submissionStatus.type === 'success',
        'bg-red-100 text-red-700': submissionStatus.type === 'error'
      }">
        {{ submissionStatus.message }}
      </div>

      <form @submit.prevent="submitForm">
        <!-- Employee Details -->
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Employee Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              v-model="firstName"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter first name"
              required
              :disabled="isSubmitting"
            />
            <p v-if="errors.firstName" class="text-sm text-red-600 mt-1">{{ errors.firstName }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              v-model="lastName"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter last name"
              required
              :disabled="isSubmitting"
            />
            <p v-if="errors.lastName" class="text-sm text-red-600 mt-1">{{ errors.lastName }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email"
              required
              :disabled="isSubmitting"
            />
            <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              v-model="phoneNumber"
              type="tel"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +254123456789"
              required
              :disabled="isSubmitting"
            />
            <p v-if="errors.phoneNumber" class="text-sm text-red-600 mt-1">{{ errors.phoneNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
            <input
              v-model="idNumber"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter ID number"
              required
              :disabled="isSubmitting"
            />
            <p v-if="errors.idNumber" class="text-sm text-red-600 mt-1">{{ errors.idNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              v-model="position"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              :disabled="isSubmitting"
            >
              <option value="" disabled>Select position</option>
              <option v-for="option in positionOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p v-if="errors.position" class="text-sm text-red-600 mt-1">{{ errors.position }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
            :disabled="isSubmitting"
          >
            Clear
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            :disabled="Object.keys(errors).length > 0 || isSubmitting"
          >
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Add Employee</span>
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
        <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Employee Addition</h2>
        <p class="text-gray-600 mb-4">
          Add {{ firstName }} {{ lastName }} as an employee?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showConfirmModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            @click="confirmSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Confirm</span>
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

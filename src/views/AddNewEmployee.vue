<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const idNumber = ref('')
const idFrontImage = ref(null)
const idBackImage = ref(null)
const selfiePhoto = ref(null)
const showConfirmModal = ref(false)

// Form errors
const errors = ref({})

// Router
const router = useRouter()

// Validation functions
const validateForm = () => {
  errors.value = {}

  if (!firstName.value.trim()) errors.value.firstName = 'First name is required'
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
  if (!idFrontImage.value) errors.value.idFrontImage = 'ID front image is required'
  if (!idBackImage.value) errors.value.idBackImage = 'ID back image is required'
  if (!selfiePhoto.value) errors.value.selfiePhoto = 'Selfie photo is required'

  return Object.keys(errors.value).length === 0
}

// Handle file uploads
const handleFileUpload = (event, type) => {
  const file = event.target.files[0]
  if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
    if (type === 'front') {
      idFrontImage.value = file
    } else if (type === 'back') {
      idBackImage.value = file
    } else if (type === 'selfie') {
      selfiePhoto.value = file
    }
    errors.value[type === 'front' ? 'idFrontImage' : type === 'back' ? 'idBackImage' : 'selfiePhoto'] = ''
  } else {
    errors.value[type === 'front' ? 'idFrontImage' : type === 'back' ? 'idBackImage' : 'selfiePhoto'] = 'Please upload a valid JPEG or PNG image'
  }
}

// Handle form submission
const submitForm = () => {
  if (validateForm()) {
    showConfirmModal.value = true
  }
}

const confirmSubmit = () => {
  // Placeholder for submission logic
  const formData = new FormData()
  formData.append('firstName', firstName.value)
  formData.append('lastName', lastName.value)
  formData.append('email', email.value)
  formData.append('phoneNumber', phoneNumber.value)
  formData.append('idNumber', idNumber.value)
  formData.append('idFrontImage', idFrontImage.value)
  formData.append('idBackImage', idBackImage.value)
  formData.append('selfiePhoto', selfiePhoto.value)

  console.log('Form Data:', Object.fromEntries(formData))

  // Reset form
  resetForm()
  showConfirmModal.value = false

  // Redirect to employees list
  router.push('/dashboard/employees')
}

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  phoneNumber.value = ''
  idNumber.value = ''
  idFrontImage.value = null
  idBackImage.value = null
  selfiePhoto.value = null
  errors.value = {}
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
            />
            <p v-if="errors.idNumber" class="text-sm text-red-600 mt-1">{{ errors.idNumber }}</p>
          </div>
        </div>

        <!-- ID and Selfie Images -->
        <h2 class="text-xl font-semibold text-gray-900 mb-4">ID and Selfie Images</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Front Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              @change="handleFileUpload($event, 'front')"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p v-if="errors.idFrontImage" class="text-sm text-red-600 mt-1">{{ errors.idFrontImage }}</p>
            <p v-if="idFrontImage" class="text-sm text-gray-600 mt-1">{{ idFrontImage.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Back Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              @change="handleFileUpload($event, 'back')"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p v-if="errors.idBackImage" class="text-sm text-red-600 mt-1">{{ errors.idBackImage }}</p>
            <p v-if="idBackImage" class="text-sm text-gray-600 mt-1">{{ idBackImage.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Selfie Photo</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              @change="handleFileUpload($event, 'selfie')"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p v-if="errors.selfiePhoto" class="text-sm text-red-600 mt-1">{{ errors.selfiePhoto }}</p>
            <p v-if="selfiePhoto" class="text-sm text-gray-600 mt-1">{{ selfiePhoto.name }}</p>
          </div>
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
            :disabled="Object.keys(errors).length > 0"
          >
            Add Employee
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
          >
            Cancel
          </button>
          <button
            @click="confirmSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirm
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

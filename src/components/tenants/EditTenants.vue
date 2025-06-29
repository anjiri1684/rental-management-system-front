<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

// Form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const idNumber = ref('')
const houseNumber = ref('')
const unitType = ref('')
const apartmentId = ref(0) // Added for ApartmentID
const nextOfKinFirstName = ref('')
const nextOfKinLastName = ref('')
const nextOfKinPhone = ref('')
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const apartments = ref([]) // To store available apartments


// Form errors
const errors = ref({})

// Router and Toast
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Fetch tenant data
const fetchTenant = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/tenants/${route.params.id}`)
    const tenant = response.data.data
    firstName.value = tenant.first_name
    lastName.value = tenant.last_name
    email.value = tenant.email
    phoneNumber.value = tenant.phone_number
    idNumber.value = tenant.id_number
    houseNumber.value = tenant.house_number
    unitType.value = tenant.unit_type
    apartmentId.value = tenant.apartment_id
    nextOfKinFirstName.value = tenant.next_of_kin_first_name
    nextOfKinLastName.value = tenant.next_of_kin_last_name
    nextOfKinPhone.value = tenant.next_of_kin_phone
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Failed to fetch tenant'
    if (err.response?.data?.details) {
      errorMessage.value += ` (${err.response.data.details})`
    }
    showErrorModal.value = true
    console.error('Fetch tenant error:', err)
  } finally {
    loading.value = false
  }
}

// Fetch available apartments (vacant or current tenant's apartment)
const fetchApartments = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/apartments', {
      params: { status: 'vacant' },
    })
    apartments.value = response.data.data
    // Include current tenant's apartment if not vacant
    if (apartmentId.value) {
      const tenantApartmentResponse = await axios.get(`http://localhost:8080/api/v1/apartments/${apartmentId.value}`)
      const tenantApartment = tenantApartmentResponse.data.data
      if (!apartments.value.some(a => a.id === tenantApartment.id)) {
        apartments.value.push(tenantApartment)
      }
    }
  } catch (err) {
    toast.error('Failed to fetch apartments')
    console.error('Fetch apartments error:', err)
  }
}

// Update houseNumber and unitType when apartmentId changes
const updateApartmentDetails = () => {
  const selectedApartment = apartments.value.find(a => a.id === apartmentId.value)
  if (selectedApartment) {
    houseNumber.value = selectedApartment.house_number
    unitType.value = selectedApartment.unit_type
  } else {
    houseNumber.value = ''
    unitType.value = ''
  }
}

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
  if (!apartmentId.value) errors.value.apartmentId = 'Apartment is required'
  if (!nextOfKinFirstName.value.trim()) errors.value.nextOfKinFirstName = 'Next of kin first name is required'
  if (!nextOfKinLastName.value.trim()) errors.value.nextOfKinLastName = 'Next of kin last name is required'
  if (!nextOfKinPhone.value.trim()) {
    errors.value.nextOfKinPhone = 'Next of kin phone number is required'
  } else if (!/^\+?\d{10,}$/.test(nextOfKinPhone.value.trim())) {
    errors.value.nextOfKinPhone = 'Invalid phone number (e.g., +254123456789)'
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

// Confirm submission with API call
const confirmSubmit = async () => {
  loading.value = true
  try {
    await axios.patch(`http://localhost:8080/api/v1/tenants/${route.params.id}`, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      idNumber: idNumber.value,
      houseNumber: houseNumber.value,
      unitType: unitType.value,
      apartmentId: apartmentId.value,
      nextOfKinFirstName: nextOfKinFirstName.value,
      nextOfKinLastName: nextOfKinLastName.value,
      nextOfKinPhone: nextOfKinPhone.value,
    })
    loading.value = false
    showConfirmModal.value = false
    showSuccessModal.value = true
  } catch (error) {
    loading.value = false
    showConfirmModal.value = false
    errorMessage.value = error.response?.data?.error || 'Failed to update tenant'
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
  router.push('/dashboard/view-tenants')
}

// Close error modal
const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

// Reset form
const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  phoneNumber.value = ''
  idNumber.value = ''
  houseNumber.value = ''
  unitType.value = ''
  apartmentId.value = 0
  nextOfKinFirstName.value = ''
  nextOfKinLastName.value = ''
  nextOfKinPhone.value = ''
  errors.value = {}
}

// Fetch tenant and apartments on mount
onMounted(() => {
  fetchApartments()
  fetchTenant()
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Edit Tenant</h1>
      <div class="flex space-x-4">
        <button
          @click="router.push('/dashboard/view-tenants')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
        >
          Back to Tenants
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-600">
      Loading tenant data...
    </div>

    <!-- Edit Tenant Form -->
    <div v-else class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
      <form @submit.prevent="submitForm" :disabled="loading">
        <!-- Tenant Details -->
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Tenant Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              v-model="firstName"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter first name"
              required
              :disabled="loading"
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
              :disabled="loading"
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
              :disabled="loading"
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
              :disabled="loading"
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
              :disabled="loading"
            />
            <p v-if="errors.idNumber" class="text-sm text-red-600 mt-1">{{ errors.idNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Apartment</label>
            <select
              v-model="apartmentId"
              @change="updateApartmentDetails"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              :disabled="loading"
            >
              <option :value="0" disabled>Select apartment</option>
              <option v-for="apartment in apartments" :key="apartment.id" :value="apartment.id">
                {{ apartment.house_number }} ({{ apartment.unit_type }})
              </option>
            </select>
            <p v-if="errors.apartmentId" class="text-sm text-red-600 mt-1">{{ errors.apartmentId }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">House Number</label>
            <input
              v-model="houseNumber"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm bg-gray-100"
              readonly
            />
            <p v-if="errors.houseNumber" class="text-sm text-red-600 mt-1">{{ errors.houseNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
            <input
              v-model="unitType"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm bg-gray-100"
              readonly
            />
            <p v-if="errors.unitType" class="text-sm text-red-600 mt-1">{{ errors.unitType }}</p>
          </div>
        </div>

        <!-- Next of Kin Details -->
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Next of Kin Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Next of Kin First Name</label>
            <input
              v-model="nextOfKinFirstName"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter first name"
              required
              :disabled="loading"
            />
            <p v-if="errors.nextOfKinFirstName" class="text-sm text-red-600 mt-1">{{ errors.nextOfKinFirstName }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Next of Kin Last Name</label>
            <input
              v-model="nextOfKinLastName"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter last name"
              required
              :disabled="loading"
            />
            <p v-if="errors.nextOfKinLastName" class="text-sm text-red-600 mt-1">{{ errors.nextOfKinLastName }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Next of Kin Phone Number</label>
            <input
              v-model="nextOfKinPhone"
              type="tel"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +254123456789"
              required
              :disabled="loading"
            />
            <p v-if="errors.nextOfKinPhone" class="text-sm text-red-600 mt-1">{{ errors.nextOfKinPhone }}</p>
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
            {{ loading ? 'Submitting...' : 'Update Tenant' }}
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
        <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Tenant Update</h2>
        <p class="text-gray-600 mb-4">
          Update {{ firstName }} {{ lastName }} in {{ unitType }} {{ houseNumber }}?
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
        <h2 class="text-xl font-bold text-green-600 mb-4">Tenant Updated Successfully</h2>
        <p class="text-gray-600 mb-4">
          {{ firstName }} {{ lastName }} has been updated in {{ unitType }} {{ houseNumber }}.
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
        <h2 class="text-xl font-bold text-red-600 mb-4">Failed to Update Tenant</h2>
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phoneNumber = ref('')
const idNumber = ref('')
const houseNumber = ref('')
const unitType = ref('')
const idFrontImage = ref(null)
const idBackImage = ref(null)
const nextOfKinFirstName = ref('')
const nextOfKinLastName = ref('')
const nextOfKinPhone = ref('')
const showConfirmModal = ref(false)

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

// Router and Route
const router = useRouter()
const route = useRoute()

const fetchTenant = async () => {
  // Dummy data for demonstration
  const dummyTenants = {
    1: {
      id: 1,
      firstName: 'John',
      lastName: 'Kamau',
      email: 'john.kamau@example.com',
      phoneNumber: '+254123456789',
      idNumber: '12345678',
      houseNumber: 'A1',
      unitType: 'One Bedroom',
      nextOfKinFirstName: 'Jane',
      nextOfKinLastName: 'Doe',
      nextOfKinPhone: '+254987654321',
    },
    2: {
      id: 2,
      firstName: 'Mary',
      lastName: 'Wanjiku',
      email: 'mary.wanjiku@example.com',
      phoneNumber: '+254234567890',
      idNumber: '87654321',
      houseNumber: 'B2',
      unitType: 'Bedsitter',
      nextOfKinFirstName: 'Peter',
      nextOfKinLastName: 'Omondi',
      nextOfKinPhone: '+254876543210',
    },
  }

  const tenantId = route.params.id
  const tenant = dummyTenants[tenantId]
  if (tenant) {
    firstName.value = tenant.firstName
    lastName.value = tenant.lastName
    email.value = tenant.email
    phoneNumber.value = tenant.phoneNumber
    idNumber.value = tenant.idNumber
    houseNumber.value = tenant.houseNumber
    unitType.value = tenant.unitType
    nextOfKinFirstName.value = tenant.nextOfKinFirstName
    nextOfKinLastName.value = tenant.nextOfKinLastName
    nextOfKinPhone.value = tenant.nextOfKinPhone
  } else {
    // Handle tenant not found
    router.push('/dashboard/view-tenants')
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
  if (!houseNumber.value.trim()) errors.value.houseNumber = 'House number is required'
  if (!unitType.value) errors.value.unitType = 'Unit type is required'
  if (!nextOfKinFirstName.value.trim()) errors.value.nextOfKinFirstName = 'Next of kin first name is required'
  if (!nextOfKinLastName.value.trim()) errors.value.nextOfKinLastName = 'Next of kin last name is required'
  if (!nextOfKinPhone.value.trim()) {
    errors.value.nextOfKinPhone = 'Next of kin phone number is required'
  } else if (!/^\+?\d{10,}$/.test(nextOfKinPhone.value.trim())) {
    errors.value.nextOfKinPhone = 'Invalid phone number (e.g., +254123456789)'
  }

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
    }
    errors.value[type === 'front' ? 'idFrontImage' : 'idBackImage'] = ''
  } else {
    errors.value[type === 'front' ? 'idFrontImage' : 'idBackImage'] = 'Please upload a valid JPEG or PNG image'
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
  formData.append('id', route.params.id)
  formData.append('firstName', firstName.value)
  formData.append('lastName', lastName.value)
  formData.append('email', email.value)
  formData.append('phoneNumber', phoneNumber.value)
  formData.append('idNumber', idNumber.value)
  formData.append('houseNumber', houseNumber.value)
  formData.append('unitType', unitType.value)
  formData.append('nextOfKinFirstName', nextOfKinFirstName.value)
  formData.append('nextOfKinLastName', nextOfKinLastName.value)
  formData.append('nextOfKinPhone', nextOfKinPhone.value)
  if (idFrontImage.value) formData.append('idFrontImage', idFrontImage.value)
  if (idBackImage.value) formData.append('idBackImage', idBackImage.value)

  console.log('Form Data:', Object.fromEntries(formData))

  // Reset form
  resetForm()
  showConfirmModal.value = false

  // Redirect to tenants list
  router.push('/dashboard/tenants')
}

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
  phoneNumber.value = ''
  idNumber.value = ''
  houseNumber.value = ''
  unitType.value = ''
  idFrontImage.value = null
  idBackImage.value = null
  nextOfKinFirstName.value = ''
  nextOfKinLastName.value = ''
  nextOfKinPhone.value = ''
  errors.value = {}
}

// Fetch tenant data on mount
onMounted(fetchTenant)
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

    <!-- Edit Tenant Form -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
      <form @submit.prevent="submitForm">
        <!-- Tenant Details -->
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Tenant Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              v-model="firstName"
              type="text"
              class="w-full border-gray-300 py-2.5 p-2 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">House Number</label>
            <input
              v-model="houseNumber"
              type="text"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., A1, 101"
              required
            />
            <p v-if="errors.houseNumber" class="text-sm text-red-600 mt-1">{{ errors.houseNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
            <select
              v-model="unitType"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option :value="null" disabled>Select unit type</option>
              <option v-for="type in unitTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <p v-if="errors.unitType" class="text-sm text-red-600 mt-1">{{ errors.unitType }}</p>
          </div>
        </div>

        <!-- ID Images -->
        <h2 class="text-xl font-semibold text-gray-900 mb-4">ID Images</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Front Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              @change="handleFileUpload($event, 'front')"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p v-if="errors.idFrontImage" class="text-sm text-red-600 mt-1">{{ errors.idFrontImage }}</p>
            <p v-if="idFrontImage" class="text-sm text-gray-600 mt-1">{{ idFrontImage.name }}</p>
            <p v-else class="text-sm text-gray-600 mt-1">No new front image selected</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Back Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              @change="handleFileUpload($event, 'back')"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p v-if="errors.idBackImage" class="text-sm text-red-600 mt-1">{{ errors.idBackImage }}</p>
            <p v-if="idBackImage" class="text-sm text-gray-600 mt-1">{{ idBackImage.name }}</p>
            <p v-else class="text-sm text-gray-600 mt-1">No new back image selected</p>
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
          >
            Clear
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            :disabled="Object.keys(errors).length > 0"
          >
            Update Tenant
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

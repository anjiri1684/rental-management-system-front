<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import apiClient from '../../services/apiClient' // Import the API client
import { useToast } from 'vue-toastification'
import { ArrowLeft, CheckCircle, Info, Home, User, Loader2 } from 'lucide-vue-next' // Added Info, Home, User, Loader2 for icons

const router = useRouter()
const route = useRoute()
const toast = useToast()

const tenant = ref(null)
const apartments = ref([])
const selectedApartmentId = ref('')
const loading = ref(false)
const error = ref(null)

// Fetch tenant details
const fetchTenant = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiClient.get(`/tenants/${route.params.id}`)
    tenant.value = {
      id: response.data.data.id,
      firstName: response.data.data.first_name,
      lastName: response.data.data.last_name,
      houseNumber: response.data.data.house_number || 'N/A',
      unitType: response.data.data.unit_type || 'N/A',
      isActive: response.data.data.is_active,
    }
    console.log('Tenant:', tenant.value)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch tenant'
    console.error('Fetch tenant error:', err)
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Fetch available apartments
const fetchApartments = async () => {
  try {
    const response = await apiClient.get('/apartments?status=vacant')
    apartments.value = response.data.data || []
    console.log('Vacant Apartments:', apartments.value)
    if (apartments.value.length === 0) {
      toast.warning('No vacant apartments available.')
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch apartments'
    console.error('Error fetching apartments:', err)
    toast.error(error.value)
  }
}

// Allocate house
const allocateHouse = async () => {
  if (!selectedApartmentId.value) {
    toast.error('Please select an apartment to allocate.')
    return
  }
  const selectedApartment = apartments.value.find(a => a.id === selectedApartmentId.value)
  if (!selectedApartment) {
    toast.error('Invalid apartment selected. Please try again.')
    return
  }
  try {
    await apiClient.patch(`/tenants/${tenant.value.id}/allocate-house`, {
      apartmentId: selectedApartment.id,
      houseNumber: selectedApartment.house_number,
      unitType: selectedApartment.unit_type,
    })
    toast.success('House allocated successfully!')
    router.push('/dashboard/tenants')
  } catch (err) {
    const errorMsg = err.response?.data?.error || 'Failed to allocate house. Please try again.'
    console.error('Allocate house error:', err)
    toast.error(errorMsg)
  }
}

onMounted(() => {
  fetchTenant()
  fetchApartments()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Allocate House</h1>
      <button @click="router.push('/dashboard/tenants')"
        class="px-5 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-base font-medium flex items-center gap-2">
        <ArrowLeft class="w-5 h-5" /> Back to Tenants
      </button>
    </div>

    <div v-if="error"
      class="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-start gap-3 border border-red-200 shadow-sm animate__animated animate__fadeIn">
      <Info class="w-6 h-6 text-red-600 flex-shrink-0" />
      <div>
        <p class="font-bold text-lg">Error:</p>
        <p class="text-md">{{ error }}</p>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-lg p-6">
      <Loader2 class="w-16 h-16 text-blue-600 animate-spin-slow mb-4" />
      <p class="text-lg text-gray-700 font-medium">Loading tenant details and available apartments...</p>
    </div>

    <div v-else-if="tenant" class="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 animate__animated animate__fadeInUp">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b pb-4 border-gray-200">
        Allocate House to <span class="text-blue-700">{{ tenant.firstName }} {{ tenant.lastName }}</span>
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <User class="w-6 h-6 text-gray-600" />
          <div>
            <p class="text-sm font-medium text-gray-500">Tenant Name</p>
            <p class="text-lg font-semibold text-gray-800">{{ tenant.firstName }} {{ tenant.lastName }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Home class="w-6 h-6 text-gray-600" />
          <div>
            <p class="text-sm font-medium text-gray-500">Current House</p>
            <p class="text-lg font-semibold text-gray-800">{{ tenant.houseNumber }} ({{ tenant.unitType }})</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <Info class="w-6 h-6 text-gray-600" />
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p class="text-lg font-semibold" :class="{ 'text-green-600': tenant.isActive, 'text-red-600': !tenant.isActive }">
              {{ tenant.isActive ? 'Active' : 'Inactive' }}
            </p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <label for="apartment" class="block text-base font-semibold text-gray-800 mb-3">Select New Apartment</label>
        <div class="relative">
          <select
            v-model="selectedApartmentId"
            id="apartment"
            class="w-full md:max-w-md appearance-none border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base cursor-pointer transition-all duration-200"
            :disabled="apartments.length === 0"
          >
            <option value="" disabled selected>Choose an apartment...</option>
            <option v-for="apartment in apartments" :key="apartment.id" :value="apartment.id">
              {{ apartment.house_number }} ({{ apartment.unit_type }})
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <p v-if="apartments.length === 0" class="text-red-600 text-sm mt-3 flex items-center gap-2">
          <Info class="w-4 h-4" /> No vacant apartments available at this time.
        </p>
      </div>

      <button
        @click="allocateHouse"
        class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-lg font-semibold flex items-center justify-center gap-2"
        :disabled="!selectedApartmentId || apartments.length === 0"
      >
        <CheckCircle class="w-5 h-5" /> Allocate House
      </button>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';

/* Custom spin animation for loader */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
</style>

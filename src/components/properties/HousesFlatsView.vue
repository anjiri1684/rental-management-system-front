<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../../services/apiClient' // Import the API client
import { useToast } from 'vue-toastification'

// State for apartment summaries
const apartmentSummaries = ref([]) // Renamed from 'apartments'
const loading = ref(false)
const error = ref(null)

// Router and Toast
const router = useRouter()
const toast = useToast()

// Fetch apartment summaries
const fetchApartmentSummaries = async () => { // Renamed function
  loading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/apartments/summary') // Changed endpoint
    apartmentSummaries.value = response.data.data // Data structure is now directly the array of summaries
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch apartment summaries'
    toast.error(error.value)
    console.error('Fetch apartment summaries error:', err)
  } finally {
    loading.value = false
  }
}

// Navigate to add apartment page
const addApartment = () => {
  router.push('/dashboard/houses/add')
}

// Initial fetch
onMounted(() => {
  fetchApartmentSummaries()
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Apartment Building Overview</h1>
      <button
        @click="addApartment"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        Add New Houses (Batch)
      </button>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center text-gray-600">
      Loading apartment summaries...
    </div>

    <div v-else class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden animate__animated animate__fadeInUp">
      <h2 class="text-xl font-semibold text-gray-900 p-4">
        Apartment Buildings ({{ apartmentSummaries.length }})
      </h2>
      <div v-if="apartmentSummaries.length" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Houses</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacant Houses</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupied Houses</th>
              </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="summary in apartmentSummaries" :key="summary.apartment_name">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{{ summary.apartment_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ summary.total_houses }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{{ summary.vacant_houses }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{{ summary.occupied_houses }}</td>
              </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-6 text-center text-gray-500">
        No apartment buildings found.
      </div>
    </div>

    </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

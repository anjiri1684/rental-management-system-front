<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

// State for apartments and pagination
const apartments = ref([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
})
const loading = ref(false)
const error = ref(null)

// Router and Toast
const router = useRouter()
const toast = useToast()

// Fetch apartments
const fetchApartments = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('http://localhost:8080/api/v1/apartments', {
      params: {
        page,
        limit: pagination.value.limit,
      },
    })
    apartments.value = response.data.data
    pagination.value = response.data.meta
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch apartments'
    toast.error(error.value)
    console.error('Fetch apartments error:', err)
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    pagination.value.page = newPage
    fetchApartments(newPage)
  }
}

// Navigate to add apartment page
const addApartment = () => {
  router.push('/dashboard/houses/add')
}

// Initial fetch
onMounted(() => {
  fetchApartments()
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Houses</h1>
      <button
        @click="addApartment"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        Add Apartment
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-600">
      Loading apartments...
    </div>

    <!-- Apartments Table -->
    <div v-else class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden animate__animated animate__fadeInUp">
      <h2 class="text-xl font-semibold text-gray-900 p-4">
        Apartments ({{ pagination.total }})
      </h2>
      <div v-if="apartments.length" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="apartment in apartments" :key="apartment.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ apartment.house_number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ apartment.unit_type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ apartment.rent_amount }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ apartment.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-6 text-center text-gray-500">
        No apartments found.
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} apartments
      </div>
      <div class="space-x-2">
        <button
          :disabled="pagination.page === 1 || loading"
          @click="changePage(pagination.page - 1)"
          class="px-3 py-1 bg-gray-200 rounded-lg"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 1 || loading }"
        >
          Previous
        </button>
        <button
          :disabled="pagination.page === pagination.totalPages || loading"
          @click="changePage(pagination.page + 1)"
          class="px-3 py-1 bg-gray-200 rounded-lg"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.page === pagination.totalPages || loading }"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

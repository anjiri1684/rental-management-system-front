<template>
  <div class="p-8 md:p-12 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center py-12">
    <div v-if="employee" class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full transform transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-3xl-blue relative overflow-hidden">

      <div class="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-blue-50 to-blue-100 opacity-60 rounded-t-3xl"></div>

      <header class="relative z-10 mb-10 text-center">
        <h1 class="text-5xl font-extrabold text-gray-900 leading-tight mb-3">Employee Profile</h1>
        <p class="text-xl text-gray-600 font-light">Detailed information for <span class="font-medium text-blue-700">{{ employee.first_name }} {{ employee.last_name }}</span></p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12 relative z-10">

        <div class="bg-gray-50 p-6 rounded-2xl shadow-inner-custom hover:shadow-md transition-shadow duration-200">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Personal Details</h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Full Name</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ employee.first_name }} {{ employee.last_name }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Position</p>
              <p class="text-lg text-gray-800 mt-1">{{ employee.position ? employee.position.toUpperCase() : 'N/A' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-6 rounded-2xl shadow-inner-custom hover:shadow-md transition-shadow duration-200">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Contact Information</h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Email Address</p>
              <a :href="`mailto:${employee.email}`" class="text-lg text-blue-600 hover:text-blue-700 font-medium transition-colors mt-1 block group">
                {{ employee.email || 'N/A' }}
                <span class="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Phone Number</p>
              <p class="text-lg text-gray-800 mt-1">{{ employee.phone_number || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <div class="md:col-span-2 bg-gray-50 p-6 rounded-2xl shadow-inner-custom hover:shadow-md transition-shadow duration-200">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Employment & Other Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-500">Status</p>
              <span :class="employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-base font-semibold mt-1 animate-pulse-fade">
                <span :class="employee.is_active ? 'bg-green-500' : 'bg-red-500'" class="w-2.5 h-2.5 rounded-full mr-2 shadow-sm"></span>
                {{ employee.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div v-if="employee.hire_date">
              <p class="text-sm font-medium text-gray-500">Hire Date</p>
              <p class="text-lg text-gray-800 mt-1">{{ new Date(employee.hire_date).toLocaleDateString() }}</p>
            </div>
            <div v-if="employee.id_number">
              <p class="text-sm font-medium text-gray-500">ID Number</p>
              <p class="text-lg text-gray-800 mt-1">{{ employee.id_number }}</p>
            </div>
            <div v-if="employee.address" class="md:col-span-3">
              <p class="text-sm font-medium text-gray-500">Address</p>
              <p class="text-lg text-gray-800 mt-1">{{ employee.address }}</p>
            </div>
          </div>
        </div>

      </section>

      <div class="pt-8 border-t border-gray-100 flex justify-end relative z-10">
        <button
          @click="router.back()"
          class="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 ease-out
                 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Employees
        </button>
      </div>
    </div>

    <div v-else-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 rounded-full border-4 border-blue-200"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin-slow"></div>
      </div>
      <p class="text-xl text-gray-600 mt-6 font-medium">Loading employee data...</p>
    </div>

    <div v-else-if="error" class="p-8 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start shadow-md max-w-xl w-full animate__animated animate__fadeInUp">
      <svg class="w-7 h-7 flex-shrink-0 mr-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.174 3.35 1.9 3.35h13.713c1.726 0 2.766-1.85 1.9-3.35L13.723 5.626a1.994 1.994 0 00-3.446 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <div>
        <h3 class="font-bold text-xl mb-2">Error Loading Data!</h3>
        <p class="text-base">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiClient from '../../services/apiClient'
const employee = ref(null)
const loading = ref(true)
const error = ref(null)

const route = useRoute()
const router = useRouter()
const toast = useToast()

const fetchEmployeeDetails = async () => {
  loading.value = true
  error.value = null
  try {
    const employeeId = route.params.id
    const response = await apiClient.get(`/employees/${employeeId}`)
    employee.value = response.data.data
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch employee details.'
    console.error('Fetch employee details error:', err)
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEmployeeDetails()
})
</script>

<style scoped>
/* Custom animations for a modern feel */
@keyframes pulse-fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse-fade {
  animation: pulse-fade 2s infinite ease-in-out;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 1.5s linear infinite;
}

/* Custom shadow for a more "inner" look */
.shadow-inner-custom {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05); /* Tailwind's shadow-sm for inner */
}

/* Custom shadow for a modern "lift" effect */
.hover\\:shadow-3xl-blue {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25), /* Blue shadow */
              0 10px 15px -3px rgba(0, 0, 0, 0.1); /* Standard shadow */
}
</style>

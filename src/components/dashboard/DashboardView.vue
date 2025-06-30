<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

// Data state
const totalTenants = ref(0)
const activeTenants = ref(0)
const accountBalance = ref(0)
const recentMessages = ref(0)
const pendingTasks = ref(0)
const activities = ref([]) 
const adminName = ref('Vincent Anjiri')
const loading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const totalPages = ref(1)
const pageSizeOptions = [5, 10, 20]

// Time and date
const currentTime = ref('')
const currentDate = ref('')
const greeting = ref('')

const router = useRouter()
const toast = useToast()

// Computed properties
const activityCount = computed(() => activities.value?.length || 0)
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return (activities.value || []).slice(start, end)
})

// Generate page numbers for pagination
const pageNumbers = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  const startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2))
  const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1)
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

// Fetch dashboard data
const fetchDashboardData = async (page = 1) => {
  loading.value = true
  errorMessage.value = ''
  try {
    // Fetch tenant stats
    const tenantStats = await axios.get('http://localhost:8080/api/v1/tenants/stats')
    totalTenants.value = tenantStats.data?.totalTenants || 0
    activeTenants.value = tenantStats.data?.activeTenants || 0

    // Fetch account balance
    const balance = await axios.get('http://localhost:8080/api/v1/account/balance')
    accountBalance.value = balance.data?.accountBalance || 0

    // Fetch recent messages
    const messageStats = await axios.get('http://localhost:8080/api/v1/messages/stats')
    recentMessages.value = messageStats.data?.recentMessages || 0

    // Fetch pending tasks
    const tasks = await axios.get('http://localhost:8080/api/v1/tasks/pending')
    pendingTasks.value = tasks.data?.pendingTasks || 0

    // Fetch activities
    console.log('Fetching activities with params:', { page, limit: itemsPerPage.value })
    const activitiesResponse = await axios.get('http://localhost:8080/api/v1/activities', {
      params: { page, limit: itemsPerPage.value }
    })
    console.log('Activities response:', activitiesResponse.data)
    activities.value = activitiesResponse.data?.data || []
    totalPages.value = activitiesResponse.data?.meta?.totalPages || 1
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to fetch dashboard data'
    toast.error(errorMessage.value)
    activities.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// Navigation and pagination
const navigateTo = (path) => {
  router.push(path)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    fetchDashboardData(page)
  }
}

const updateItemsPerPage = () => {
  if (itemsPerPage.value > 0) {
    currentPage.value = 1
    fetchDashboardData(1)
  }
}

// Time and greeting functions
const updateGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) {
    greeting.value = 'Good Morning'
  } else if (hour < 18) {
    greeting.value = 'Good Afternoon'
  } else {
    greeting.value = 'Good Evening'
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const dismissError = () => {
  errorMessage.value = ''
}

let timeInterval
onMounted(() => {
  updateGreeting()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  fetchDashboardData(currentPage.value)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto bg-white min-h-screen">
    <!-- Header -->
    <header class="mb-8 animate__animated animate__fadeIn">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">{{ greeting }}, {{ adminName }}!</h1>
            <p class="text-sm text-gray-500">{{ currentDate }} | {{ currentTime }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            @click="navigateTo('/dashboard/tenants/add')"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Tenant
          </button>
          <button
            @click="navigateTo('/dashboard/messages')"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Message
          </button>
          <button
            @click="navigateTo('/dashboard/messages')"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Message History
          </button>
        </div>
      </div>
    </header>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 text-red-600 rounded-md flex items-center animate__animated animate__fadeIn">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ errorMessage }}</span>
      <button @click="dismissError" class="ml-auto text-red-600 hover:text-red-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center mb-6">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>

    <!-- Summary Cards -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center animate__animated animate__fadeIn">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Overview
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate__animated animate__fadeIn">
          <div class="flex items-center space-x-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a2 2 0 00-2-2h-3m-8 0H4a2 2 0 00-2 2v2h5m5-16a4 4 0 100 8 4 4 0 000-8zM12 12a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-gray-600">Total Tenants</h3>
              <p class="text-xl font-bold text-blue-600">{{ totalTenants }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate__animated animate__fadeIn animate__delay-1s">
          <div class="flex items-center space-x-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-gray-600">Active Tenants</h3>
              <p class="text-xl font-bold text-green-600">{{ activeTenants }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate__animated animate__fadeIn animate__delay-2s">
          <div class="flex items-center space-x-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-gray-600">Account Balance</h3>
              <p class="text-xl font-bold text-blue-600">KES {{ accountBalance.toLocaleString() }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate__animated animate__fadeIn animate__delay-3s">
          <div class="flex items-center space-x-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4a2 2 0 012-2h10a2 2 0 012 2v4h-4m-6 0h6" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-gray-600">Recent Messages</h3>
              <p class="text-xl font-bold text-blue-600">{{ recentMessages }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow animate__animated animate__fadeIn animate__delay-4s">
          <div class="flex items-center space-x-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-gray-600">Pending Tasks</h3>
              <p class="text-xl font-bold text-red-600">{{ pendingTasks }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center animate__animated animate__fadeIn">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Actions
      </h2>
      <div class="flex flex-wrap gap-3">
        <button
          @click="navigateTo('/dashboard/tenants')"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          View Tenants
        </button>
        <button
          @click="navigateTo('/dashboard/reports')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View Reports
        </button>
        <button
          @click="navigateTo('/dashboard/employees')"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a2 2 0 00-2-2h-3m-8 0H4a2 2 0 00-2 2v2h5m5-16a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          Manage Employees
        </button>
      </div>
    </section>

    <!-- Recent Activity -->
    <section class="bg-white rounded-lg shadow-sm border border-gray-200 animate__animated animate__fadeIn">
      <div class="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Activity ({{ activityCount }})
        </h2>
        <div class="flex items-center space-x-2">
          <label for="itemsPerPage" class="text-sm text-gray-600">Show:</label>
          <select
            id="itemsPerPage"
            v-model="itemsPerPage"
            @change="updateItemsPerPage"
            class="border-gray-300 rounded-md p-1 text-sm focus:ring-blue-600 focus:border-blue-600"
            :disabled="loading"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="activity in paginatedActivities" :key="activity.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-2 text-sm text-gray-600">{{ new Date(activity.date).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) }}</td>
              <td class="px-4 py-2 text-sm text-gray-600 truncate max-w-xs" :title="activity.description">{{ activity.description }}</td>
              <td class="px-4 py-2 text-sm text-gray-600">{{ activity.type }}</td>
              <td class="px-4 py-2 text-sm text-gray-600">{{ activity.category }}</td>
            </tr>
            <tr v-if="paginatedActivities.length === 0 && !loading">
              <td colspan="4" class="px-4 py-2 text-center text-sm text-gray-600">No activities found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <span>
          Showing {{ Math.min((currentPage.value - 1) * itemsPerPage.value + 1, activityCount) }} to
          {{ Math.min(currentPage.value * itemsPerPage.value, activityCount) }} of {{ activityCount }} activities
        </span>
        <div class="flex items-center space-x-1">
          <button
            :disabled="currentPage.value === 1 || loading"
            @click="changePage(currentPage.value - 1)"
            class="px-2 py-1 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded-md',
              currentPage.value === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
            :disabled="loading"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage.value === totalPages.value || loading"
            @click="changePage(currentPage.value + 1)"
            class="px-2 py-1 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1s { animation-delay: 0.2s; }
.animate__delay-2s { animation-delay: 0.4s; }
.animate__delay-3s { animation-delay: 0.6s; }
.animate__delay-4s { animation-delay: 0.8s; }

table {
  width: 100%;
  table-layout: auto;
}

td.truncate {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  td.truncate {
    max-width: 100px;
  }
}
</style>

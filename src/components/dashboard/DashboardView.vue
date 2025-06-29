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
const totalPages = ref(0)

// Time and date
const currentTime = ref('')
const currentDate = ref('')
const greeting = ref('')

const router = useRouter()
const toast = useToast()

// Computed properties
const activityCount = computed(() => activities.value.length)
const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return activities.value.slice(start, end)
})

// Fetch dashboard data
const fetchDashboardData = async (page = 1) => {
  loading.value = true
  try {
    // Fetch tenant stats
    const tenantStats = await axios.get('http://localhost:8080/api/v1/tenants/stats')
    totalTenants.value = tenantStats.data.totalTenants
    activeTenants.value = tenantStats.data.activeTenants

    // Fetch account balance
    const balance = await axios.get('http://localhost:8080/api/v1/account/balance')
    accountBalance.value = balance.data.accountBalance

    // Fetch recent messages
    const messageStats = await axios.get('http://localhost:8080/api/v1/messages/stats')
    recentMessages.value = messageStats.data.recentMessages

    // Fetch pending tasks
    const tasks = await axios.get('http://localhost:8080/api/v1/tasks/pending')
    pendingTasks.value = tasks.data.pendingTasks

    // Fetch activities
    console.log('Fetching activities with params:', { page, limit: itemsPerPage.value })
    const activitiesResponse = await axios.get('http://localhost:8080/api/v1/activities', {
      params: { page, limit: itemsPerPage.value }
    })
    console.log('Activities response:', activitiesResponse.data)
    activities.value = activitiesResponse.data.data
    totalPages.value = Math.ceil(activitiesResponse.data.total / itemsPerPage.value)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to fetch dashboard data'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Navigation and pagination
const navigateTo = (path) => {
  router.push(path)
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchDashboardData(page)
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
  <div class="p-6 max-w-[1920px] mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate__animated animate__fadeInDown">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-3xl font-bold text-gray-900">{{ greeting }} {{ adminName }}!</h1>
        <p class="text-sm text-gray-600">{{ currentDate }} | {{ currentTime }}</p>
      </div>
      <div class="flex flex-wrap gap-4">
        <button
          @click="navigateTo('/dashboard/tenants/add')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Add Tenant
        </button>
        <button
          @click="navigateTo('/dashboard/messages')"
          class="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
        >
          Send Message
        </button>
        <button
          @click="navigateTo('/dashboard/messages')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          View Message History
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Total Tenants</h3>
        <p class="text-2xl font-bold text-blue-600">{{ totalTenants }}</p>
      </div>
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp animate__delay-1s"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Active Tenants</h3>
        <p class="text-2xl font-bold text-green-600">{{ activeTenants }}</p>
      </div>
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp animate__delay-2s"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Account Balance</h3>
        <p class="text-2xl font-bold text-blue-600">KES {{ accountBalance.toLocaleString() }}</p>
      </div>
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp animate__delay-3s"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Recent Messages</h3>
        <p class="text-2xl font-bold text-blue-600">{{ recentMessages }}</p>
      </div>
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp animate__delay-4s"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Pending Tasks</h3>
        <p class="text-2xl font-bold text-red-600">{{ pendingTasks }}</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4 animate__animated animate__fadeInDown">Quick Actions</h2>
      <div class="flex flex-wrap gap-4">
        <button
          @click="navigateTo('/dashboard/tenants')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          View Tenants
        </button>
        <button
          @click="navigateTo('/dashboard/main-account')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Add Funds
        </button>
        <button
          @click="navigateTo('/dashboard/reports')"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
        >
          View Reports
        </button>
        <button
          @click="navigateTo('/dashboard/employees')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Manage Employees
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden animate__animated animate__fadeInUp">
      <h2 class="text-xl font-semibold text-gray-900 p-4">
        Recent Activity ({{ activityCount }})
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Category</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="activity in paginatedActivities" :key="activity.id">
              <td class="px-6 py-4 text-sm text-gray-500">{{ new Date(activity.date).toLocaleString() }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 truncate" :title="activity.description">{{ activity.description }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ activity.type }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ activity.category }}</td>
            </tr>
            <tr v-if="paginatedActivities.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-600">No activities found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex justify-between items-center p-4">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-700 transition-all duration-300"
        >
          Previous
        </button>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-700 transition-all duration-300"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
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
  table-layout: fixed;
}

td.truncate {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  table {
    table-layout: auto;
  }

  td.truncate {
    max-width: 100px;
  }
}
</style>

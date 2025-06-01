<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// Dummy data
const totalTenants = ref(10)
const activeTenants = ref(8)
const accountBalance = ref(150000)
const recentMessages = ref(5)
const pendingTasks = ref(3)

const adminName = ref('Vincent Anjiri')

// Time and date
const currentTime = ref('')
const currentDate = ref('')
const greeting = ref('')

const activities = ref([
  { id: 1, date: '2025-05-31', description: 'Rent Payment: John Kamau', type: 'Payment', amount: 15000, category: 'Credit' },
  { id: 2, date: '2025-05-30', description: 'Message Sent: Flat 101', type: 'Notice Sent', category: 'Message' },
  { id: 3, date: '2025-05-30', description: 'Water Bill Payment', type: 'Bill Payment', amount: -5000, category: 'Balance' },
  { id: 4, date: '2025-05-29', description: 'New Tenant Added: Jane Doe', type: 'Tenant', category: 'Tenant' },
  { id: 5, date: '2025-05-28', description: 'Maintenance Task Assigned', type: 'Task', category: 'Task' },
])

// Router for quick actions
const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}

// Computed property for activity count
const activityCount = computed(() => activities.value.length)

// Function to get time-based greeting
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

// Function to update time and date
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

// Update time every second and set greeting
let timeInterval
onMounted(() => {
  updateGreeting()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ greeting }} {{ adminName }}!</h1>
        <p class="text-sm text-gray-600">{{ currentDate }} | {{ currentTime }}</p>
      </div>
      <div class="flex space-x-4">
        <button
          @click="navigateTo('/dashboard/view-tenants')"
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
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <!-- Total Tenants -->
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Total Tenants</h3>
        <p class="text-2xl font-bold text-blue-600">{{ totalTenants }}</p>
      </div>

      <!-- Active Tenants -->
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp animate__delay-1s"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Active Tenants</h3>
        <p class="text-2xl font-bold text-green-600">{{ activeTenants }}</p>
      </div>

      <!-- Account Balance -->
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp animate__delay-2s"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Account Balance</h3>
        <p class="text-2xl font-bold text-blue-600">KES {{ accountBalance.toLocaleString() }}</p>
      </div>

      <!-- Recent Messages -->
      <div
        class="bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-4 animate__animated animate__fadeInUp animate__delay-3s"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-1">Recent Messages</h3>
        <p class="text-2xl font-bold text-blue-600">{{ recentMessages }}</p>
      </div>

      <!-- Pending Tasks -->
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
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="activity in activities" :key="activity.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ activity.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ activity.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ activity.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ activity.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1s { animation-delay: 0.2s; }
.animate__delay-2s { animation-delay: 0.4s; }
.animate__delay-3s { animation-delay: 0.6s; }
.animate__delay-4s { animation-delay: 0.8s; }
</style>

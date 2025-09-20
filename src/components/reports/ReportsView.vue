<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiClient from '../../services/apiClient' // Import the API client
import Papa from 'papaparse'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

// Report data
const tenantReport = ref({})
const paymentReport = ref({})
const messageReport = ref({})
const loading = ref(false)
const errorMessage = ref('')
const paymentStartDate = ref('')
const paymentEndDate = ref('')
const messageStartDate = ref('')
const messageEndDate = ref('')
const showFilters = ref(true)

const router = useRouter()
const toast = useToast()

// Fetch all reports
const fetchReports = async () => {
  loading.value = true
  try {
    // Fetch tenant report
    const tenantResponse = await apiClient.get('/reports/tenants')
    tenantReport.value = tenantResponse.data

    // Fetch payment report
    const paymentResponse = await apiClient.get('/reports/payments', {
      params: {
        start_date: paymentStartDate.value,
        end_date: paymentEndDate.value,
      },
    })
    paymentReport.value = paymentResponse.data

    // Fetch message report
    const messageResponse = await apiClient.get('/reports/messages', {
      params: {
        start_date: messageStartDate.value,
        end_date: messageEndDate.value,
      },
    })
    messageReport.value = messageResponse.data
  } catch (error) {
    console.error('Error fetching reports:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to fetch reports'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Filter reports
const filterReports = () => {
  if (paymentStartDate.value && paymentEndDate.value && new Date(paymentStartDate.value) > new Date(paymentEndDate.value)) {
    toast.error('Payment start date must be before end date')
    return
  }
  if (messageStartDate.value && messageEndDate.value && new Date(messageStartDate.value) > new Date(messageEndDate.value)) {
    toast.error('Message start date must be before end date')
    return
  }
  fetchReports()
}

// Reset filters
const resetFilters = () => {
  paymentStartDate.value = ''
  paymentEndDate.value = ''
  messageStartDate.value = ''
  messageEndDate.value = ''
  fetchReports()
}

// Export report to CSV
const exportReport = (reportType, data) => {
  let csvData = []
  let filename = ''

  switch (reportType) {
    case 'tenants':
      csvData = [{
        TotalTenants: data.totalTenants,
        ActiveTenants: data.activeTenants,
        TotalApartments: data.totalApartments,
        OccupiedApartments: data.occupiedApartments,
        OccupancyRate: data.occupancyRate?.toFixed(2) + '%',
      }]
      filename = 'tenant_report.csv'
      break
    case 'payments':
      csvData = [{
        TotalPayments: data.totalPayments,
        ConfirmedPayments: data.confirmedPayments,
        PendingPayments: data.pendingPayments,
        OverduePayments: data.overduePayments,
      }]
      filename = 'payment_report.csv'
      break
    case 'messages':
      csvData = [{
        TotalMessages: data.totalMessages,
        SuccessfulMessages: data.successfulMessages,
        FailedMessages: data.failedMessages,
      }]
      filename = 'message_report.csv'
      break
  }

  const csv = Papa.unparse(csvData)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// Chart data
const tenantChartData = computed(() => ({
  labels: ['Active Tenants', 'Inactive Tenants', 'Occupied Apartments', 'Vacant Apartments'],
  datasets: [{
    data: [
      tenantReport.value.activeTenants || 0,
      (tenantReport.value.totalTenants || 0) - (tenantReport.value.activeTenants || 0),
      tenantReport.value.occupiedApartments || 0,
      (tenantReport.value.totalApartments || 0) - (tenantReport.value.occupiedApartments || 0),
    ],
    backgroundColor: ['#2563eb', '#93c5fd', '#16a34a', '#86efac'],
  }],
}))

const paymentChartData = computed(() => ({
  labels: ['Confirmed', 'Pending', 'Overdue'],
  datasets: [{
    label: 'Payments (KES)',
    data: [
      paymentReport.value.confirmedPayments || 0,
      paymentReport.value.pendingPayments || 0,
      paymentReport.value.overduePayments || 0,
    ],
    backgroundColor: ['#16a34a', '#facc15', '#dc2626'],
  }],
}))

const messageChartData = computed(() => ({
  labels: ['Successful', 'Failed'],
  datasets: [{
    data: [
      messageReport.value.successfulMessages || 0,
      messageReport.value.failedMessages || 0,
    ],
    backgroundColor: ['#16a34a', '#dc2626'],
  }],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: '' },
  },
}

// Load reports on mount
onMounted(() => {
  fetchReports()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate__animated animate__fadeIn">
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Reports Dashboard</h1>
        <p class="text-gray-600 text-sm mt-1">View and export tenant, payment, and message reports.</p>
      </div>
      <button
        @click="router.push('/dashboard')"
        class="mt-4 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
      >
        Back to Dashboard
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 animate__animated animate__fadeIn animate__delay-1s">
      <button
        @click="showFilters = !showFilters"
        class="flex items-center w-full text-left text-blue-600 font-medium text-sm mb-4 focus:outline-none"
      >
        <span>{{ showFilters ? 'Hide Filters' : 'Show Filters' }}</span>
        <svg class="w-4 h-4 ml-2 transform" :class="{ 'rotate-180': showFilters }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-if="showFilters" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Start Date</label>
          <input
            v-model="paymentStartDate"
            type="date"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment End Date</label>
          <input
            v-model="paymentEndDate"
            type="date"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Message Start Date</label>
          <input
            v-model="messageStartDate"
            type="date"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Message End Date</label>
          <input
            v-model="messageEndDate"
            type="date"
            class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
          />
        </div>
      </div>
      <div v-if="showFilters" class="flex gap-3 mt-4">
        <button
          @click="filterReports"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium"
          :disabled="loading"
        >
          Apply Filters
        </button>
        <button
          @click="resetFilters"
          class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
          :disabled="loading"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Tenant Report -->
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 animate__animated animate__fadeIn animate__delay-2s">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Tenant Report</h2>
        <button
          @click="exportReport('tenants', tenantReport)"
          class="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm font-medium"
          :disabled="!tenantReport.totalTenants"
        >
          Export to CSV
        </button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Total Tenants</span>
            <span class="text-sm text-gray-900">{{ tenantReport.totalTenants || 0 }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Active Tenants</span>
            <span class="text-sm text-gray-900">{{ tenantReport.activeTenants || 0 }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Total Apartments</span>
            <span class="text-sm text-gray-900">{{ tenantReport.totalApartments || 0 }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Occupied Apartments</span>
            <span class="text-sm text-gray-900">{{ tenantReport.occupiedApartments || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-600">Occupancy Rate</span>
            <span class="text-sm text-gray-900">{{ tenantReport.occupancyRate ? tenantReport.occupancyRate.toFixed(2) : 0 }}%</span>
          </div>
        </div>
        <div class="h-64">
          <Bar
            :data="tenantChartData"
            :options="{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Tenant & Apartment Metrics' } } }"
          />
        </div>
      </div>
    </div>

    <!-- Payment Report -->
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 animate__animated animate__fadeIn animate__delay-3s">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Payment Report</h2>
        <button
          @click="exportReport('payments', paymentReport)"
          class="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm font-medium"
          :disabled="!paymentReport.totalPayments"
        >
          Export to CSV
        </button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Total Payments</span>
            <span class="text-sm text-gray-900">{{ paymentReport.totalPayments || 0 }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Confirmed Payments (KES)</span>
            <span class="text-sm text-gray-900">{{ paymentReport.confirmedPayments ? paymentReport.confirmedPayments.toLocaleString() : 0 }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Pending Payments (KES)</span>
            <span class="text-sm text-gray-900">{{ paymentReport.pendingPayments ? paymentReport.pendingPayments.toLocaleString() : 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-600">Overdue Payments (KES)</span>
            <span class="text-sm text-gray-900">{{ paymentReport.overduePayments ? paymentReport.overduePayments.toLocaleString() : 0 }}</span>
          </div>
        </div>
        <div class="h-64">
          <Bar
            :data="paymentChartData"
            :options="{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Payment Metrics' } } }"
          />
        </div>
      </div>
    </div>

    <!-- Message Report -->
    <div class="bg-white rounded-2xl shadow-lg p-6 animate__animated animate__fadeIn animate__delay-4s">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Message Report</h2>
        <button
          @click="exportReport('messages', messageReport)"
          class="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm font-medium"
          :disabled="!messageReport.totalMessages"
        >
          Export to CSV
        </button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Total Messages</span>
            <span class="text-sm text-gray-900">{{ messageReport.totalMessages || 0 }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-200 pb-2">
            <span class="text-sm font-medium text-gray-600">Successful Messages</span>
            <span class="text-sm text-gray-900">{{ messageReport.successfulMessages || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-600">Failed Messages</span>
            <span class="text-sm text-gray-900">{{ messageReport.failedMessages || 0 }}</span>
          </div>
        </div>
        <div class="h-64">
          <Pie
            :data="messageChartData"
            :options="{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Message Metrics' } } }"
          />
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mt-6 text-red-600 text-center text-sm font-medium">{{ errorMessage }}</div>
    <!-- Loading State -->
    <div v-if="loading" class="mt-6 text-gray-600 text-center text-sm font-medium">Loading reports...</div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__fadeIn { animation-duration: 0.5s; }
.animate__delay-1s { animation-delay: 0.2s; }
.animate__delay-2s { animation-delay: 0.4s; }
.animate__delay-3s { animation-delay: 0.6s; }
.animate__delay-4s { animation-delay: 0.8s; }

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 9999px;
}
</style>

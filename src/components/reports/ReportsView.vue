<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import Papa from 'papaparse'

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

const router = useRouter()
const toast = useToast()

// Fetch all reports
const fetchReports = async () => {
    loading.value = true
    try {
        // Fetch tenant report
        const tenantResponse = await axios.get('http://localhost:8080/api/v1/reports/tenants')
        tenantReport.value = tenantResponse.data

        // Fetch payment report
        const paymentResponse = await axios.get('http://localhost:8080/api/v1/reports/payments', {
            params: {
                start_date: paymentStartDate.value,
                end_date: paymentEndDate.value,
            },
        })
        paymentReport.value = paymentResponse.data

        // Fetch message report
        const messageResponse = await axios.get('http://localhost:8080/api/v1/reports/messages', {
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
                OccupancyRate: data.occupancyRate.toFixed(2) + '%',
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

// Load reports on mount
onMounted(() => {
    fetchReports()
})
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
            <h1 class="text-3xl font-bold text-gray-900">Reports</h1>
            <div class="flex space-x-4">
                <button
                    @click="router.push('/dashboard')"
                    class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
                >
                    Back to Dashboard
                </button>
                <button
                    @click="toast.success('Test toast')"
                    class="px-4 py-2 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition-all duration-300"
                >
                    Test Toast
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 mb-6 animate__animated animate__fadeInUp">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Payment Start Date</label>
                    <input
                        v-model="paymentStartDate"
                        type="date"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Payment End Date</label>
                    <input
                        v-model="paymentEndDate"
                        type="date"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Message Start Date</label>
                    <input
                        v-model="messageStartDate"
                        type="date"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Message End Date</label>
                    <input
                        v-model="messageEndDate"
                        type="date"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            <div class="flex space-x-4">
                <button
                    @click="filterReports"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    :disabled="loading"
                >
                    Apply Filters
                </button>
                <button
                    @click="resetFilters"
                    class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
                    :disabled="loading"
                >
                    Clear Filters
                </button>
            </div>
        </div>

        <!-- Tenant Report -->
        <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 mb-6 animate__animated animate__fadeInUp animate__delay-1s">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Tenant Report</h2>
                <button
                    @click="exportReport('tenants', tenantReport)"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                    :disabled="!tenantReport.totalTenants"
                >
                    Export to CSV
                </button>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Total Tenants</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenantReport.totalTenants || 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Active Tenants</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenantReport.activeTenants || 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Total Apartments</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenantReport.totalApartments || 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Occupied Apartments</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenantReport.occupiedApartments || 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Occupancy Rate</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenantReport.occupancyRate ? tenantReport.occupancyRate.toFixed(2) : 0 }}%</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Payment Report -->
        <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 mb-6 animate__animated animate__fadeInUp animate__delay-2s">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Payment Report</h2>
                <button
                    @click="exportReport('payments', paymentReport)"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                    :disabled="!paymentReport.totalPayments"
                >
                    Export to CSV
                </button>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Total Payments</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ paymentReport.totalPayments || 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Confirmed Payments (KES)</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ paymentReport.confirmedPayments ? paymentReport.confirmedPayments.toLocaleString() : 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pending Payments (KES)</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ paymentReport.pendingPayments ? paymentReport.pendingPayments.toLocaleString() : 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Overdue Payments (KES)</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ paymentReport.overduePayments ? paymentReport.overduePayments.toLocaleString() : 0 }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Message Report -->
        <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-3s">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Message Report</h2>
                <button
                    @click="exportReport('messages', messageReport)"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                    :disabled="!messageReport.totalMessages"
                >
                    Export to CSV
                </button>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Total Messages</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ messageReport.totalMessages || 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Successful Messages</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ messageReport.successfulMessages || 0 }}</td>
                    </tr>
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Failed Messages</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ messageReport.failedMessages || 0 }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
        <!-- Loading State -->
        <div v-if="loading" class="mt-4 text-gray-600">Loading reports...</div>
    </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1s { animation-delay: 0.2s; }
.animate__delay-2s { animation-delay: 0.4s; }
.animate__delay-3s { animation-delay: 0.6s; }
</style>

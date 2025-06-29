<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const invoices = ref([])
const tenants = ref([])
const filterTenantId = ref('')
const filterStatus = ref('')
const loading = ref(false)
const loadingTenants = ref(false)
const errorMessage = ref('')

const router = useRouter()
const toast = useToast()

const fetchInvoices = async () => {
    loading.value = true
    try {
        const params = {}
        if (filterTenantId.value) params.tenant_id = filterTenantId.value
        if (filterStatus.value) params.status = filterStatus.value
        console.log('Fetching invoices with params:', params)
        const response = await axios.get('http://localhost:8080/api/v1/invoices', { params })
        invoices.value = response.data.data || []
        console.log('Fetched invoices:', invoices.value)
    } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Failed to fetch invoices'
        if (error.response?.data?.details) {
            errorMessage.value += `: ${error.response.data.details}`
        }
        toast.error(errorMessage.value)
        console.error('Error fetching invoices:', error.response?.data || error)
    } finally {
        loading.value = false
    }
}

const fetchTenants = async () => {
    loadingTenants.value = true
    try {
        const response = await axios.get('http://localhost:8080/api/v1/tenants', {
            params: { is_active: true }
        })
        tenants.value = response.data.data || []
        console.log('Fetched tenants:', tenants.value)
    } catch (error) {
        toast.error('Failed to fetch tenants: ' + (error.response?.data?.error || error.message))
        console.error('Error fetching tenants:', error)
    } finally {
        loadingTenants.value = false
    }
}

const applyFilters = () => {
    fetchInvoices()
}

const clearFilters = () => {
    filterTenantId.value = ''
    filterStatus.value = ''
    fetchInvoices()
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const viewInvoice = (id) => {
    router.push(`/dashboard/invoices/${id}`)
}

onMounted(() => {
    fetchTenants()
    fetchInvoices()
})
</script>

<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
            <h1 class="text-3xl font-bold text-gray-900">Invoices</h1>
            <div class="flex space-x-4">
                <button
                    @click="router.push('/dashboard')"
                    class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
                >
                    Back to Dashboard
                </button>
                <button
                    @click="router.push('/dashboard/invoices/add')"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                >
                    Create Invoice
                </button>
            </div>
        </div>

        <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 mb-6 animate__animated animate__fadeInUp">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Tenant</label>
                    <select
                        v-model="filterTenantId"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        :disabled="loading || loadingTenants"
                    >
                        <option value="">All Tenants</option>
                        <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                            {{ tenant.first_name }} {{ tenant.last_name }} ({{ tenant.house_number }})
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select
                        v-model="filterStatus"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        :disabled="loading"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end space-x-4">
                <button
                    @click="clearFilters"
                    class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
                    :disabled="loading"
                >
                    Clear Filters
                </button>
                <button
                    @click="applyFilters"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                    :disabled="loading"
                >
                    Apply Filters
                </button>
            </div>
        </div>

        <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Invoice List ({{ invoices.length }})</h2>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (KES)</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="invoice in invoices" :key="invoice.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ invoice.id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ invoice.tenant ? `${invoice.tenant.first_name} ${invoice.tenant.last_name}` : invoice.tenant_id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ invoice.apartment ? invoice.apartment.house_number : invoice.apartment_id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ invoice.amount.toLocaleString() }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(invoice.due_date) }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                                :class="{
                                    'text-green-600': invoice.status === 'paid',
                                    'text-yellow-600': invoice.status === 'pending',
                                    'text-red-600': invoice.status === 'overdue'
                                }"
                            >
                                {{ invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">{{ invoice.description }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                                @click="viewInvoice(invoice.id)"
                                class="text-blue-600 hover:text-blue-800"
                            >
                                View
                            </button>
                        </td>
                    </tr>
                    <tr v-if="invoices.length === 0 && !loading">
                        <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-600">No invoices found</td>
                    </tr>
                </tbody>
            </table>
            <p v-if="loading" class="text-center text-sm text-gray-600 mt-4">Loading invoices...</p>
        </div>

        <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
    </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

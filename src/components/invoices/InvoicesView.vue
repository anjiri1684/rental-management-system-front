<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiClient from '../../services/apiClient'

const invoices = ref([])
const tenants = ref([])
const filterTenantId = ref('')
const filterStatus = ref('')
const loading = ref(false)
const loadingTenants = ref(false)
const errorMessage = ref('')
const showUpdateModal = ref(false)
const selectedInvoice = ref(null)
const newStatus = ref('')
const updating = ref(false)

const router = useRouter()
const toast = useToast()

const fetchInvoices = async () => {
    loading.value = true
    try {
        const params = {}
        if (filterTenantId.value) params.tenant_id = filterTenantId.value
        if (filterStatus.value) params.status = filterStatus.value
        console.log('Fetching invoices with params:', params)
        const response = await apiClient.get('/invoices', { params })
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
        const response = await apiClient.get('/tenants', {
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

const openUpdateModal = (invoice) => {
    selectedInvoice.value = invoice
    newStatus.value = invoice.status
    showUpdateModal.value = true
}

const closeUpdateModal = () => {
    showUpdateModal.value = false
    selectedInvoice.value = null
    newStatus.value = ''
}

const updateInvoiceStatus = async () => {
    if (!newStatus.value) {
        toast.error('Please select a status')
        return
    }

    updating.value = true
    try {
        const response = await apiClient.patch(`/invoices/${selectedInvoice.value.id}/status`, {
            status: newStatus.value
        })

        // Update the invoice in the local array
        const index = invoices.value.findIndex(inv => inv.id === selectedInvoice.value.id)
        if (index !== -1) {
            invoices.value[index] = response.data.invoice
        }

        toast.success('Invoice status updated successfully')
        closeUpdateModal()
    } catch (error) {
        const errMsg = error.response?.data?.error || 'Failed to update invoice status'
        toast.error(errMsg)
        console.error('Error updating invoice status:', error.response?.data || error)
    } finally {
        updating.value = false
    }
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
                                class="text-blue-600 hover:text-blue-800 mr-3"
                            >
                                View
                            </button>
                            <button
                                @click="openUpdateModal(invoice)"
                                class="text-yellow-600 hover:text-yellow-800"
                            >
                                Update Status
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

        <!-- Update Status Modal -->
        <div v-if="showUpdateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 class="text-xl font-semibold mb-4">Update Invoice Status</h2>
                <div v-if="selectedInvoice" class="mb-4">
                    <p>Invoice #{{ selectedInvoice.id }} for {{ selectedInvoice.tenant?.first_name }} {{ selectedInvoice.tenant?.last_name }}</p>
                    <p>Amount: KES {{ selectedInvoice.amount.toLocaleString() }}</p>
                    <p>Current Status: {{ selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1) }}</p>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                    <select
                        v-model="newStatus"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        :disabled="updating"
                    >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
                <div class="flex justify-end space-x-4">
                    <button
                        @click="closeUpdateModal"
                        class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
                        :disabled="updating"
                    >
                        Cancel
                    </button>
                    <button
                        @click="updateInvoiceStatus"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                        :disabled="updating"
                    >
                        <span v-if="updating">Updating...</span>
                        <span v-else>Update Status</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
    </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const invoice = ref({})
const loading = ref(false)
const errorMessage = ref('')
const showUpdateModal = ref(false)
const newStatus = ref('')
const updating = ref(false)

const router = useRouter()
const route = useRoute()
const toast = useToast()

// Fetch invoice
const fetchInvoice = async () => {
    loading.value = true
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/invoices/${route.params.id}`)
        invoice.value = response.data
        console.log('Fetched invoice:', invoice.value)
    } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Failed to fetch invoice'
        toast.error(errorMessage.value)
        console.error('Error fetching invoice:', error)
    } finally {
        loading.value = false
    }
}

// Format date
const formatDate = (date) => {
    if (!date) return 'N/A'
    try {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    } catch {
        return 'N/A'
    }
}

// Update invoice status
const openUpdateModal = () => {
    if (!invoice.value?.invoice?.status) {
        toast.error('Invoice data not loaded')
        return
    }
    newStatus.value = invoice.value.invoice.status
    showUpdateModal.value = true
}

const closeUpdateModal = () => {
    showUpdateModal.value = false
    newStatus.value = ''
}

const updateInvoiceStatus = async () => {
    if (!newStatus.value) {
        toast.error('Please select a status')
        return
    }

    updating.value = true
    try {
        const response = await axios.patch(`http://localhost:8080/api/v1/invoices/${invoice.value.invoice.id}/status`, {
            status: newStatus.value
        })
        invoice.value.invoice = response.data.invoice
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
    fetchInvoice()
})
</script>

<template>
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6 overflow-scroll">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate__animated animate__fadeInDown">
            <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Invoice #{{ invoice.invoice?.id || 'N/A' }}</h1>
                <p class="text-gray-600 mt-1">View and manage invoice details</p>
            </div>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                <button
                    @click="router.push('/dashboard/invoices')"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300"
                >
                    Back to Invoices
                </button>
                <button
                    v-if="invoice.invoice?.id"
                    @click="openUpdateModal"
                    class="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300"
                >
                    Update Status
                </button>
            </div>
        </div>

        <!-- Invoice Details -->
        <div v-if="!loading && invoice.invoice?.id" class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 animate__animated animate__fadeInUp">
            <!-- Main Invoice Card -->
            <div class="lg:col-span-2">
                <div class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-blue-500">
                    <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Invoice Details</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Tenant</p>
                            <p class="text-base sm:text-lg font-medium text-gray-900">{{ invoice.invoice.tenant?.first_name || 'N/A' }} {{ invoice.invoice.tenant?.last_name || 'N/A' }}</p>
                            <p class="text-sm text-gray-500">{{ invoice.invoice.tenant?.email || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-600">Apartment</p>
                            <p class="text-base sm:text-lg font-medium text-gray-900">{{ invoice.invoice.apartment?.house_number || 'N/A' }}</p>
                            <p class="text-sm text-gray-500">{{ invoice.invoice.apartment?.unit_type || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-600">Amount</p>
                            <p class="text-base sm:text-lg font-medium text-gray-900">KES {{ invoice.invoice.amount?.toLocaleString() || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-600">Due Date</p>
                            <p class="text-base sm:text-lg font-medium text-gray-900">{{ formatDate(invoice.invoice.due_date) }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-600">Status</p>
                            <span
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                                :class="{
                                    'bg-green-100 text-green-800': invoice.invoice.status === 'paid',
                                    'bg-yellow-100 text-yellow-800': invoice.invoice.status === 'pending',
                                    'bg-red-100 text-red-800': invoice.invoice.status === 'overdue'
                                }"
                            >
                                {{ invoice.invoice.status?.charAt(0).toUpperCase() + invoice.invoice.status?.slice(1) || 'N/A' }}
                            </span>
                        </div>
                    </div>
                    <div class="mt-6">
                        <p class="text-sm font-medium text-gray-600">Description</p>
                        <p class="text-gray-900 bg-gray-50 p-4 rounded-lg mt-2">{{ invoice.invoice.description || 'N/A' }}</p>
                    </div>
                </div>
                <!-- Messages Section -->
                <div v-if="invoice.messages?.length" class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-blue-500 mt-4 sm:mt-6">
                    <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Messages Sent</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="message in invoice.messages" :key="message.id">
                                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ message.message || 'N/A' }}</td>
                                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ message.recipient || 'N/A' }}</td>
                                    <td class="px-4 py-2 whitespace-nowrap text-sm">
                                        <span
                                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                            :class="{
                                                'bg-green-100 text-green-800': message.status === 'sent',
                                                'bg-yellow-100 text-yellow-800': message.status === 'pending',
                                                'bg-red-100 text-red-800': message.status === 'failed'
                                            }"
                                        >
                                            {{ message.status?.charAt(0).toUpperCase() + message.status?.slice(1) || 'N/A' }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ formatDate(message.sent_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Summary Card -->
            <div>
                <div class="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border-l-4 border-blue-500">
                    <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Summary</h2>
                    <div class="space-y-4">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal</span>
                            <span class="font-medium">KES {{ invoice.invoice.amount?.toLocaleString() || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Tax</span>
                            <span class="font-medium">KES 0.00</span>
                        </div>
                        <div class="border-t pt-4">
                            <div class="flex justify-between">
                                <span class="text-lg font-semibold text-gray-900">Total</span>
                                <span class="text-lg font-semibold text-gray-900">KES {{ invoice.invoice.amount?.toLocaleString() || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Update Status Modal -->
        <div v-if="showUpdateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Update Invoice Status</h2>
                <div class="mb-4">
                    <p>Invoice #{{ invoice.invoice?.id || 'N/A' }} for {{ invoice.invoice?.tenant?.first_name || 'N/A' }} {{ invoice.invoice?.tenant?.last_name || 'N/A' }}</p>
                    <p>Amount: KES {{ invoice.invoice?.amount?.toLocaleString() || 'N/A' }}</p>
                    <p>Current Status: {{ invoice.invoice?.status?.charAt(0).toUpperCase() + invoice.invoice?.status?.slice(1) || 'N/A' }}</p>
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
                        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300"
                        :disabled="updating"
                    >
                        Cancel
                    </button>
                    <button
                        @click="updateInvoiceStatus"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600/90 transition-all duration-300"
                        :disabled="updating"
                    >
                        <span v-if="updating">Updating...</span>
                        <span v-else>Update Status</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center text-gray-600 mt-8">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2">Loading invoice...</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-8 text-red-600 text-center">{{ errorMessage }}</div>
    </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const tenantId = ref(null)
const apartmentId = ref(null)
const amount = ref('')
const dueDate = ref('')
const description = ref('')
const tenants = ref([])
const apartments = ref([])
const loading = ref(false)
const loadingTenants = ref(false)
const loadingApartments = ref(false)
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const errors = ref({})
const successMessage = ref('')
const sentMessage = ref('')
const messageStatus = ref('')
const router = useRouter()
const toast = useToast()

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

const fetchApartments = async () => {
    if (!tenantId.value) {
        apartments.value = []
        apartmentId.value = null
        return
    }
    loadingApartments.value = true
    try {
        const response = await axios.get('http://localhost:8080/api/v1/apartments', {
            params: { status: 'occupied' }
        })
        const tenant = tenants.value.find(t => t.id === tenantId.value)
        apartments.value = tenant ? response.data.data.filter(a => a.id === tenant.apartment_id) : []
        console.log('Fetched apartments:', apartments.value)
        if (apartments.value.length === 1) {
            apartmentId.value = apartments.value[0].id
        }
    } catch (error) {
        toast.error('Failed to fetch apartments: ' + (error.response?.data?.error || error.message))
        console.error('Error fetching apartments:', error)
    } finally {
        loadingApartments.value = false
    }
}

watch(tenantId, () => {
    fetchApartments()
})

const validateForm = () => {
    errors.value = {}
    if (!tenantId.value) errors.value.tenantId = 'Tenant is required'
    if (!apartmentId.value) errors.value.apartmentId = 'Apartment is required'
    if (!amount.value || amount.value <= 0) errors.value.amount = 'Amount must be greater than 0'
    if (!dueDate.value) errors.value.dueDate = 'Due date is required'
    if (!description.value.trim()) errors.value.description = 'Description is required'

    if (Object.keys(errors.value).length > 0) {
        toast.error('Please correct the form errors')
    }
    return Object.keys(errors.value).length === 0
}

const submitForm = () => {
    if (validateForm()) {
        showConfirmModal.value = true
    }
}

const confirmSubmit = async () => {
    loading.value = true
    try {
        const response = await axios.post('http://localhost:8080/api/v1/invoices', {
            tenant_id: tenantId.value,
            apartment_id: apartmentId.value,
            amount: parseFloat(amount.value),
            due_date: dueDate.value,
            description: description.value,
        })
        loading.value = false
        showConfirmModal.value = false
        successMessage.value = 'Invoice created successfully'
        sentMessage.value = response.data.message || ''
        messageStatus.value = response.data.status || 'unknown'
        showSuccessModal.value = true
        toast.success(`${successMessage.value}${sentMessage.value ? ' and message sent to tenant' : ''}`)
    } catch (error) {
        loading.value = false
        showConfirmModal.value = false
        errorMessage.value = error.response?.data?.error || 'Failed to create invoice'
        if (error.response?.data?.details) {
            errorMessage.value += `: ${error.response.data.details}`
        }
        showErrorModal.value = true
        toast.error(errorMessage.value)
        console.error('Submission error:', error)
    }
}

const closeSuccessModal = () => {
    showSuccessModal.value = false
    resetForm()
    router.push('/dashboard')
}

const closeErrorModal = () => {
    showErrorModal.value = false
    errorMessage.value = ''
}

const resetForm = () => {
    tenantId.value = null
    apartmentId.value = null
    amount.value = ''
    dueDate.value = ''
    description.value = ''
    errors.value = {}
    sentMessage.value = ''
    messageStatus.value = ''
}

onMounted(() => {
    fetchTenants()
})
</script>

<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
            <h1 class="text-3xl font-bold text-gray-900">Create Invoice</h1>
            <button
                @click="router.push('/dashboard/invoices')"
                class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
            >
                Back to Invoices
            </button>
        </div>

        <!-- Notification Banner for Sent Message -->
        <div
            v-if="sentMessage"
            class="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg animate__animated animate__fadeIn"
        >
            <p class="font-semibold">Message Sent to Tenant (Status: {{ messageStatus }})</p>
            <p>{{ sentMessage }}</p>
        </div>

        <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
            <form @submit.prevent="submitForm" :disabled="loading || tenants.length === 0">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Invoice Details</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
                        <select
                            v-model="tenantId"
                            class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            :disabled="loading || loadingTenants || tenants.length === 0"
                        >
                            <option value="" disabled>Select a tenant</option>
                            <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                                {{ tenant.first_name }} {{ tenant.last_name }} ({{ tenant.house_number }})
                            </option>
                        </select>
                        <p v-if="errors.tenantId" class="text-sm text-red-600 mt-1">{{ errors.tenantId }}</p>
                        <p v-if="tenants.length === 0 && !loadingTenants" class="text-sm text-yellow-600 mt-1">No active tenants available</p>
                        <p v-if="loadingTenants" class="text-sm text-gray-600 mt-1">Loading tenants...</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Apartment</label>
                        <select
                            v-model="apartmentId"
                            class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            :disabled="loading || loadingApartments || apartments.length === 0"
                        >
                            <option value="" disabled>Select an apartment</option>
                            <option v-for="apartment in apartments" :key="apartment.id" :value="apartment.id">
                                {{ apartment.house_number }} ({{ apartment.unit_type }}, KES {{ apartment.rent_amount.toLocaleString() }})
                            </option>
                        </select>
                        <p v-if="errors.apartmentId" class="text-sm text-red-600 mt-1">{{ errors.apartmentId }}</p>
                        <p v-if="apartments.length === 0 && !loadingApartments" class="text-sm text-yellow-600 mt-1">No apartments available for selected tenant</p>
                        <p v-if="loadingApartments" class="text-sm text-gray-600 mt-1">Loading apartments...</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
                        <input
                            v-model="amount"
                            type="number"
                            step="0.01"
                            class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter amount"
                            required
                            :disabled="loading || tenants.length === 0"
                        />
                        <p v-if="errors.amount" class="text-sm text-red-600 mt-1">{{ errors.amount }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            v-model="dueDate"
                            type="date"
                            class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            :disabled="loading || tenants.length === 0"
                        />
                        <p v-if="errors.dueDate" class="text-sm text-red-600 mt-1">{{ errors.dueDate }}</p>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            v-model="description"
                            class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter invoice description"
                            required
                            :disabled="loading || tenants.length === 0"
                        ></textarea>
                        <p v-if="errors.description" class="text-sm text-red-600 mt-1">{{ errors.description }}</p>
                    </div>
                </div>

                <div class="flex justify-end space-x-4">
                    <button
                        type="button"
                        @click="resetForm"
                        class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
                        :disabled="loading || tenants.length === 0"
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                        :disabled="loading || tenants.length === 0"
                    >
                        {{ loading ? 'Submitting...' : 'Create Invoice' }}
                    </button>
                </div>
            </form>
        </div>

        <div
            v-if="showConfirmModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Invoice Creation</h2>
                <p class="text-gray-600 mb-4">
                    Create invoice for {{ tenants.find(t => t.id === tenantId)?.first_name }} {{ tenants.find(t => t.id === tenantId)?.last_name }} ({{ description }})? A message will be sent to the tenant.
                </p>
                <div class="flex justify-end space-x-4">
                    <button
                        @click="showConfirmModal = false"
                        class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                        :disabled="loading"
                    >
                        Cancel
                    </button>
                    <button
                        @click="confirmSubmit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        :disabled="loading"
                    >
                        {{ loading ? 'Submitting...' : 'Confirm' }}
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="showSuccessModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
                <h2 class="text-xl font-bold text-green-600 mb-4">Success</h2>
                <p class="text-gray-600 mb-4">{{ successMessage }}</p>
                <p v-if="sentMessage" class="text-gray-600 mb-4">Message sent (Status: {{ messageStatus }}): {{ sentMessage }}</p>
                <div class="flex justify-end">
                    <button
                        @click="closeSuccessModal"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="showErrorModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
                <h2 class="text-xl font-bold text-red-600 mb-4">Failed to Create Invoice</h2>
                <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
                <div class="flex justify-end">
                    <button
                        @click="closeErrorModal"
                        class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const invoice = ref({})
const loading = ref(false)
const errorMessage = ref('')

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
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

onMounted(() => {
    fetchInvoice()
})
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
            <h1 class="text-3xl font-bold text-gray-900">Invoice Details</h1>
            <button
                @click="router.push('/dashboard/invoices')"
                class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
            >
                Back to Invoices
            </button>
        </div>

        <!-- Invoice Details -->
        <div v-if="!loading && invoice.id" class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Invoice #{{ invoice.id }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p class="text-sm font-medium text-gray-700">Tenant</p>
                    <p class="text-gray-900">{{ invoice.tenant.first_name }} {{ invoice.tenant.last_name }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-700">Apartment</p>
                    <p class="text-gray-900">{{ invoice.apartment.house_number }} ({{ invoice.apartment.unit_type }})</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-700">Amount</p>
                    <p class="text-gray-900">KES {{ invoice.amount.toLocaleString() }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-700">Due Date</p>
                    <p class="text-gray-900">{{ formatDate(invoice.due_date) }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-gray-700">Status</p>
                    <p
                        :class="{
                            'text-green-600': invoice.status === 'paid',
                            'text-yellow-600': invoice.status === 'pending',
                            'text-red-600': invoice.status === 'overdue'
                        }"
                    >
                        {{ invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }}
                    </p>
                </div>
                <div class="md:col-span-2">
                    <p class="text-sm font-medium text-gray-700">Description</p>
                    <p class="text-gray-900">{{ invoice.description }}</p>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center text-gray-600 mt-4">Loading invoice...</div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
    </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

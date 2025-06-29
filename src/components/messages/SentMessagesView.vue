<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

// Message state
const messages = ref([])
const loading = ref(false)
const errorMessage = ref('')
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(1)
const recipientFilter = ref('')
const startDate = ref('')
const endDate = ref('')

const router = useRouter()
const toast = useToast()

// Fetch messages
const fetchMessages = async () => {
    loading.value = true
    try {
        const response = await axios.get('http://localhost:8080/api/v1/messages', {
            params: {
                page: page.value,
                limit: limit.value,
                recipient: recipientFilter.value,
                start_date: startDate.value,
                end_date: endDate.value,
            },
        })
        messages.value = response.data.data
        total.value = response.data.meta.total
        totalPages.value = response.data.meta.totalPages
    } catch (error) {
        errorMessage.value = error.response?.data?.error || 'Failed to fetch messages'
        toast.error(errorMessage.value)
    } finally {
        loading.value = false
    }
}

// Change page
const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage
        fetchMessages()
    }
}

// Filter messages
const filterMessages = () => {
    page.value = 1
    fetchMessages()
}

// Reset filters
const resetFilters = () => {
    recipientFilter.value = ''
    startDate.value = ''
    endDate.value = ''
    page.value = 1
    fetchMessages()
}

// Load messages on mount
onMounted(() => {
    fetchMessages()
})
</script>

<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
            <h1 class="text-3xl font-bold text-gray-900">Message History</h1>
            <div class="flex space-x-4">
                <button
                    @click="router.push('/dashboard/messages')"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                    Send New Message
                </button>
                <button
                    @click="router.push('/dashboard/payments')"
                    class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
                >
                    Back to Payments
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
                    <label class="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                    <input
                        v-model="recipientFilter"
                        type="text"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Filter by phone number"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        v-model="startDate"
                        type="date"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        v-model="endDate"
                        type="date"
                        class="w-full border-gray-300 pl-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div class="flex items-end space-x-4">
                    <button
                        @click="filterMessages"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                        :disabled="loading"
                    >
                        Filter
                    </button>
                    <button
                        @click="resetFilters"
                        class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
                        :disabled="loading"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>

        <!-- Messages Table -->
        <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 animate__animated animate__fadeInUp animate__delay-1">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b">
                        <th class="py-2 px-4">Recipient</th>
                        <th class="py-2 px-4">Message</th>
                        <th class="py-2 px-4">Sent At</th>
                        <th class="py-2 px-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="message in messages" :key="message.id" class="border-b hover:bg-gray-50">
                        <td class="py-2 px-4">{{ message.recipient }}</td>
                        <td class="py-2 px-4">{{ message.message }}</td>
                        <td class="py-2 px-4">{{ new Date(message.sent_at).toLocaleString() }}</td>
                        <td class="py-2 px-4">
                            <span :class="{
                                'text-green-600': message.status === 'sent',
                                'text-red-600': message.status === 'failed'
                            }">
                                {{ message.status }}
                            </span>
                        </td>
                    </tr>
                    <tr v-if="messages.length === 0">
                        <td colspan="4" class="py-4 text-center text-gray-600">No messages found</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-between items-center mt-4">
                <div>
                    Showing {{ (page - 1) * limit + 1 }} to {{ Math.min(page * limit, total) }} of {{ total }} messages
                </div>
                <div class="flex space-x-2">
                    <button
                        @click="changePage(page - 1)"
                        :disabled="page === 1 || loading"
                        class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                    >
                        Previous
                    </button>
                    <button
                        @click="changePage(page + 1)"
                        :disabled="page === totalPages || loading"
                        class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</div>
    </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

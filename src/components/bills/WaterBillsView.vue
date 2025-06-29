<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const toast = useToast()
const waterBills = ref([])
const loading = ref(false)
const errorMessage = ref('')
const showAddModal = ref(false)
const showUpdateModal = ref(false)
const tenants = ref([])

// Form data for adding a water bill
const newBill = ref({
  tenantId: '',
  amount: '',
  dueDate: '',
})

// Form data for updating status
const updateStatus = ref({
  id: null,
  status: ''
})

// Fetch all tenants for the dropdown
const fetchTenants = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/tenants')
    tenants.value = response.data.data || []
    if (!tenants.value.length) {
      console.log('No tenants returned from API')
    }
  } catch (error) {
    console.error('Error fetching tenants:', error.response?.data || error.message)
    toast.error('Failed to fetch tenants: ' + (error.response?.data?.error || error.message))
  }
}

// Fetch all water bills
const fetchWaterBills = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8080/api/v1/bills')
    waterBills.value = response.data.data || []
    if (!waterBills.value.length) {
      console.log('No water bills returned from API')
      errorMessage.value = 'No water bills found'
    } else {
      errorMessage.value = ''
    }
  } catch (error) {
    console.error('Error fetching water bills:', error.response?.data || error.message)
    errorMessage.value = error.response?.data?.error || 'Failed to fetch water bills'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Add a new water bill
const addWaterBill = async () => {
  loading.value = true
  try {
    await axios.post('http://localhost:8080/api/v1/bills', newBill.value)
    toast.success('Water bill added successfully')
    showAddModal.value = false
    newBill.value = { tenantId: '', amount: '', dueDate: '' }
    fetchWaterBills()
  } catch (error) {
    console.error('Error adding water bill:', error.response?.data || error.message)
    errorMessage.value = error.response?.data?.error || 'Failed to add water bill'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Update bill status
const updateBillStatus = async () => {
  loading.value = true
  try {
    await axios.patch(`http://localhost:8080/api/v1/bills/${updateStatus.value.id}/status`, {
      status: updateStatus.value.status
    })
    toast.success('Bill status updated successfully')
    showUpdateModal.value = false
    fetchWaterBills()
  } catch (error) {
    console.error('Error updating bill status:', error.response?.data || error.message)
    errorMessage.value = error.response?.data?.error || 'Failed to update bill status'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Open update modal
const openUpdateModal = (bill) => {
  updateStatus.value = { id: bill.id, status: bill.status }
  showUpdateModal.value = true
}

// Fetch data on mount
onMounted(() => {
  fetchTenants()
  fetchWaterBills()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate__animated animate__fadeIn">
      <div>
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Water Bills</h1>
        <p class="text-gray-600 text-sm mt-1">Manage water bills for your tenants.</p>
      </div>
      <button
        @click="showAddModal = true"
        class="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm font-medium"
      >
        Add Water Bill
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-6 text-red-600 text-sm font-medium text-center">{{ errorMessage }}</div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center text-gray-600">Loading...</div>

    <!-- Water Bills Table -->
    <div v-else class="bg-white rounded-2xl shadow-lg p-6 animate__animated animate__fadeIn animate__delay-1s">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-100 text-gray-600">
              <th class="py-3 px-4 font-medium text-sm">Tenant</th>
              <th class="py-3 px-4 font-medium text-sm">Apartment</th>
              <th class="py-3 px-4 font-medium text-sm">Amount</th>
              <th class="py-3 px-4 font-medium text-sm">Due Date</th>
              <th class="py-3 px-4 font-medium text-sm">Status</th>
              <th class="py-3 px-4 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bill in waterBills" :key="bill.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
              <td class="py-3 px-4 text-gray-800">{{ bill.tenant.first_name || 'N/A' }} {{ bill.tenant.last_name || '' }}</td>
              <td class="py-3 px-4 text-gray-800">{{ bill.apartment.house_number || 'N/A' }}</td>
              <td class="py-3 px-4 text-gray-800">KES {{ Number(bill.amount).toFixed(2) }}</td>
              <td class="py-3 px-4 text-gray-800">{{ new Date(bill.due_date).toLocaleDateString() }}</td>
              <td class="py-3 px-4">
                <span :class="{
                  'text-green-600': bill.status === 'confirmed',
                  'text-yellow-600': bill.status === 'pending',
                  'text-red-600': bill.status === 'overdue'
                }" class="font-medium">
                  {{ bill.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <button
                  @click="openUpdateModal(bill)"
                  class="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm"
                >
                  Update Status
                </button>
              </td>
            </tr>
            <tr v-if="waterBills.length === 0">
              <td colspan="6" class="py-6 text-center text-gray-500 text-sm">No water bills found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Water Bill Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md animate__animated animate__fadeIn">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Add Water Bill</h2>
        <form @submit.prevent="addWaterBill">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Tenant</label>
            <select
              v-model="newBill.tenantId"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            >
              <option value="" disabled>Select Tenant</option>
              <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                {{ tenant.first_name }} {{ tenant.last_name }} ({{ tenant.house_number }})
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Amount (KES)</label>
            <input
              v-model="newBill.amount"
              type="number"
              step="0.01"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
            <input
              v-model="newBill.dueDate"
              type="date"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          <div class="flex gap-3">
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-sm font-medium"
              :disabled="loading"
            >
              Add Bill
            </button>
            <button
              type="button"
              @click="showAddModal = false"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md animate__animated animate__fadeIn">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Update Bill Status</h2>
        <form @submit.prevent="updateBillStatus">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              v-model="updateStatus.status"
              class="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div class="flex gap-3">
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium"
              :disabled="loading"
            >
              Update Status
            </button>
            <button
              type="button"
              @click="showUpdateModal = false"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__fadeIn { animation-duration: 0.5s; }
.animate__delay-1s { animation-delay: 0.3s; }

::-webkit-scrollbar {
  height: 6px;
  width: 6px;
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

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// State for employees and pagination
const employees = ref([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
})
const loading = ref(false)
const error = ref(null)

// State for modals
const showDeactivateModal = ref(false)
const showPayModal = ref(false)
const selectedEmployee = ref(null)

// Pay modal form state
const payPhoneNumber = ref('')
const payAmount = ref('')
const payErrors = ref({})

// Router
const router = useRouter()

// Fetch employees from backend
const fetchEmployees = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('http://localhost:8080/api/v1/employees', {
      params: {
        page,
        limit: pagination.value.limit,
      },
    })
    employees.value = response.data.data.map(emp => ({
      ...emp,
      name: `${emp.first_name} ${emp.last_name}`,
      position: emp.position || 'N/A', // Default if position isn't in backend model
      isActive: emp.is_active !== false, // Default to true if not provided
    }))
    pagination.value = response.data.meta
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch employees'
    console.error('Fetch employees error:', err)
  } finally {
    loading.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchEmployees()
})

// Change page
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    pagination.value.page = newPage
    fetchEmployees(newPage)
  }
}

// Navigate to add employee page
const addEmployee = () => {
  router.push('/dashboard/employees/add')
}

// Deactivate employee
const deactivateEmployee = (employee) => {
  selectedEmployee.value = employee
  showDeactivateModal.value = true
}

const confirmDeactivate = async () => {
  if (selectedEmployee.value) {
    try {
      await axios.patch(`http://localhost:8080/api/v1/employees/deactivate/${selectedEmployee.value.id}`, { is_active: false })
      employees.value = employees.value.map(emp =>
        emp.id === selectedEmployee.value.id ? { ...emp, isActive: false } : emp
      )
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to deactivate employee'
      console.error('Deactivate employee error:', err)
    }
  }
  showDeactivateModal.value = false
  selectedEmployee.value = null
}

// Pay employee
const payEmployee = (employee) => {
  selectedEmployee.value = employee
  payPhoneNumber.value = employee.phone_number || '' // Pre-fill with employee's phone number
  payAmount.value = ''
  payErrors.value = {}
  showPayModal.value = true
}

// Validate pay form
const validatePayForm = () => {
  payErrors.value = {}
  if (!payPhoneNumber.value.trim()) {
    payErrors.value.phoneNumber = 'Phone number is required'
  } else if (!/^\+?\d{10,}$/.test(payPhoneNumber.value.trim())) {
    payErrors.value.phoneNumber = 'Invalid phone number (e.g., +254123456789)'
  }
  if (!payAmount.value) {
    payErrors.value.amount = 'Amount is required'
  } else if (isNaN(payAmount.value) || Number(payAmount.value) <= 0) {
    payErrors.value.amount = 'Amount must be a positive number'
  }
  return Object.keys(payErrors.value).length === 0
}

// Confirm payment
const confirmPay = async () => {
  if (validatePayForm()) {
    try {
      await axios.post(`http://localhost:8080/api/v1/employees/${selectedEmployee.value.id}/pay`, {
        phone_number: payPhoneNumber.value,
        amount: Number(payAmount.value),
      })
      showPayModal.value = false
      selectedEmployee.value = null
      payPhoneNumber.value = ''
      payAmount.value = ''
      payErrors.value = {}
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to process payment'
      console.error('Payment error:', err)
    }
  }
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Employees</h1>
      <button
        @click="addEmployee"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        Add New Employee
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-600">
      Loading employees...
    </div>

    <!-- Employees Table -->
    <div v-else class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden animate__animated animate__fadeInUp animate__delay-1">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="employee in employees" :key="employee.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ employee.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ employee.position }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span :class="employee.isActive ? 'text-green-600' : 'text-red-600'">
                {{ employee.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                v-if="employee.isActive"
                @click="deactivateEmployee(employee)"
                class="text-red-600 hover:text-red-900 mr-4"
              >
                Deactivate
              </button>
              <button
                @click="payEmployee(employee)"
                class="text-blue-600 hover:text-blue-900"
              >
                Pay
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} employees
      </div>
      <div class="space-x-2">
        <button
          :disabled="pagination.page === 1"
          @click="changePage(pagination.page - 1)"
          class="px-3 py-1 bg-gray-200 rounded-lg"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 1 }"
        >
          Previous
        </button>
        <button
          :disabled="pagination.page === pagination.totalPages"
          @click="changePage(pagination.page + 1)"
          class="px-3 py-1 bg-gray-200 rounded-lg"
          :class="{ 'opacity-50 cursor-not-allowed': pagination.page === pagination.totalPages }"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Deactivate Employee Modal -->
    <div
      v-if="showDeactivateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Deactivate Employee</h2>
        <p class="text-gray-600 mb-4">
          Are you sure you want to deactivate {{ selectedEmployee?.name }}?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeactivateModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="confirmDeactivate"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>

    <!-- Pay Employee Modal -->
    <div
      v-if="showPayModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Pay {{ selectedEmployee?.name }}</h2>
        <form @submit.prevent="confirmPay" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              v-model="payPhoneNumber"
              type="tel"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +254123456789"
              required
            />
            <p v-if="payErrors.phoneNumber" class="text-sm text-red-600 mt-1">{{ payErrors.phoneNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              v-model="payAmount"
              type="number"
              min="0"
              step="0.01"
              class="w-full border-gray-300 p-2 py-2.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              required
            />
            <p v-if="payErrors.amount" class="text-sm text-red-600 mt-1">{{ payErrors.amount }}</p>
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showPayModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
.animate__delay-1 { animation-delay: 0.2s; }
</style>

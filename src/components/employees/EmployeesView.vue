<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import apiClient from '../../services/apiClient' 

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

// Router and toast
const router = useRouter()
const toast = useToast()

// Fetch employees from backend
const fetchEmployees = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const response = await apiClient.get('/employees', {
      params: {
        page,
        limit: pagination.value.limit,
      },
    })
    employees.value = response.data.data.map(emp => ({
      ...emp,
      name: `${emp.first_name} ${emp.last_name}`,
      position: emp.position || 'N/A',
      isActive: emp.is_active !== false,
    }))
    pagination.value = response.data.meta
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch employees'
    console.error('Fetch employees error:', err)
    toast.error(error.value)
    employees.value = [] // Ensure empty array on error
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

// Navigate to view employee details page
const viewEmployeeDetails = (employeeId) => {
  router.push(`/dashboard/employees/${employeeId}`)
}

// Deactivate employee
const deactivateEmployee = (employee) => {
  selectedEmployee.value = employee
  showDeactivateModal.value = true
}

const confirmDeactivate = async () => {
  if (selectedEmployee.value) {
    try {
      await apiClient.patch(`/employees/deactivate/${selectedEmployee.value.id}`, { is_active: false })
      employees.value = employees.value.map(emp =>
        emp.id === selectedEmployee.value.id ? { ...emp, isActive: false } : emp
      )
      toast.success(`Employee ${selectedEmployee.value.name} deactivated`)
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to deactivate employee'
      toast.error(error.value)
    }
  }
  showDeactivateModal.value = false
  selectedEmployee.value = null
}

// Pay employee
const payEmployee = (employee) => {
  selectedEmployee.value = employee
  payPhoneNumber.value = employee.phone_number || ''
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
      await apiClient.post(`/employees/${selectedEmployee.value.id}/pay`, {
        phone_number: payPhoneNumber.value,
        amount: Number(payAmount.value),
      })
      toast.success(`Payment of KES ${payAmount.value} sent to ${selectedEmployee.value.name}`)
      showPayModal.value = false
      selectedEmployee.value = null
      payPhoneNumber.value = ''
      payAmount.value = ''
      payErrors.value = {}
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to process payment'
      toast.error(error.value)
    }
  }
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto bg-white min-h-screen">
    <header class="mb-6 flex justify-between items-center animate__animated animate__fadeIn">
      <h1 class="text-2xl font-semibold text-gray-900 flex items-center">
        <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a2 2 0 00-2-2h-3m-8 0H4a2 2 0 00-2 2v2h5m5-16a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
        Employees
      </h1>
      <button
        @click="addEmployee"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Add New Employee
      </button>
    </header>

    <div v-if="error" class="mb-6 p-4 bg-red-100 text-red-600 rounded-md flex items-center animate__animated animate__fadeIn">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>

    <div
      v-else-if="employees.length === 0 && !loading"
      class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center animate__animated animate__fadeIn"
    >
      <svg class="w-16 h-16 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <p class="text-gray-600 mb-6 text-lg">No employees found. Start by adding your first employee!</p>
      <button
        @click="addEmployee"
        class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Add Employee
      </button>
    </div>

    <section v-else class="bg-white rounded-lg shadow-lg border border-gray-200 animate__animated animate__fadeIn">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="employee in employees" :key="employee.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ employee.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ employee.position.toUpperCase() }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="employee.isActive ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                  {{ employee.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm font-medium flex space-x-3 items-center">
                <button
                  @click="viewEmployeeDetails(employee.id)"
                  class="text-gray-600 hover:text-blue-700 flex items-center transition-colors"
                  title="View Details"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button
                  v-if="employee.isActive"
                  @click="deactivateEmployee(employee)"
                  class="text-red-600 hover:text-red-700 flex items-center transition-colors"
                  title="Deactivate Employee"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Deactivate
                </button>
                <button
                  @click="payEmployee(employee)"
                  class="text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                  title="Pay Employee"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2m7-2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Pay
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 border-t border-gray-100">
        <span>
          Showing {{ Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total) }} to
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} employees
        </span>
        <div class="flex items-center space-x-1">
          <button
            :disabled="pagination.page === 1 || loading"
            @click="changePage(pagination.page - 1)"
            class="px-3 py-1 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            v-for="page in Math.min(pagination.totalPages, 5)"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-4 py-1 rounded-md',
              pagination.page === page ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
            :disabled="loading"
          >
            {{ page }}
          </button>
          <button
            :disabled="pagination.page === pagination.totalPages || loading"
            @click="changePage(pagination.page + 1)"
            class="px-3 py-1 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="showDeactivateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform scale-100 animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Deactivate Employee
        </h2>
        <p class="text-gray-700 mb-6">
          Are you sure you want to deactivate **{{ selectedEmployee?.name }}**? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeactivateModal = false"
            class="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDeactivate"
            class="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-md"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showPayModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform scale-100 animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2m7-2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Pay {{ selectedEmployee?.name }}
        </h2>
        <form @submit.prevent="confirmPay" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              v-model="payPhoneNumber"
              type="tel"
              class="w-full border-gray-300 rounded-md p-2.5 focus:ring-blue-600 focus:border-blue-600 text-gray-900"
              placeholder="e.g., +254712345678"
              required
            />
            <p v-if="payErrors.phoneNumber" class="text-sm text-red-600 mt-1">{{ payErrors.phoneNumber }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
            <input
              v-model="payAmount"
              type="number"
              min="0"
              step="0.01"
              class="w-full border-gray-300 rounded-md p-2.5 focus:ring-blue-600 focus:border-blue-600 text-gray-900"
              placeholder="Enter amount"
              required
            />
            <p v-if="payErrors.amount" class="text-sm text-red-600 mt-1">{{ payErrors.amount }}</p>
          </div>
          <div class="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              @click="showPayModal = false"
              class="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';
/* Ensure animations are smooth */
.animate__animated.animate__fadeIn, .animate__animated.animate__zoomIn {
  animation-duration: 0.3s;
}

table {
  width: 100%;
  table-layout: auto;
}

th, td {
  padding: 0.75rem 1rem; /* Slightly more padding */
}

td {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  td {
    max-width: 100px;
  }
}
</style>

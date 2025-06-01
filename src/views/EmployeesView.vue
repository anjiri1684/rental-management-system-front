<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Dummy employee data
const employees = ref([
  { id: 1, name: 'John Kamau', position: 'Caretaker', isActive: true },
  { id: 2, name: 'Mary Wanjiku', position: 'Cleaner', isActive: true },
  { id: 3, name: 'Peter Omondi', position: 'Watchman', isActive: true },
  { id: 4, name: 'Susan Achieng', position: 'Cleaner', isActive: false },
])

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

// Navigate to add employee page
const addEmployee = () => {
  router.push('/dashboard/employees/add')
}

// Deactivate employee
const deactivateEmployee = (employee) => {
  selectedEmployee.value = employee
  showDeactivateModal.value = true
}

const confirmDeactivate = () => {
  if (selectedEmployee.value) {
    employees.value = employees.value.map(emp =>
      emp.id === selectedEmployee.value.id ? { ...emp, isActive: false } : emp
    )
  }
  showDeactivateModal.value = false
  selectedEmployee.value = null
}

// Pay employee
const payEmployee = (employee) => {
  selectedEmployee.value = employee
  payPhoneNumber.value = '' // Reset form
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
const confirmPay = () => {
  if (validatePayForm()) {
    // Placeholder for payment logic
    console.log({
      employee: selectedEmployee.value.name,
      phoneNumber: payPhoneNumber.value,
      amount: payAmount.value,
    })
    showPayModal.value = false
    selectedEmployee.value = null
    payPhoneNumber.value = ''
    payAmount.value = ''
    payErrors.value = {}
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

    <!-- Employees Table -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden animate__animated animate__fadeInUp animate__delay-1">
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

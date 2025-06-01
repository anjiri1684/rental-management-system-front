<script setup>
import { ref } from 'vue'

// Dummy account data
const accountBalance = ref(150000) // Total balance in KES
const transactions = ref([
  { id: 1, date: '2025-05-28', description: 'Rent Payment - John Kamau', amount: 25000, type: 'Credit' },
  { id: 2, date: '2025-05-27', description: 'Water Bill Payment', amount: -5000, type: 'Debit' },
  { id: 3, date: '2025-05-25', description: 'Tenant Deposit - Mary Wanjiku', amount: 30000, type: 'Credit' },
  { id: 4, date: '2025-05-20', description: 'Maintenance Expense', amount: -15000, type: 'Debit' },
])

// State for modals
const showAddFundsModal = ref(false)
const showWithdrawFundsModal = ref(false)
const showReportsModal = ref(false)
const addFundsAmount = ref('')
const withdrawFundsAmount = ref('')

// Quick actions
const addFunds = () => {
  showAddFundsModal.value = true
}

const withdrawFunds = () => {
  showWithdrawFundsModal.value = true
}

const viewReports = () => {
  showReportsModal.value = true
}

const confirmAddFunds = () => {
  if (addFundsAmount.value && !isNaN(addFundsAmount.value)) {
    accountBalance.value += parseFloat(addFundsAmount.value)
    transactions.value.unshift({
      id: transactions.value.length + 1,
      date: new Date().toISOString().split('T')[0],
      description: 'Funds Added',
      amount: parseFloat(addFundsAmount.value),
      type: 'Credit',
    })
  }
  showAddFundsModal.value = false
  addFundsAmount.value = ''
}

const confirmWithdrawFunds = () => {
  if (withdrawFundsAmount.value && !isNaN(withdrawFundsAmount.value)) {
    const amount = parseFloat(withdrawFundsAmount.value)
    if (amount <= accountBalance.value) {
      accountBalance.value -= amount
      transactions.value.unshift({
        id: transactions.value.length + 1,
        date: new Date().toISOString().split('T')[0],
        description: 'Funds Withdrawn',
        amount: -amount,
        type: 'Debit',
      })
    } else {
      alert('Insufficient funds')
    }
  }
  showWithdrawFundsModal.value = false
  withdrawFundsAmount.value = ''
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">Main Account</h1>
      <div class="space-x-4">
        <button
          @click="addFunds"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Add Funds
        </button>
        <button
          @click="withdrawFunds"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300"
        >
          Withdraw Funds
        </button>
        <button
          @click="viewReports"
          class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
        >
          View Reports
        </button>
      </div>
    </div>

    <!-- Account Balance Card -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-6 mb-6 animate__animated animate__fadeInUp">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Account Balance</h2>
      <p class="text-3xl font-bold text-blue-600">KES {{ accountBalance.toLocaleString() }}</p>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden animate__animated animate__fadeInUp animate__delay-1">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (KES)</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm"
                :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ transaction.amount.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.type }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Funds Modal -->
    <div
      v-if="showAddFundsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Add Funds</h2>
        <form @submit.prevent="confirmAddFunds">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
            <input
              v-model="addFundsAmount"
              type="number"
              min="0"
              step="0.01"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showAddFundsModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Funds
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Withdraw Funds Modal -->
    <div
      v-if="showWithdrawFundsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Withdraw Funds</h2>
        <form @submit.prevent="confirmWithdrawFunds">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
            <input
              v-model="withdrawFundsAmount"
              type="number"
              min="0"
              step="0.01"
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showWithdrawFundsModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Withdraw Funds
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reports Modal -->
    <div
      v-if="showReportsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">View Reports</h2>
        <p class="text-gray-600 mb-4">This feature is under development.</p>
        <div class="flex justify-end">
          <button
            @click="showReportsModal = false"
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

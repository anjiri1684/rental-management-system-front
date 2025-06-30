<script setup>
import { ref, onMounted }
from 'vue'
import {
  useRouter
}
from 'vue-router'
import axios from 'axios'
import {
  useToast
}
from 'vue-toastification'
import {
  User,
  Mail,
  Phone,
  Hash,
  Home,
  Layers,
  Eye,
  Edit,
  PlusCircle
}
from 'lucide-vue-next'

// State for tenants and pagination
const tenants = ref([])
const pagination = ref({
  page: 1,
  limit: 5, // Consistent with Payments.vue
  total: 0,
  totalPages: 0,
})
const loading = ref(false)
const error = ref(null)

// Router and Toast
const router = useRouter()
const toast = useToast()

// Fetch tenants from backend
const fetchTenants = async (page = 1) => {
  loading.value = true
  error.value = null
  try {
    const response = await axios.get('http://localhost:8080/api/v1/tenants', {
      params: {
        page,
        limit: pagination.value.limit,
      },
    })
    tenants.value = response.data.data.map(tenant => ({
      ...tenant,
      firstName: tenant.first_name,
      lastName: tenant.last_name,
      phoneNumber: tenant.phone_number,
      idNumber: tenant.id_number,
      houseNumber: tenant.house_number,
      unitType: tenant.unit_type,
      nextOfKinFirstName: tenant.next_of_kin_first_name,
      nextOfKinLastName: tenant.next_of_kin_last_name,
      nextOfKinPhone: tenant.next_of_kin_phone,
    }))
    pagination.value = response.data.meta
    pagination.value.totalPages = Math.ceil(pagination.value.total / pagination.value.limit)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch tenants'
    console.error('Fetch tenants error:', err)
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Change page
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    pagination.value.page = newPage
    fetchTenants(newPage)
  }
}

// Navigate to tenant details
const viewTenantDetails = (tenantId) => {
  router.push(`/dashboard/tenants/${tenantId}`)
}

// Navigate to add tenant page
const addTenant = () => {
  router.push('/dashboard/add-tenants')
}

// Initial fetch
onMounted(() => {
  fetchTenants()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 animate__animated animate__fadeIn">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4 md:mb-0">Tenant Management</h1>
      <button @click="addTenant"
        class="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-lg">
        <PlusCircle class="w-4 h-4" />
        Add New Tenant
      </button>
    </div>

    <div v-if="error"
      class="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-3 animate__animated animate__bounceIn border border-red-200">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p class="font-semibold">Error:</p>
        <p>{{ error }}</p>
      </div>
    </div>

    <div
      class="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 animate__animated animate__fadeIn animate__delay-1s border border-gray-100">
      <div class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-4 text-white mb-6 shadow-md">
        <h2 class="text-xl font-semibold">All Tenants ({{ pagination.total }})</h2>
        <p class="text-sm opacity-90">Overview of all registered tenant information.</p>
      </div>

      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="tenants.length" class="overflow-x-auto">
        <table class="min-w-full text-left bg-white rounded-lg">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><User class="w-4 h-4" /> Name</div>
              </th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Mail class="w-4 h-4" /> Email</div>
              </th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Phone class="w-4 h-4" /> Phone</div>
              </th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Hash class="w-4 h-4" /> ID Number</div>
              </th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Home class="w-4 h-4" /> House</div>
              </th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Layers class="w-4 h-4" /> Unit Type</div>
              </th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </div>
              </th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tenant in tenants" :key="tenant.id"
              class="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
              @click="viewTenantDetails(tenant.id)">
              <td class="py-3 px-4 text-gray-800">{{ tenant.firstName }} {{ tenant.lastName }}</td>
              <td class="py-3 px-4 text-gray-800">{{ tenant.email }}</td>
              <td class="py-3 px-4 text-gray-800">{{ tenant.phoneNumber }}</td>
              <td class="py-3 px-4 text-gray-800">{{ tenant.idNumber }}</td>
              <td class="py-3 px-4 text-gray-800">{{ tenant.houseNumber }}</td>
              <td class="py-3 px-4 text-gray-800">{{ tenant.unitType }}</td>
              <td class="py-3 px-4">
                <span :class="{
                    'bg-green-100 text-green-700 border border-green-200': tenant.is_active,
                    'bg-red-100 text-red-700 border border-red-200': !tenant.is_active
                  }" class="px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  {{ tenant.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-3 px-4 flex flex-wrap gap-2">
                <button @click.stop="viewTenantDetails(tenant.id)"
                  class="px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 hover:scale-105 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md">
                  <Eye class="w-3 h-3" /> Details
                </button>
                <button @click.stop="router.push(`/dashboard/tenants/edit/${tenant.id}`)"
                  class="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md">
                  <Edit class="w-3 h-3" /> Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-6 text-center text-gray-500 text-lg">
        <p class="mb-2">No tenants found.</p>
        <p class="text-sm">Click "Add New Tenant" to get started.</p>
      </div>

      <div v-if="pagination.total > 0"
        class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="text-sm text-gray-700">
          Showing <span class="font-semibold">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> to
          <span class="font-semibold">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of
          <span class="font-semibold">{{ pagination.total }}</span> tenants
        </div>
        <div class="flex flex-wrap justify-center gap-2 items-center">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1 || loading"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 hover:scale-105 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <div class="flex gap-1">
            <button v-for="p in pagination.totalPages" :key="p" @click="changePage(p)" :class="{
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm': true,
                'bg-blue-600 text-white hover:bg-blue-700': p === pagination.page,
                'bg-gray-200 text-gray-800 hover:bg-gray-300': p !== pagination.page
              }">
              {{ p }}
            </button>
          </div>
          <button @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages || loading"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 hover:scale-105 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'animate.css';

/* Animation durations */
.animate__fadeIn {
  animation-duration: 0.6s;
}

.animate__delay-1s {
  animation-delay: 0.2s;
}

.animate__bounceIn {
  animation-duration: 0.6s;
}

/* Smooth scrollbar for table overflow */
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  /* Tailwind gray-300 */
  border-radius: 9999px;
}

::-webkit-scrollbar-track {
  background: #f8f8f8;
  /* Lighter track */
  border-radius: 9999px;
}

/* Table row hover effect */
tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* General card hover effect */
.bg-white\/95:hover {
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.08), 0 5px 10px -2px rgba(0, 0, 0, 0.03);
}

/* Focus ring for accessibility */
*:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  /* Tailwind blue-500 with opacity */
}

/* Responsive adjustments */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  white-space: nowrap;
  /* Prevent text wrapping in table cells */
}

@media (max-width: 640px) {

  .p-4 {
    padding: 1rem;
  }

  .sm:p-6 {
    padding: 1.5rem;
  }

  .md:p-8 {
    padding: 2rem;
  }

  .text-2xl {
    font-size: 1.5rem;
  }

  .md\:text-3xl {
    font-size: 1.875rem;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .md\:mb-0 {
    margin-bottom: 0;
  }

  .flex-col {
    flex-direction: column;
  }

  .md\:flex-row {
    flex-direction: row;
  }

  .items-start {
    align-items: flex-start;
  }

  .md\:items-center {
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-3 {
    gap: 0.75rem;
  }

  /* Table specific adjustments for small screens */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #eee;
    margin-bottom: 0.625rem;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
    text-align: right;
  }

  td:last-child {
    border-bottom: 0;
  }

  td:before {
    position: absolute;
    top: 0;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    text-align: left;
    font-weight: 600;
    color: #4b5563;
    /* Tailwind gray-700 */
  }

  /* Labeling for small screen table cells */
  td:nth-of-type(1):before {
    content: "Name:";
  }

  td:nth-of-type(2):before {
    content: "Email:";
  }

  td:nth-of-type(3):before {
    content: "Phone:";
  }

  td:nth-of-type(4):before {
    content: "ID Number:";
  }

  td:nth-of-type(5):before {
    content: "House:";
  }

  td:nth-of-type(6):before {
    content: "Unit Type:";
  }

  td:nth-of-type(7):before {
    content: "Status:";
  }

  td:nth-of-type(8):before {
    content: "Actions:";
  }
}
</style>

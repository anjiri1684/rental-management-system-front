<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import {
  User, Mail, Phone, Hash, Home, Layers, Eye, Edit, PlusCircle, LogOut, Bug,
  Loader2, Info, CheckCircle, XCircle // Added new icons for better visual cues
} from 'lucide-vue-next'

// State for tenants, apartments, and pagination
const tenants = ref([])
const apartments = ref([])
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
})
const loading = ref(false)
const loadingApartments = ref(false) // Not directly used in UI but good to have
const error = ref(null)

// Confirmation modal state
const showConfirmModal = ref(false)
const confirmAction = ref(null)
const confirmMessage = ref('')
const confirmTenantId = ref(null)

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
        status: 'all',
      },
    })
    tenants.value = response.data.data.map(tenant => {
      console.log('Tenant Data:', tenant)
      return {
        id: tenant.id,
        firstName: tenant.first_name,
        lastName: tenant.last_name,
        email: tenant.email,
        phoneNumber: tenant.phone_number,
        idNumber: tenant.id_number,
        houseNumber: tenant.house_number || 'N/A',
        unitType: tenant.unit_type || 'N/A',
        apartmentId: tenant.apartment_id,
        isActive: tenant.is_active,
        nextOfKinFirstName: tenant.next_of_kin_first_name,
        nextOfKinLastName: tenant.next_of_kin_last_name,
        nextOfKinPhone: tenant.next_of_kin_phone,
      }
    })
    pagination.value = response.data.meta
    pagination.value.totalPages = Math.ceil(pagination.value.total / pagination.value.limit)
    console.log('Mapped Tenants:', tenants.value)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch tenants.'
    console.error('Fetch tenants error:', err)
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Fetch available apartments (for debugging, optional)
const fetchApartments = async () => {
  loadingApartments.value = true
  try {
    const response = await axios.get('http://localhost:8080/api/v1/apartments?status=vacant')
    apartments.value = response.data.data || []
    console.log('Vacant Apartments:', apartments.value)
    if (apartments.value.length === 0) {
      toast.warning('No vacant apartments available for allocation.')
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch apartments.'
    console.error('Error fetching apartments:', err)
    toast.error(error.value)
  } finally {
    loadingApartments.value = false
  }
}

// Confirm and vacate tenant
const confirmVacate = async (tenantId) => {
  loading.value = true
  error.value = null
  const tenant = tenants.value.find(t => t.id === tenantId)
  try {
    await axios.patch(`http://localhost:8080/api/v1/tenants/${tenantId}`, {
      is_active: false,
    })
    // Update local state immediately for a snappier UI
    if (tenant) {
      tenant.isActive = false
      tenant.houseNumber = 'N/A'
      tenant.unitType = 'N/A'
      tenant.apartmentId = null
    }
    toast.success(`Tenant ${tenant?.firstName} ${tenant?.lastName} vacated successfully!`)
    showConfirmModal.value = false // Close modal
    // No need to fetch all tenants if local state is updated, but might be good for consistency
    // fetchTenants(pagination.value.page) // Refresh tenant list
    fetchApartments() // Refresh apartments for debugging (optional)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to vacate tenant.'
    console.error('Vacate tenant error:', err)
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Show confirmation modal
const showConfirmation = (action, tenantId) => {
  confirmTenantId.value = tenantId
  confirmAction.value = action
  if (action === 'vacate') {
    const tenant = tenants.value.find(t => t.id === tenantId)
    confirmMessage.value = `Are you sure you want to vacate <span class="font-bold">${tenant?.firstName} ${tenant?.lastName}</span> from ${tenant?.houseNumber !== 'N/A' ? `<span class="font-bold">${tenant?.houseNumber}</span>` : 'their current house'}? This action cannot be undone.`
  }
  showConfirmModal.value = true
}

// Confirm action
const confirmActionHandler = async () => {
  if (confirmAction.value === 'vacate') {
    await confirmVacate(confirmTenantId.value)
  }
  showConfirmModal.value = false
  confirmTenantId.value = null
  confirmAction.value = null
  confirmMessage.value = ''
}

// Debug apartments
const debugApartments = () => {
  console.log('Debug - Current Vacant Apartments:', apartments.value)
  toast.info(`Vacant Apartments: ${apartments.value.length} found. Check console for details.`)
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
  fetchApartments() // Optional, for debugging
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 animate__animated animate__fadeIn">
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 md:mb-0">Tenant Management</h1>
      <div class="flex flex-wrap gap-3">
        <button @click="addTenant"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-[1.02] focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-base font-medium flex items-center gap-2">
          <PlusCircle class="w-5 h-5" />
          Add New Tenant
        </button>
        <button @click="debugApartments"
          class="px-5 py-2.5 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 hover:scale-[1.02] focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-base font-medium flex items-center gap-2">
          <Bug class="w-5 h-5" />
          Debug Apartments
        </button>
      </div>
    </div>

    <div v-if="error"
      class="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-start gap-3 border border-red-200 shadow-sm animate__animated animate__shakeX">
      <XCircle class="w-6 h-6 text-red-600 flex-shrink-0" />
      <div>
        <p class="font-bold text-lg">Error:</p>
        <p class="text-md">{{ error }}</p>
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100 animate__animated animate__fadeIn animate__delay-0_5s">
      <div class="bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg p-5 text-white mb-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-1">All Tenants ({{ pagination.total }})</h2>
        <p class="text-base opacity-90">An overview of all registered tenant information, including their housing status.</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <Loader2 class="w-16 h-16 text-blue-600 animate-spin-slow mb-4" />
        <p class="text-lg text-gray-700 font-medium">Loading tenants data...</p>
      </div>

      <div v-else-if="tenants.length" class="overflow-x-auto custom-scrollbar">
        <table class="min-w-full text-left bg-white rounded-lg border-collapse">
          <thead class="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider rounded-tl-lg">
                <div class="flex items-center gap-2"><User class="w-4 h-4" /> Name</div>
              </th>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Mail class="w-4 h-4" /> Email</div>
              </th>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Phone class="w-4 h-4" /> Phone</div>
              </th>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Hash class="w-4 h-4" /> ID Number</div>
              </th>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Home class="w-4 h-4" /> House</div>
              </th>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><Layers class="w-4 h-4" /> Unit Type</div>
              </th>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">
                <div class="flex items-center gap-2"><CheckCircle class="w-4 h-4" /> Status</div>
              </th>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider">Actions</th>
              <th class="py-3.5 px-4 font-semibold text-sm text-gray-700 uppercase tracking-wider rounded-tr-lg">Manage House</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tenant in tenants" :key="tenant.id"
              class="border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-all duration-200">
              <td class="py-3 px-4 text-gray-800 cursor-pointer" @click="viewTenantDetails(tenant.id)">
                <div class="font-medium text-gray-900">{{ tenant.firstName }} {{ tenant.lastName }}</div>
              </td>
              <td class="py-3 px-4 text-gray-700 cursor-pointer text-sm" @click="viewTenantDetails(tenant.id)">
                {{ tenant.email }}
              </td>
              <td class="py-3 px-4 text-gray-700 cursor-pointer text-sm" @click="viewTenantDetails(tenant.id)">
                {{ tenant.phoneNumber }}
              </td>
              <td class="py-3 px-4 text-gray-700 cursor-pointer text-sm" @click="viewTenantDetails(tenant.id)">
                {{ tenant.idNumber }}
              </td>
              <td class="py-3 px-4 text-gray-700 cursor-pointer text-sm" @click="viewTenantDetails(tenant.id)">
                {{ tenant.houseNumber }}
              </td>
              <td class="py-3 px-4 text-gray-700 cursor-pointer text-sm" @click="viewTenantDetails(tenant.id)">
                {{ tenant.unitType }}
              </td>
              <td class="py-3 px-4">
                <span :class="{
                    'bg-green-100 text-green-700 border border-green-200': tenant.isActive,
                    'bg-red-100 text-red-700 border border-red-200': !tenant.isActive
                  }" class="px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm inline-flex items-center gap-1">
                  <CheckCircle v-if="tenant.isActive" class="w-3 h-3" />
                  <XCircle v-else class="w-3 h-3" />
                  {{ tenant.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-3 px-4 flex flex-wrap gap-2">
                <button @click.stop="viewTenantDetails(tenant.id)"
                  class="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 hover:scale-105 focus:ring-4 focus:ring-green-300 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md">
                  <Eye class="w-3.5 h-3.5" /> Details
                </button>
                <button @click.stop="router.push(`/dashboard/tenants/edit/${tenant.id}`)"
                  class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md">
                  <Edit class="w-3.5 h-3.5" /> Edit
                </button>
              </td>
              <td class="py-3 px-4">
                <div v-if="!tenant.isActive" class="flex items-center gap-2">
                  <button
                    @click.stop="router.push(`/dashboard/tenants/${tenant.id}/allocate-house`)"
                    class="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 hover:scale-105 focus:ring-4 focus:ring-purple-300 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md"
                  >
                    Allocate House
                  </button>
                </div>
                <div v-else class="flex items-center gap-2">
                  <button
                    @click.stop="showConfirmation('vacate', tenant.id)"
                    class="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 hover:scale-105 focus:ring-4 focus:ring-red-300 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md"
                    :disabled="loading"
                  >
                    <LogOut class="w-3.5 h-3.5" /> Vacate
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-8 text-center text-gray-500 text-lg rounded-lg bg-gray-50 border border-gray-200">
        <p class="mb-3 font-semibold">No tenants found.</p>
        <p class="text-base">It looks like there are no tenant records here yet. Click the "<span class="font-bold text-blue-600">Add New Tenant</span>" button above to get started!</p>
      </div>

      <div v-if="pagination.total > 0"
        class="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <div class="text-sm text-gray-700">
          Showing <span class="font-semibold">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> to
          <span class="font-semibold">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of
          <span class="font-semibold">{{ pagination.total }}</span> tenants
        </div>
        <div class="flex flex-wrap justify-center gap-2 items-center">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1 || loading"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:scale-105 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <div class="flex gap-1">
            <button v-for="p in pagination.totalPages" :key="p" @click="changePage(p)" :class="{
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm': true,
                'bg-blue-600 text-white hover:bg-blue-700': p === pagination.page,
                'bg-gray-200 text-gray-800 hover:bg-gray-300': p !== pagination.page
              }"
              :disabled="loading"
              >
              {{ p }}
            </button>
          </div>
          <button @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages || loading"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:scale-105 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate__animated animate__fadeIn">
      <div class="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl animate__animated animate__zoomIn">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Info class="w-6 h-6 text-yellow-500" /> Confirm Action
        </h2>
        <p class="text-gray-700 text-lg mb-6 leading-relaxed" v-html="confirmMessage"></p>
        <div class="flex justify-end gap-4">
          <button @click="showConfirmModal = false"
            class="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-base font-medium shadow-sm">
            Cancel
          </button>
          <button @click="confirmActionHandler"
            class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-base font-medium shadow-sm"
            :disabled="loading"
            >
            Confirm
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
  animation-duration: 0.7s;
}

.animate__delay-0_5s { /* Custom delay class */
  animation-delay: 0.5s;
}

.animate__shakeX {
  animation-duration: 0.8s;
}

.animate__zoomIn {
  animation-duration: 0.4s;
}

/* Custom spin animation for loader */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}

/* Smooth scrollbar for table overflow */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* Tailwind gray-400 */
  border-radius: 9999px; /* Full rounded */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; /* Tailwind gray-100 */
  border-radius: 9999px;
}

/* Table row hover effect */
tbody tr:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* Responsive adjustments for table (Mobile First) */
@media (max-width: 767px) { /* Smaller than md breakpoint */
  .p-4 { padding: 1rem; }
  .sm\:p-6 { padding: 1.5rem; }

  /* Stack table rows */
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #e2e8f0; /* gray-200 */
    margin-bottom: 1rem;
    border-radius: 0.75rem; /* rounded-lg */
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08); /* subtle shadow */
  }

  td {
    border: none;
    border-bottom: 1px solid #f1f5f9; /* gray-100 */
    position: relative;
    padding-left: 50%; /* Make space for the label */
    text-align: right;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  td:last-child {
    border-bottom: 0;
  }

  td:before {
    position: absolute;
    top: 0;
    left: 1rem; /* Padding from the left */
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    text-align: left;
    font-weight: 600; /* font-semibold */
    color: #4b5563; /* gray-700 */
    padding-top: 0.75rem;
  }
  /* Labels for mobile table */
  td:nth-of-type(1):before { content: "Name:"; }
  td:nth-of-type(2):before { content: "Email:"; }
  td:nth-of-type(3):before { content: "Phone:"; }
  td:nth-of-type(4):before { content: "ID Number:"; }
  td:nth-of-type(5):before { content: "House:"; }
  td:nth-of-type(6):before { content: "Unit Type:"; }
  td:nth-of-type(7):before { content: "Status:"; }
  td:nth-of-type(8):before { content: "Actions:"; }
  td:nth-of-type(9):before { content: "Manage House:"; }

  /* Adjust actions column for better stacking */
  td:nth-of-type(8), td:nth-of-type(9) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    gap: 0.5rem;
  }
}

/* General focus ring for accessibility */
*:focus-visible {
  outline: 2px solid;
  outline-offset: 2px;
  outline-color: #60a5fa; /* Tailwind blue-400 */
}
</style>

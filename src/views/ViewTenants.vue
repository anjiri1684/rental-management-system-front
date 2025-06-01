<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const tenants = ref([
  {
    id: 1,
    firstName: 'John',
    lastName: 'Kamau',
    email: 'john.kamau@example.com',
    phoneNumber: '+254123456789',
    idNumber: '12345678',
    houseNumber: 'A1',
    unitType: 'One Bedroom',
    nextOfKinFirstName: 'Jane',
    nextOfKinLastName: 'Doe',
    nextOfKinPhone: '+254987654321',
  },
  {
    id: 2,
    firstName: 'Mary',
    lastName: 'Wanjiku',
    email: 'mary.wanjiku@example.com',
    phoneNumber: '+254234567890',
    idNumber: '87654321',
    houseNumber: 'B2',
    unitType: 'Bedsitter',
    nextOfKinFirstName: 'Peter',
    nextOfKinLastName: 'Omondi',
    nextOfKinPhone: '+254876543210',
  },
])

// State for modals
const showVacateModal = ref(false)
const showDetailsModal = ref(false)
const selectedTenant = ref(null)

// Router
const router = useRouter()

// Navigate to edit page
const editTenant = (tenantId) => {
  router.push(`/dashboard/tenants/edit/${tenantId}`)
}

// Open vacate confirmation modal
const openVacateModal = (tenant) => {
  selectedTenant.value = tenant
  showVacateModal.value = true
}

// Open details modal
const openDetailsModal = (tenant) => {
  selectedTenant.value = tenant
  showDetailsModal.value = true
}

// Confirm vacate action
const confirmVacate = () => {
  console.log(`Vacating tenant: ${selectedTenant.value.firstName} ${selectedTenant.value.lastName}`)
  tenants.value = tenants.value.filter((tenant) => tenant.id !== selectedTenant.value.id)

  // Reset modal state
  showVacateModal.value = false
  selectedTenant.value = null
}

// Navigate to add tenant page
const addTenant = () => {
  router.push('/dashboard/add-tenants')
}
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 animate__animated animate__fadeInDown">
      <h1 class="text-3xl font-bold text-gray-900">View Tenants</h1>
      <div class="flex space-x-4">
        <button
          @click="addTenant"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Add Tenant
        </button>
      </div>
    </div>

    <!-- Tenants Table -->
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg overflow-hidden animate__animated animate__fadeInUp">
      <h2 class="text-xl font-semibold text-gray-900 p-4">
        Tenants ({{ tenants.length }})
      </h2>
      <div v-if="tenants.length" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tenant in tenants" :key="tenant.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ tenant.firstName }} {{ tenant.lastName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenant.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenant.phoneNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenant.idNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenant.houseNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tenant.unitType }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="openDetailsModal(tenant)"
                  class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 mr-2"
                >
                  View Details
                </button>
                <button
                  @click="editTenant(tenant.id)"
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 mr-2"
                >
                  Edit
                </button>
                <button
                  @click="openVacateModal(tenant)"
                  class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  Vacate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-6 text-center text-gray-500">
        No tenants found.
      </div>
    </div>

    <!-- Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-lg w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Tenant Details</h2>
        <div class="space-y-4 text-gray-600">
          <p><strong>Name:</strong> {{ selectedTenant?.firstName }} {{ selectedTenant?.lastName }}</p>
          <p><strong>Email:</strong> {{ selectedTenant?.email }}</p>
          <p><strong>Phone Number:</strong> {{ selectedTenant?.phoneNumber }}</p>
          <p><strong>ID Number:</strong> {{ selectedTenant?.idNumber }}</p>
          <p><strong>House Number:</strong> {{ selectedTenant?.houseNumber }}</p>
          <p><strong>Unit Type:</strong> {{ selectedTenant?.unitType }}</p>
          <p><strong>Next of Kin:</strong> {{ selectedTenant?.nextOfKinFirstName }} {{ selectedTenant?.nextOfKinLastName }} ({{ selectedTenant?.nextOfKinPhone }})</p>
        </div>
        <div class="flex justify-end mt-6">
          <button
            @click="showDetailsModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Vacate Confirmation Modal -->
    <div
      v-if="showVacateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full animate__animated animate__zoomIn">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Vacate</h2>
        <p class="text-gray-600 mb-4">
          Are you sure you want to vacate {{ selectedTenant?.firstName }} {{ selectedTenant?.lastName }} from {{ selectedTenant?.unitType }} {{ selectedTenant?.houseNumber }}?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showVacateModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="confirmVacate"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Vacate
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

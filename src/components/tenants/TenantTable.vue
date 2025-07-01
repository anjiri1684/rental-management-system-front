<script setup>
import { defineProps, defineEmits } from 'vue';
import { User, Mail, Phone, Hash, Home, Layers, Eye, Edit, LogOut, CheckCircle, XCircle } from 'lucide-vue-next';

const props = defineProps({
  tenants: {
    type: Array,
    required: true,
    // --- FIX: Add a default empty array to ensure it's never undefined ---
    default: () => []
  },
  apartments: {
    type: Array,
    required: true,
    default: () => [] // Also good practice for other array props
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingApartments: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'viewTenantDetails',
  'editTenant',
  'showAllocateConfirmation',
  'showVacateConfirmation'
]);

// Handle selected apartment for allocation within this component
// This state will be managed per tenant row
const handleSelectedApartment = (tenant, event) => {
  tenant.selectedApartmentId = event.target.value;
};
</script>

<template>
  <div v-if="props.loading" class="flex items-center justify-center h-64">
    <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else-if="props.tenants.length > 0" class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full text-left bg-white">
      <thead class="bg-gray-100 border-b border-gray-200">
        <tr>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">
            <div class="flex items-center gap-2"><User class="w-4 h-4" /> Name</div>
          </th>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">
            <div class="flex items-center gap-2"><Mail class="w-4 h-4" /> Email</div>
          </th>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">
            <div class="flex items-center gap-2"><Phone class="w-4 h-4" /> Phone</div>
          </th>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">
            <div class="flex items-center gap-2"><Hash class="w-4 h-4" /> ID Number</div>
          </th>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">
            <div class="flex items-center gap-2"><Home class="w-4 h-4" /> House</div>
          </th>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">
            <div class="flex items-center gap-2"><Layers class="w-4 h-4" /> Unit Type</div>
          </th>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">
            <div class="flex items-center gap-2">
              <CheckCircle class="w-4 h-4" />
              Status
            </div>
          </th>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">Actions</th>
          <th class="py-3 px-4 font-semibold text-xs text-gray-700 uppercase tracking-wider">Manage House</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tenant in props.tenants" :key="tenant.id"
          class="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 group">
          <td class="py-3 px-4 text-gray-800">
            <span class="font-medium text-blue-700 group-hover:underline cursor-pointer"
              @click="emit('viewTenantDetails', tenant.id)">
              {{ tenant.firstName }} {{ tenant.lastName }}
            </span>
          </td>
          <td class="py-3 px-4 text-gray-600">{{ tenant.email }}</td>
          <td class="py-3 px-4 text-gray-600">{{ tenant.phoneNumber }}</td>
          <td class="py-3 px-4 text-gray-600">{{ tenant.idNumber }}</td>
          <td class="py-3 px-4 text-gray-600">
            <span v-if="tenant.houseNumber">{{ tenant.houseNumber }}</span>
            <span v-else class="text-gray-400 italic">N/A</span>
          </td>
          <td class="py-3 px-4 text-gray-600">
            <span v-if="tenant.unitType">{{ tenant.unitType }}</span>
            <span v-else class="text-gray-400 italic">N/A</span>
          </td>
          <td class="py-3 px-4">
            <span :class="{
                'bg-green-100 text-green-700 border border-green-200': tenant.isActive,
                'bg-red-100 text-red-700 border border-red-200': !tenant.isActive
              }" class="px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center justify-center gap-1">
              <CheckCircle v-if="tenant.isActive" class="w-3 h-3" />
              <XCircle v-else class="w-3 h-3" />
              {{ tenant.isActive ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="py-3 px-4 flex flex-wrap gap-2">
            <button @click.stop="emit('viewTenantDetails', tenant.id)"
              class="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 hover:scale-105 focus:ring-4 focus:ring-green-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md">
              <Eye class="w-3 h-3" /> Details
            </button>
            <button @click.stop="emit('editTenant', tenant.id)"
              class="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md">
              <Edit class="w-3 h-3" /> Edit
            </button>
          </td>
          <td class="py-3 px-4">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <select
                :value="tenant.selectedApartmentId"
                @change="handleSelectedApartment(tenant, $event)"
                class="w-full sm:w-40 border-gray-300 px-3 py-1.5 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                :disabled="props.loading || props.loadingApartments || props.apartments.length === 0 || tenant.houseNumber"
              >
                <option value="" disabled>Select an apartment</option>
                <option v-for="apartment in props.apartments" :key="apartment.id" :value="apartment.id">
                  {{ apartment.house_number }} ({{ apartment.unit_type }})
                </option>
              </select>
              <button
                @click.stop="emit('showAllocateConfirmation', tenant.id, tenant.selectedApartmentId)"
                class="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 hover:scale-105 focus:ring-4 focus:ring-purple-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md w-full sm:w-auto justify-center"
                :disabled="props.loading || props.loadingApartments || props.apartments.length === 0 || !tenant.selectedApartmentId || tenant.houseNumber"
              >
                Allocate
              </button>
              <button
                @click.stop="emit('showVacateConfirmation', tenant.id)"
                class="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 hover:scale-105 focus:ring-4 focus:ring-red-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 shadow-md w-full sm:w-auto justify-center"
                :disabled="props.loading || !tenant.houseNumber"
              >
                <LogOut class="w-3 h-3" /> Vacate
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="p-6 text-center text-gray-500 text-lg rounded-lg border border-gray-200 bg-gray-50">
    <p class="mb-2">No tenants found matching your criteria.</p>
    <p class="text-sm">Try adjusting your search or click "Add New Tenant" to get started.</p>
  </div>
</template>

<style scoped>
/* Add any specific styles for TenantTable here if needed */
/* Most table styles can remain in the parent for now */

/* Responsive adjustments for table - these will be important here */
@media (max-width: 640px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  tr {
    border: 1px solid #eee;
    margin-bottom: 0.75rem; /* Increased margin for better separation */
    border-radius: 0.5rem;
    overflow: hidden;
    padding: 0.75rem; /* Added padding to rows */
  }
  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
    text-align: right;
    padding-top: 0.5rem; /* Adjust padding for mobile */
    padding-bottom: 0.5rem; /* Adjust padding for mobile */
  }
  td:last-child {
    border-bottom: 0;
  }
  td:before {
    position: absolute;
    top: 50%;
    left: 1rem; /* Increased left padding for label */
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    text-align: left;
    font-weight: 600;
    color: #4b5563;
    transform: translateY(-50%); /* Vertically align label */
  }

  /* Specific labels for mobile table */
  td:nth-of-type(1):before { content: "Name:"; }
  td:nth-of-type(2):before { content: "Email:"; }
  td:nth-of-type(3):before { content: "Phone:"; }
  td:nth-of-type(4):before { content: "ID Number:"; }
  td:nth-of-type(5):before { content: "House:"; }
  td:nth-of-type(6):before { content: "Unit Type:"; }
  td:nth-of-type(7):before { content: "Status:"; }
  td:nth-of-type(8):before { content: "Actions:"; }
  td:nth-of-type(9):before { content: "Manage House:"; }

  /* Adjust select and buttons on mobile for "Manage House" column */
  td:nth-of-type(9) .flex {
    flex-direction: column;
    align-items: stretch;
  }
  td:nth-of-type(9) select,
  td:nth-of-type(9) button {
    width: 100%;
    margin-top: 0.5rem;
  }
  td:nth-of-type(9) button:first-of-type {
    margin-top: 0; /* Remove top margin for the first button in the column */
  }
}
</style>

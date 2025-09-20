<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '../../services/apiClient'; // Import the API client
import { useToast } from 'vue-toastification';
import { User, Mail, Phone, Hash, Home, Layers, Edit, LogOut, AlertCircle, ArrowLeft } from 'lucide-vue-next';

// Reactive state variables
const tenant = ref(null);
const loading = ref(false);
const error = ref(null);
const showVacateModal = ref(false);

// Router and Toast
const router = useRouter();
const route = useRoute();
const toast = useToast();

// Function to fetch tenant details
const fetchTenant = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get(`/tenants/${route.params.id}`);
    tenant.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to fetch tenant details.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

// Function to confirm and vacate tenant
const confirmVacate = async () => {
  loading.value = true;
  error.value = null;
  try {
    await apiClient.patch(`/tenants/${route.params.id}`, {
      is_active: false,
    });
    tenant.value.is_active = false; // Update local state immediately
    toast.success(`Tenant ${tenant.value.first_name} ${tenant.value.last_name} vacated successfully!`);
    showVacateModal.value = false; // Close modal
    router.push('/dashboard/tenants'); // Redirect to tenants list
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to vacate tenant.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

// Function to navigate to edit page
const goToEditTenant = () => {
  router.push(`/dashboard/tenants/edit/${route.params.id}`);
};

// Function to open the vacate confirmation modal
const openVacateModal = () => {
  showVacateModal.value = true;
};

// Fetch tenant details on component mount
onMounted(fetchTenant);
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 animate__animated animate__fadeIn">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4 md:mb-0">Tenant Details</h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button @click="router.push('/dashboard/tenants')"
          class="px-5 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 hover:scale-105 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-md">
          <ArrowLeft class="w-4 h-4" />
          Back to Tenants
        </button>

        <button v-if="!loading && tenant?.is_active" @click="goToEditTenant"
          class="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-md">
          <Edit class="w-4 h-4" />
          Edit Tenant
        </button>

        <button v-if="!loading && tenant?.is_active" @click="openVacateModal"
          class="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-105 focus:ring-4 focus:ring-red-200 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-md">
          <LogOut class="w-4 h-4" />
          Vacate Tenant
        </button>
      </div>
    </div>

    <div
      class="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 md:p-8 animate__animated animate__fadeIn animate__delay-1s border border-gray-100">
      <div v-if="loading" class="flex flex-col items-center justify-center h-64 text-blue-600">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-lg font-medium">Loading tenant details...</p>
      </div>

      <div v-else-if="error"
        class="p-6 bg-red-100 text-red-700 rounded-lg flex flex-col items-center justify-center gap-3 border border-red-200 text-center animate__animated animate__bounceIn">
        <AlertCircle class="w-10 h-10 text-red-500" />
        <p class="font-semibold text-lg">Error:</p>
        <p class="text-base">{{ error }}</p>
        <button @click="fetchTenant"
          class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 text-sm font-medium">
          Try Again
        </button>
      </div>

      <div v-else-if="tenant" class="space-y-8">
        <div class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-5 text-white shadow-md flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-1">{{ tenant.first_name }} {{ tenant.last_name }}</h2>
            <p class="text-sm opacity-90">Tenant ID: <span class="font-semibold">#{{ tenant.id }}</span></p>
          </div>
          <span :class="{
            'bg-green-100 text-green-700 border border-green-200': tenant.is_active,
            'bg-red-100 text-red-700 border border-red-200': !tenant.is_active
          }" class="px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
            {{ tenant.is_active ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-100">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <Mail class="w-6 h-6 text-blue-600" />
              <div>
                <p class="text-sm font-medium text-gray-600">Email Address</p>
                <p class="text-gray-900 font-medium">{{ tenant.email || 'N/A' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <Phone class="w-6 h-6 text-blue-600" />
              <div>
                <p class="text-sm font-medium text-gray-600">Phone Number</p>
                <p class="text-gray-900 font-medium">{{ tenant.phone_number || 'N/A' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <Hash class="w-6 h-6 text-blue-600" />
              <div>
                <p class="text-sm font-medium text-gray-600">ID Number</p>
                <p class="text-gray-900 font-medium">{{ tenant.id_number || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-100">Apartment Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <Home class="w-6 h-6 text-blue-600" />
              <div>
                <p class="text-sm font-medium text-gray-600">House Number</p>
                <p class="text-gray-900 font-medium">{{ tenant.house_number || 'N/A' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <Layers class="w-6 h-6 text-blue-600" />
              <div>
                <p class="text-sm font-medium text-gray-600">Unit Type</p>
                <p class="text-gray-900 font-medium">{{ tenant.unit_type || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-100">Next of Kin Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <User class="w-6 h-6 text-blue-600" />
              <div>
                <p class="text-sm font-medium text-gray-600">Next of Kin Name</p>
                <p class="text-gray-900 font-medium">
                  {{ tenant.next_of_kin_first_name || 'N/A' }} {{ tenant.next_of_kin_last_name || '' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <Phone class="w-6 h-6 text-blue-600" />
              <div>
                <p class="text-sm font-medium text-gray-600">Next of Kin Phone</p>
                <p class="text-gray-900 font-medium">{{ tenant.next_of_kin_phone || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-6 text-center text-gray-500 text-lg">
        <p class="mb-2">No tenant details available.</p>
        <p class="text-sm">Please check the ID or go back to the tenant list.</p>
      </div>
    </div>

    <div v-if="showVacateModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate__animated animate__fadeIn animate__faster">
      <div
        class="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full animate__animated animate__zoomIn animate__faster border border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center">Confirm Vacate</h2>
        <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-6" />
        <p class="text-gray-700 mb-8 text-center text-lg">
          Are you sure you want to **vacate {{ tenant?.first_name }} {{ tenant?.last_name }}**
          from **{{ tenant?.unit_type || 'Unit' }} {{ tenant?.house_number || 'N/A' }}**?
          This action will mark the tenant as inactive.
        </p>
        <div class="flex justify-center gap-4">
          <button @click="showVacateModal = false"
            class="px-6 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-400 hover:scale-105 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-base font-medium shadow-sm">
            Cancel
          </button>
          <button @click="confirmVacate"
            class="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-105 focus:ring-4 focus:ring-red-200 transition-all duration-300 text-base font-medium flex items-center gap-2 shadow-sm"
            :disabled="loading">
            <LogOut class="w-5 h-5" />
            {{ loading ? 'Vacating...' : 'Confirm Vacate' }}
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

.animate__zoomIn {
  animation-duration: 0.3s;
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Card hover effect */
.bg-white\/95:hover {
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.08), 0 5px 10px -2px rgba(0, 0, 0, 0.03);
}

/* Focus ring for accessibility */
*:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  /* Tailwind blue-500 with opacity */
}

/* Responsive adjustments for information display */
@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }

  .md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .lg\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>

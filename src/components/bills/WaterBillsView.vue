<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../../services/apiClient';

// Import child components
import WaterBillTable from './WaterBillTable.vue';
import AddWaterBillModal from './AddWaterBillModal.vue';
import UpdateWaterBillStatusModal from './UpdateWaterBillStatusModal.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import ErrorMessage from './ErrorMessage.vue';

const toast = useToast();
const waterBills = ref([]);
const tenants = ref([]);
const loadingWaterBills = ref(false); // Specific loading for fetching bills
const loadingTenants = ref(false); // Specific loading for fetching tenants
const isAddingBill = ref(false); // Loading for adding a new bill
const isUpdatingStatus = ref(false); // Loading for updating bill status
const errorMessage = ref('');
const showAddModal = ref(false);
const showUpdateModal = ref(false);

const newBill = ref({
  tenantId: '',
  currentReading: '',
});

const updateStatus = ref({
  id: null,
  status: '',
});

// --- API Calls ---

const fetchTenants = async () => {
  loadingTenants.value = true;
  try {
    const response = await apiClient.get('/tenants');
    tenants.value = response.data.data || [];
    if (!tenants.value.length) {
      toast.warning('No tenants available. Please add tenants first.');
    }
  } catch (error) {
    console.error('Error fetching tenants:', error.response?.data || error.message);
    errorMessage.value = error.response?.data?.error || 'Failed to fetch tenants.';
    toast.error(errorMessage.value);
  } finally {
    loadingTenants.value = false;
  }
};

const fetchWaterBills = async () => {
  loadingWaterBills.value = true;
  try {
    const response = await apiClient.get('/bills');
    waterBills.value = response.data.data || [];
    if (!waterBills.value.length && !errorMessage.value) { // Only show if no other error is present
      errorMessage.value = 'No water bills found.';
    } else if (waterBills.value.length > 0) {
      errorMessage.value = ''; // Clear error if bills are found
    }
  } catch (error) {
    console.error('Error fetching water bills:', error.response?.data || error.message);
    errorMessage.value = error.response?.data?.error || 'Failed to fetch water bills.';
    toast.error(errorMessage.value);
  } finally {
    loadingWaterBills.value = false;
  }
};

const addWaterBill = async (billData) => {
  isAddingBill.value = true;
  try {
    const payload = {
      tenant_id: parseInt(billData.tenantId),
      current_reading: parseFloat(billData.currentReading),
    };
    const response = await apiClient.post('/tenants/water-bills', payload);
    toast.success(response.data.message || 'Water bill added successfully!');
    showAddModal.value = false;
    newBill.value = { tenantId: '', currentReading: '' }; // Reset form
    fetchWaterBills(); // Refresh the list
  } catch (error) {
    console.error('Error adding water bill:', error.response?.data || error.message);
    toast.error(error.response?.data?.error || 'Failed to add water bill.');
  } finally {
    isAddingBill.value = false;
  }
};

const updateBillStatus = async (statusData) => {
  isUpdatingStatus.value = true;
  try {
    await apiClient.patch(`/bills/${statusData.id}/status`, {
      status: statusData.status,
    });
    toast.success('Bill status updated successfully!');
    showUpdateModal.value = false;
    updateStatus.value = { id: null, status: '' }; // Reset form
    fetchWaterBills(); // Refresh the list
  } catch (error) {
    console.error('Error updating bill status:', error.response?.data || error.message);
    toast.error(error.response?.data?.error || 'Failed to update bill status.');
  } finally {
    isUpdatingStatus.value = false;
  }
};

// --- Modal Handlers ---

const openAddModal = () => {
  newBill.value = { tenantId: '', currentReading: '' }; // Ensure clean form
  showAddModal.value = true;
};

const openUpdateModal = (bill) => {
  updateStatus.value = { id: bill.id, status: bill.status };
  showUpdateModal.value = true;
};

// --- Lifecycle Hook ---

onMounted(() => {
  fetchTenants();
  fetchWaterBills();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-8 font-inter">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate__animated animate__fadeIn">
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Water Bills Management</h1>
        <p class="text-gray-600 text-md mt-2">Efficiently manage and track water bills for your tenants.</p>
      </div>
      <button
        @click="openAddModal"
        class="mt-6 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-base font-semibold flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add New Water Bill
      </button>
    </div>

    <!-- Error Message Component -->
    <ErrorMessage v-if="errorMessage" :message="errorMessage" class="mb-6" />

    <!-- Loading Indicator for main data fetch -->
    <div v-if="loadingWaterBills || loadingTenants" class="text-center py-12">
      <LoadingSpinner />
      <span class="text-gray-600 mt-3 block">Loading water bills and tenant data...</span>
    </div>

    <!-- Water Bills Table Component -->
    <WaterBillTable
      v-else
      :waterBills="waterBills"
      @update-status="openUpdateModal"
      class="animate__animated animate__fadeInUp animate__delay-1s"
    />

    <!-- Add Water Bill Modal Component -->
    <AddWaterBillModal
      :show="showAddModal"
      :tenants="tenants"
      :is-loading="isAddingBill"
      @close="showAddModal = false"
      @add-bill="addWaterBill"
    />

    <!-- Update Status Modal Component -->
    <UpdateWaterBillStatusModal
      :show="showUpdateModal"
      :bill-to-update="updateStatus"
      :is-loading="isUpdatingStatus"
      @close="showUpdateModal = false"
      @update-status="updateBillStatus"
    />
  </div>
</template>

<style>
/* Global styles or font imports */
@import 'animate.css';
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* gray-300 */
  border-radius: 9999px;
}
::-webkit-scrollbar-track {
  background: #f8fafc; /* gray-50 */
  border-radius: 9999px;
}
</style>

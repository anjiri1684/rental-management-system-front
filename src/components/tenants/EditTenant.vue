<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { User, Mail, Phone, Hash, Home, Layers, Save, XCircle, ArrowLeft } from 'lucide-vue-next';

// Reactive state variables
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  idNumber: '',
  houseNumber: '',
  unitType: '', // This will be bound to the select input
  nextOfKinFirstName: '',
  nextOfKinLastName: '',
  nextOfKinPhone: '',
});
const loading = ref(false);
const error = ref(null);

// Predefined unit types
const unitTypes = ref([
  'Bedsitter',
  'Single Room',
  'One Bedroom',
  'Two Bedroom',
  'Three Bedroom',
  'Studio',
  'Penthouse'
]);

// Router and Toast
const router = useRouter();
const route = useRoute();
const toast = useToast();

// Function to fetch tenant details and populate the form
const fetchTenantForEdit = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`http://localhost:8080/api/v1/tenants/${route.params.id}`);
    const tenantData = response.data.data;
    // Map backend snake_case to camelCase for form fields
    form.value = {
      firstName: tenantData.first_name,
      lastName: tenantData.last_name,
      email: tenantData.email,
      phoneNumber: tenantData.phone_number,
      idNumber: tenantData.id_number,
      houseNumber: tenantData.house_number,
      unitType: tenantData.unit_type, // Populate with existing unit type
      nextOfKinFirstName: tenantData.next_of_kin_first_name,
      nextOfKinLastName: tenantData.next_of_kin_last_name,
      nextOfKinPhone: tenantData.next_of_kin_phone,
    };
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to load tenant for editing.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

// Function to update tenant details
const updateTenant = async () => {
  loading.value = true;
  error.value = null;
  try {
    await axios.patch(`http://localhost:8080/api/v1/tenants/${route.params.id}`, {
      first_name: form.value.firstName,
      last_name: form.value.lastName,
      email: form.value.email,
      phone_number: form.value.phoneNumber,
      id_number: form.value.idNumber,
      house_number: form.value.houseNumber,
      unit_type: form.value.unitType, // Send the selected unit type
      next_of_kin_first_name: form.value.nextOfKinFirstName,
      next_of_kin_last_name: form.value.nextOfKinLastName,
      next_of_kin_phone: form.value.nextOfKinPhone,
    });
    toast.success('Tenant updated successfully!');
    router.push(`/dashboard/tenants/${route.params.id}`); // Redirect back to details page
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to update tenant.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

// Function to cancel editing and go back
const cancelEdit = () => {
  router.push(`/dashboard/tenants/${route.params.id}`);
};

// Fetch tenant details on component mount
onMounted(fetchTenantForEdit);
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 animate__animated animate__fadeIn">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4 md:mb-0">Edit Tenant Details</h1>
      <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
        <button @click="cancelEdit"
          class="px-5 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 hover:scale-105 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-md">
          <ArrowLeft class="w-4 h-4" />
          Back to Details
        </button>
      </div>
    </div>

    <div
      class="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-6 md:p-8 animate__animated animate__fadeIn animate__delay-1s border border-gray-100">
      <div v-if="loading" class="flex flex-col items-center justify-center h-64 text-blue-600">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-lg font-medium">Loading tenant data for editing...</p>
      </div>

      <div v-else-if="error"
        class="p-6 bg-red-100 text-red-700 rounded-lg flex flex-col items-center justify-center gap-3 border border-red-200 text-center animate__animated animate__bounceIn">
        <AlertCircle class="w-10 h-10 text-red-500" />
        <p class="font-semibold text-lg">Error:</p>
        <p class="text-base">{{ error }}</p>
        <button @click="fetchTenantForEdit"
          class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 text-sm font-medium">
          Try Again
        </button>
      </div>

      <form v-else @submit.prevent="updateTenant" class="space-y-8">
        <div class="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-5 text-white shadow-md">
          <h2 class="text-2xl font-bold">Update Tenant Information</h2>
          <p class="text-sm opacity-90">Modify the tenant's details below.</p>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-100">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="firstName" v-model="form.firstName" type="text"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter first name" required />
              </div>
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="lastName" v-model="form.lastName" type="text"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter last name" required />
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="email" v-model="form.email" type="email"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter email" />
              </div>
            </div>
            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div class="relative">
                <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="phoneNumber" v-model="form.phoneNumber" type="tel"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter phone number" required />
              </div>
            </div>
            <div>
              <label for="idNumber" class="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
              <div class="relative">
                <Hash class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="idNumber" v-model="form.idNumber" type="text"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter ID number" required />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-100">Apartment Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="houseNumber" class="block text-sm font-medium text-gray-700 mb-1">House Number</label>
              <div class="relative">
                <Home class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="houseNumber" v-model="form.houseNumber" type="text"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter house number" required />
              </div>
            </div>
            <div>
              <label for="unitType" class="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
              <div class="relative">
                <Layers class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select id="unitType" v-model="form.unitType"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                  required>
                  <option value="" disabled selected>Select a unit type</option>
                  <option v-for="type in unitTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-100">Next of Kin Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nextOfKinFirstName" class="block text-sm font-medium text-gray-700 mb-1">Next of Kin First
                Name</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="nextOfKinFirstName" v-model="form.nextOfKinFirstName" type="text"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter NOK first name" />
              </div>
            </div>
            <div>
              <label for="nextOfKinLastName" class="block text-sm font-medium text-gray-700 mb-1">Next of Kin Last Name</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="nextOfKinLastName" v-model="form.nextOfKinLastName" type="text"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter NOK last name" />
              </div>
            </div>
            <div>
              <label for="nextOfKinPhone" class="block text-sm font-medium text-gray-700 mb-1">Next of Kin Phone Number</label>
              <div class="relative">
                <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="nextOfKinPhone" v-model="form.nextOfKinPhone" type="tel"
                  class="pl-11 pr-3 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter NOK phone number" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button type="button" @click="cancelEdit"
            class="px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 hover:scale-105 focus:ring-4 focus:ring-gray-300 transition-all duration-300 text-base font-medium flex items-center gap-2 shadow-md">
            <XCircle class="w-5 h-5" />
            Cancel
          </button>
          <button type="submit"
            class="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-200 transition-all duration-300 text-base font-medium flex items-center gap-2 shadow-md"
            :disabled="loading">
            <Save class="w-5 h-5" />
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
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

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Card hover effect */
.bg-white\/95:hover {
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.08), 0 5px 10px -2px rgba(0, 0, 0, 0.03);
}

/* Input/Select focus style */
input:focus,
select:focus {
  border-color: #3b82f6;
  /* Tailwind blue-500 */
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.5);
  /* Tailwind blue-300 with opacity */
}

/* General focus ring for accessibility */
*:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  /* Tailwind blue-500 with opacity */
}

/* Icon padding for inputs and select */
input.pl-11,
select.pl-11 {
  padding-left: 2.75rem;
}

/* Custom dropdown arrow for select */
select.appearance-none {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }

  .md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>

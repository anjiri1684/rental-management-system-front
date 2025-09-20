<script setup>
import { ref, watch } from 'vue' 
import { useRouter } from 'vue-router'
import apiClient from '../../services/apiClient' // Import the API client
import { useToast } from 'vue-toastification'

// Form state
const apartmentName = ref('')
const houseRanges = ref([]) // Array to hold multiple house ranges
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const loading = ref(false)

// Unit types
const unitTypes = ref([
  'Bedsitter',
  'Single Room',
  'One Bedroom',
  'Two Bedroom',
  'Three Bedroom',
  'Studio',
  'Penthouse'
])

// Form errors (nested structure for houseRanges)
const errors = ref({
  apartmentName: null,
  houseRanges: []
})

// Router and Toast
const router = useRouter()
const toast = useToast()

// Add an initial empty house range when component mounts
const addInitialHouseRange = () => {
    if (houseRanges.value.length === 0) {
        addHouseRange();
    }
};

// Add a new empty house range row
const addHouseRange = () => {
  houseRanges.value.push({
    id: Date.now(), // Simple unique ID for keying
    startHouseNumber: '',
    endHouseNumber: '',
    unitType: null,
    rentAmount: ''
  })
  errors.value.houseRanges.push({
    startHouseNumber: null,
    endHouseNumber: null,
    unitType: null,
    rentAmount: null,
    rangeOverlap: null // New error field for range overlaps
  })
}

// Remove a house range row by index
const removeHouseRange = (index) => {
  houseRanges.value.splice(index, 1)
  errors.value.houseRanges.splice(index, 1)
  // Re-validate all ranges after removal to catch potential new overlaps
  validateHouseRanges()
}

// Validation function for a single house range
const validateSingleHouseRange = (range, index) => {
    let hasError = false;
    const rangeErrors = {};

    if (!range.startHouseNumber || !String(range.startHouseNumber).trim()) {
        rangeErrors.startHouseNumber = 'Required';
        hasError = true;
    }
    if (!range.endHouseNumber || !String(range.endHouseNumber).trim()) {
        rangeErrors.endHouseNumber = 'Required';
        hasError = true;
    }

    const start = parseInt(range.startHouseNumber);
    const end = parseInt(range.endHouseNumber);

    if (isNaN(start) || isNaN(end)) {
        rangeErrors.startHouseNumber = rangeErrors.endHouseNumber = 'Must be a number';
        hasError = true;
    } else if (start <= 0 || end <= 0) {
        rangeErrors.startHouseNumber = rangeErrors.endHouseNumber = 'Must be positive';
        hasError = true;
    } else if (start > end) {
        rangeErrors.startHouseNumber = 'Cannot be greater than end';
        rangeErrors.endHouseNumber = 'Cannot be less than start';
        hasError = true;
    }

    if (!range.unitType) {
        rangeErrors.unitType = 'Required';
        hasError = true;
    }
    if (!range.rentAmount || isNaN(parseFloat(range.rentAmount)) || parseFloat(range.rentAmount) <= 0) {
        rangeErrors.rentAmount = 'Must be a positive number';
        hasError = true;
    }

    errors.value.houseRanges[index] = rangeErrors;
    return !hasError;
};

// Validation function for all house ranges, including overlaps
const validateHouseRanges = () => {
    let allRangesValid = true;
    const definedRanges = [];

    houseRanges.value.forEach((range, index) => {
        // Validate individual range fields first
        const isSingleRangeValid = validateSingleHouseRange(range, index);
        if (!isSingleRangeValid) {
            allRangesValid = false;
        }

        const start = parseInt(range.startHouseNumber);
        const end = parseInt(range.endHouseNumber);

        // Prepare for overlap check if valid numbers
        if (!isNaN(start) && !isNaN(end) && start <= end) {
            definedRanges.push({ start, end, index });
        }
    });

    // Reset overlap errors
    errors.value.houseRanges.forEach((err) => (err.rangeOverlap = null));

    // Check for overlaps among defined ranges
    for (let i = 0; i < definedRanges.length; i++) {
        for (let j = i + 1; j < definedRanges.length; j++) {
            const rangeA = definedRanges[i];
            const rangeB = definedRanges[j];

            // Overlap detection logic: [startA, endA] and [startB, endB] overlap if (startA <= endB AND startB <= endA)
            if (rangeA.start <= rangeB.end && rangeB.start <= rangeA.end) {
                errors.value.houseRanges[rangeA.index].rangeOverlap = 'Range overlaps with another.';
                errors.value.houseRanges[rangeB.index].rangeOverlap = 'Range overlaps with another.';
                allRangesValid = false;
            }
        }
    }
    return allRangesValid;
};

// Master validation function
const validateForm = () => {
  errors.value.apartmentName = null
  let formIsValid = true

  if (!apartmentName.value.trim()) {
    errors.value.apartmentName = 'Apartment name is required'
    formIsValid = false
  }

  if (houseRanges.value.length === 0) {
    toast.error('At least one house range is required.')
    return false; // No ranges means no valid submission
  }

  const allRangesValid = validateHouseRanges();
  if (!allRangesValid) {
    formIsValid = false;
  }

  if (!formIsValid) {
    toast.error('Please correct the form errors')
  }

  return formIsValid
}

// Watch for changes in houseRanges to trigger range validation
watch(houseRanges, () => {
    validateHouseRanges();
}, { deep: true });

// Handle form submission
const submitForm = () => {
  if (validateForm()) {
    showConfirmModal.value = true
  }
}

// Confirm submission
const confirmSubmit = async () => {
  loading.value = true
  const apartmentsToCreate = []

  // Flatten the houseRanges into individual apartment objects
  houseRanges.value.forEach(range => {
    const start = parseInt(range.startHouseNumber)
    const end = parseInt(range.endHouseNumber)

    for (let i = start; i <= end; i++) {
      const formattedHouseNumber = String(i).padStart(2, '0') // Ensures "01", "02" etc.
      apartmentsToCreate.push({
        apartmentName: apartmentName.value,
        houseNumber: formattedHouseNumber,
        unitType: range.unitType,
        rentAmount: parseFloat(range.rentAmount),
      })
    }
  })

  try {
    await apiClient.post('/apartments/batch-add', { apartments: apartmentsToCreate })

    loading.value = false
    showConfirmModal.value = false
    showSuccessModal.value = true
  } catch (error) {
    loading.value = false
    showConfirmModal.value = false
    errorMessage.value = error.response?.data?.error || 'Failed to add apartments'
    if (error.response?.data?.details) {
      errorMessage.value += ` (${error.response.data.details})`
    }
    showErrorModal.value = true
    console.error('Submission error:', error)
  }
}

// Close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false
  resetForm()
  router.push('/dashboard/houses') // Redirect to the apartments list
}

// Close error modal
const closeErrorModal = () => {
  showErrorModal.value = false
  errorMessage.value = ''
}

// Reset form
const resetForm = () => {
  apartmentName.value = ''
  houseRanges.value = [] // Clear all ranges
  errors.value = { // Reset errors to initial state
    apartmentName: null,
    houseRanges: []
  }
  addInitialHouseRange(); // Add back one empty row
}

// Add an initial range on mount
addInitialHouseRange();
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
    <div class="w-full max-w-5xl flex justify-between items-center mb-8 animate__animated animate__fadeInDown">
      <h1 class="text-4xl font-extrabold text-gray-900">Add New Apartment Houses</h1>
      <button
        @click="router.push('/dashboard/houses')"
        class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl shadow-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      >
        Back to Apartments
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-5xl animate__animated animate__fadeInUp animate__delay-1">
      <form @submit.prevent="submitForm" :disabled="loading">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Apartment Details</h2>
        <div class="mb-6">
          <label for="apartmentName" class="block text-sm font-medium text-gray-700 mb-2">Apartment Building Name</label>
          <input
            id="apartmentName"
            v-model="apartmentName"
            type="text"
            class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            placeholder="e.g., Green Valley Apartments"
            :disabled="loading"
          />
          <p v-if="errors.apartmentName" class="text-sm text-red-600 mt-2">{{ errors.apartmentName }}</p>
        </div>

        <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">House Ranges</h3>
        <div v-for="(range, index) in houseRanges" :key="range.id" class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 border border-gray-200 rounded-lg relative">
          <button
            v-if="houseRanges.length > 1"
            type="button"
            @click="removeHouseRange(index)"
            class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg font-bold hover:bg-red-600 transition-colors"
            :disabled="loading"
          >
            &times;
          </button>
          <div>
            <label :for="`startHouseNumber-${index}`" class="block text-sm font-medium text-gray-700 mb-2">Start No.</label>
            <input
              :id="`startHouseNumber-${index}`"
              v-model="range.startHouseNumber"
              type="number"
              min="1"
              class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="e.g., 1"
              :disabled="loading"
            />
            <p v-if="errors.houseRanges[index]?.startHouseNumber" class="text-sm text-red-600 mt-2">{{ errors.houseRanges[index].startHouseNumber }}</p>
          </div>
          <div>
            <label :for="`endHouseNumber-${index}`" class="block text-sm font-medium text-gray-700 mb-2">End No.</label>
            <input
              :id="`endHouseNumber-${index}`"
              v-model="range.endHouseNumber"
              type="number"
              min="1"
              class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="e.g., 50"
              :disabled="loading"
            />
            <p v-if="errors.houseRanges[index]?.endHouseNumber" class="text-sm text-red-600 mt-2">{{ errors.houseRanges[index].endHouseNumber }}</p>
          </div>
          <div class="col-span-2">
            <label :for="`unitType-${index}`" class="block text-sm font-medium text-gray-700 mb-2">Unit Type</label>
            <select
              :id="`unitType-${index}`"
              v-model="range.unitType"
              class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              :disabled="loading"
            >
              <option :value="null" disabled selected>Select unit type</option>
              <option v-for="type in unitTypes" :key="type" :value="type">{{ type }}</option>
            </select>
            <p v-if="errors.houseRanges[index]?.unitType" class="text-sm text-red-600 mt-2">{{ errors.houseRanges[index].unitType }}</p>
          </div>
          <div>
            <label :for="`rentAmount-${index}`" class="block text-sm font-medium text-gray-700 mb-2">Rent Amount</label>
            <input
              :id="`rentAmount-${index}`"
              v-model="range.rentAmount"
              type="number"
              step="0.01"
              class="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              placeholder="e.g., 10000"
              :disabled="loading"
            />
            <p v-if="errors.houseRanges[index]?.rentAmount" class="text-sm text-red-600 mt-2">{{ errors.houseRanges[index].rentAmount }}</p>
          </div>
          <p v-if="errors.houseRanges[index]?.rangeOverlap" class="col-span-full text-sm text-red-600 mt-2 font-semibold animate__animated animate__flash">
            {{ errors.houseRanges[index].rangeOverlap }}
          </p>
        </div>

        <div class="mb-8">
          <button
            type="button"
            @click="addHouseRange"
            class="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            :disabled="loading"
          >
            Add Another House Range
          </button>
        </div>

        <div class="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            :disabled="loading"
          >
            Clear Form
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="loading || !Object.values(errors.apartmentName || {}).every(e => !e) && Object.values(errors.houseRanges).flat().every(e => !e)"
          >
            {{ loading ? 'Submitting...' : 'Add All Houses' }}
          </button>
        </div>
      </form>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate__animated animate__zoomIn">
        <h2 class="text-2xl font-bold text-gray-900 mb-5 text-center">Confirm House Additions</h2>
        <p class="text-gray-700 text-lg text-center mb-6">
          You are about to add multiple house ranges for **{{ apartmentName }}**.
          This will create a total of **{{ houseRanges.reduce((acc, range) => acc + (parseInt(range.endHouseNumber) - parseInt(range.startHouseNumber) + 1 || 0), 0) }}** houses.
          Are you sure you want to proceed?
        </p>
        <div class="flex justify-center space-x-5">
          <button
            @click="showConfirmModal = false"
            class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            @click="confirmSubmit"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Adding...' : 'Confirm Add' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate__animated animate__zoomIn">
        <h2 class="text-2xl font-bold text-green-600 mb-5 text-center">Success!</h2>
        <p class="text-gray-700 text-lg text-center mb-6">
          All houses for **{{ apartmentName }}** have been successfully added. A total of
          **{{ houseRanges.reduce((acc, range) => acc + (parseInt(range.endHouseNumber) - parseInt(range.startHouseNumber) + 1 || 0), 0) }}** houses were created.
        </p>
        <div class="flex justify-center">
          <button
            @click="closeSuccessModal"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Go to Apartments List
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showErrorModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate__animated animate__zoomIn">
        <h2 class="text-2xl font-bold text-red-600 mb-5 text-center">Error!</h2>
        <p class="text-gray-700 text-lg text-center mb-6">{{ errorMessage }}</p>
        <div class="flex justify-center">
          <button
            @click="closeErrorModal"
            class="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Try Again
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

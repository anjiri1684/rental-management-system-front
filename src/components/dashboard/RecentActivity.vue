<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  activities: Array,
  activityCount: Number,
  currentPage: Number,
  totalPages: Number,
  itemsPerPage: Number,
  pageSizeOptions: Array,
  pageNumbers: Array,
  loading: Boolean,
});

const emit = defineEmits(['changePage', 'updateItemsPerPage']);

const handleChangePage = (page) => {
  emit('changePage', page);
};

const handleUpdateItemsPerPage = (event) => {
  emit('updateItemsPerPage', parseInt(event.target.value));
};
</script>

<template>
  <section class="bg-white rounded-lg shadow-md border border-gray-100 animate__animated animate__fadeIn">
    <div class="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-800 flex items-center">
        <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recent Activity ({{ activityCount }})
      </h2>
      <div class="flex items-center space-x-2">
        <label for="itemsPerPage" class="text-sm font-medium text-gray-600">Show:</label>
        <select
          id="itemsPerPage"
          :value="itemsPerPage"
          @change="handleUpdateItemsPerPage"
          class="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
          :disabled="loading"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <tr v-if="activities.length === 0 && !loading">
            <td colspan="4" class="px-4 py-6 text-center text-md text-gray-500">No recent activities to display.</td>
          </tr>
          <tr v-for="activity in activities" :key="activity.id" class="hover:bg-gray-50 transition-colors even:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-700">{{ new Date(activity.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) }}</td>
            <td class="px-4 py-3 text-sm text-gray-700 truncate max-w-xs" :title="activity.description">{{ activity.description }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ activity.type }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ activity.category }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 border-t border-gray-100">
      <span class="text-sm font-medium">
        Showing {{ Math.min((currentPage - 1) * itemsPerPage + 1, activityCount) }} to
        {{ Math.min(currentPage * itemsPerPage, activityCount) }} of {{ activityCount }} activities
      </span>
      <div class="flex items-center space-x-1">
        <button
          :disabled="currentPage === 1 || loading"
          @click="handleChangePage(currentPage - 1)"
          class="pagination-button"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          v-for="page in pageNumbers"
          :key="page"
          @click="handleChangePage(page)"
          :class="[
            'px-3 py-1 rounded-md font-semibold text-sm transition-colors duration-200',
            currentPage === page ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            { 'pointer-events-none opacity-60': loading }
          ]"
          :disabled="loading"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages || loading"
          @click="handleChangePage(currentPage + 1)"
          class="pagination-button"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Table specific styling */
table {
  width: 100%;
  table-layout: fixed; /* Fixed layout for better column width control */
}

th, td {
  padding: 12px 16px; /* Increased padding */
}

td.truncate {
  max-width: 200px; /* Adjust as needed */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) { /* Adjust breakpoint for smaller screens */
  td.truncate {
    max-width: 120px; /* Smaller max-width on mobile */
  }
}

.pagination-button {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.375rem; /* rounded-md */
  transition-property: background-color, color;
  transition-duration: 200ms;
  background-color: #2563eb; /* bg-blue-600 */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover state */
.pagination-button:hover:not(:disabled) {
  background-color: #1d4ed8; /* hover:bg-blue-700 */
}

/* Disabled state */
.pagination-button:disabled {
  background-color: #d1d5db; /* disabled:bg-gray-300 */
  color: #6b7280; /* disabled:text-gray-500 */
  cursor: not-allowed;
}

/* Prevent hover on disabled */
.pagination-button:disabled:hover {
  background-color: #d1d5db; /* disabled:hover:bg-gray-300 */
}

</style>

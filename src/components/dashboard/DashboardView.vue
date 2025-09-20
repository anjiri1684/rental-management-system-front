<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../../services/apiClient';

// Import child components
import DashboardHeader from './DashboardHeader.vue';
import DashboardMetrics from './DashboardMetrics.vue';
import QuickActions from './QuickActions.vue';
import RecentActivity from './RecentActivity.vue';
import GlobalErrorAlert from './GlobalErrorAlert.vue';

// --- Data State ---
const totalTenants = ref(0);
const activeTenants = ref(0);
const accountBalance = ref(0); // Overall account balance
const recentMessages = ref(0);
const pendingTasks = ref(0);
const activities = ref([]);
const adminName = ref('');
const loading = ref(false);
const errorMessage = ref('');

// Pagination state for activities
const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalPages = ref(1);
const pageSizeOptions = [5, 10, 20];

// Time and date state
const currentTime = ref('');
const currentDate = ref('');
const greeting = ref('');

// New state for water bill balance details
const depositPaymentsTotal = ref(0);
const rentPaymentsTotal = ref(0);
const waterBillPaymentsTotal = ref(0);

const router = useRouter();
const toast = useToast();

// --- Computed Properties ---
// These will be passed down as props to child components where needed
const activityCount = computed(() => activities.value?.length || 0);

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return (activities.value || []).slice(start, end);
});

const pageNumbers = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// --- Data Fetching ---
const fetchDashboardData = async (page = 1) => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const [
      tenantStats,
      balance,
      messageStats,
      tasks,
      waterBillBalance,
      activitiesResponse
    ] = await Promise.all([
      apiClient.get('/tenants/stats'),
      apiClient.get('/account/balance'),
      apiClient.get('/messages/stats'),
      apiClient.get('/tasks/pending'),
      apiClient.get('/account/water-bill-balance'),
      apiClient.get('/activities', {
        params: { page, limit: itemsPerPage.value }
      })
    ]);

    totalTenants.value = tenantStats.data?.totalTenants || 0;
    activeTenants.value = tenantStats.data?.activeTenants || 0;
    accountBalance.value = balance.data?.accountBalance || 0;
    recentMessages.value = messageStats.data?.recentMessages || 0;
    pendingTasks.value = tasks.data?.pendingTasks || 0;

    depositPaymentsTotal.value = waterBillBalance.data?.data?.deposit_payments_total || 0;
    rentPaymentsTotal.value = waterBillBalance.data?.data?.rent_payments_total || 0;
    waterBillPaymentsTotal.value = waterBillBalance.data?.data?.water_bill_payments_total || 0;

    activities.value = activitiesResponse.data?.data || [];
    totalPages.value = activitiesResponse.data?.meta?.totalPages || 1;

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    errorMessage.value = error.response?.data?.error || 'Failed to fetch dashboard data';
    toast.error(errorMessage.value);
    activities.value = [];
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

// --- Navigation and Pagination ---
const navigateTo = (path) => {
  router.push(path);
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page;
    fetchDashboardData(page);
  }
};

const updateItemsPerPage = (newSize) => {
  itemsPerPage.value = newSize; // Update itemsPerPage based on event from child
  if (itemsPerPage.value > 0) {
    currentPage.value = 1; // Reset to first page when items per page changes
    fetchDashboardData(1);
  }
};

// --- Time and Greeting Functions ---
const updateGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    greeting.value = 'Good Morning';
  } else if (hour < 18) {
    greeting.value = 'Good Afternoon';
  } else {
    greeting.value = 'Good Evening';
  }
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const dismissError = () => {
  errorMessage.value = '';
};

let timeInterval;
onMounted(() => {
  updateGreeting();
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  fetchDashboardData(currentPage.value);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});
</script>

<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
    <DashboardHeader
      :greeting="greeting"
      :admin-name="adminName"
      :current-date="currentDate"
      :current-time="currentTime"
      @navigate="navigateTo"
    />

    <GlobalErrorAlert :message="errorMessage" @dismiss="dismissError" />

    <div v-if="loading" class="flex justify-center items-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      <p class="ml-3 text-gray-600 text-lg">Loading data...</p>
    </div>

    <DashboardMetrics
      :total-tenants="totalTenants"
      :active-tenants="activeTenants"
      :account-balance="accountBalance"
      :recent-messages="recentMessages"
      :pending-tasks="pendingTasks"
      :deposit-payments-total="depositPaymentsTotal"
      :rent-payments-total="rentPaymentsTotal"
      :water-bill-payments-total="waterBillPaymentsTotal"
    />

    <QuickActions @navigate="navigateTo" />

    <RecentActivity
      :activities="paginatedActivities"
      :activity-count="activityCount"
      :current-page="currentPage"
      :total-pages="totalPages"
      :items-per-page="itemsPerPage"
      :page-size-options="pageSizeOptions"
      :page-numbers="pageNumbers"
      :loading="loading"
      @change-page="changePage"
      @update-items-per-page="updateItemsPerPage"
    />
  </div>
</template>

<style scoped>
@import 'animate.css';

/* Custom animation delays for staggered appearance */
.animate__delay-1s { animation-delay: 0.15s; }
.animate__delay-2s { animation-delay: 0.30s; }
.animate__delay-3s { animation-delay: 0.45s; }
.animate__delay-4s { animation-delay: 0.60s; }
.animate__delay-5s { animation-delay: 0.75s; }
.animate__delay-6s { animation-delay: 0.90s; }
.animate__delay-7s { animation-delay: 1.05s; }

</style>

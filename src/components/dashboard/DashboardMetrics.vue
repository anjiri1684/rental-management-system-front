<script setup>
import { defineProps } from 'vue';

defineProps({
 totalTenants: Number,
 activeTenants: Number,
 accountBalance: Number,
 recentMessages: Number,
 pendingTasks: Number,
 depositPaymentsTotal: Number,
 rentPaymentsTotal: Number,
 waterBillPaymentsTotal: Number,
});
</script>

<template>
 <section class="mb-8">
  <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center animate__animated animate__fadeIn">
   <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
   </svg>
   Financial Overview & Key Metrics
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      <div class="summary-card bg-gradient-to-br from-blue-400 to-blue-500 text-white animate__animated animate__fadeIn">
    <div class="flex-grow">
     <h3 class="text-sm font-medium opacity-80">Total Tenants</h3>
     <p class="text-3xl font-bold mt-1">{{ totalTenants }}</p>
    </div>
    <div class="icon-wrapper bg-blue-500">
     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a2 2 0 00-2-2h-3m-8 0H4a2 2 0 00-2 2v2h5m5-16a4 4 0 100 8 4 4 0 000-8zM12 12a4 4 0 100 8 4 4 0 000-8z"></path>
     </svg>
    </div>
   </div>

      <div class="summary-card bg-gradient-to-br from-green-400 to-green-500 text-white animate__animated animate__fadeIn animate__delay-1s">
    <div class="flex-grow">
     <h3 class="text-sm font-medium opacity-80">Active Tenants</h3>
     <p class="text-3xl font-bold mt-1">{{ activeTenants }}</p>
    </div>
    <div class="icon-wrapper bg-green-500">
     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
     </svg>
    </div>
   </div>

      <div class="summary-card bg-gradient-to-br from-purple-400 to-purple-500 text-white animate__animated animate__fadeIn animate__delay-2s">
    <div class="flex-grow">
     <h3 class="text-sm font-medium opacity-80">Overall Account Balance</h3>
     <p class="text-3xl font-bold mt-1">KES {{ accountBalance.toLocaleString() }}</p>
    </div>
    <div class="icon-wrapper bg-purple-500">
     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
     </svg>
    </div>
   </div>

      <div class="summary-card bg-gradient-to-br from-orange-400 to-orange-500 text-white animate__animated animate__fadeIn animate__delay-3s">
    <div class="flex-grow">
     <h3 class="text-sm font-medium opacity-80">Recent Messages</h3>
     <p class="text-3xl font-bold mt-1">{{ recentMessages }}</p>
    </div>
    <div class="icon-wrapper bg-orange-500">
     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4a2 2 0 012-2h10a2 2 0 012 2v4h-4m-6 0h6"></path>
     </svg>
    </div>
   </div>

      <div class="summary-card bg-gradient-to-br from-red-400 to-red-500 text-white animate__animated animate__fadeIn animate__delay-4s">
    <div class="flex-grow">
     <h3 class="text-sm font-medium opacity-80">Pending Tasks</h3>
     <p class="text-3xl font-bold mt-1">{{ pendingTasks }}</p>
    </div>
    <div class="icon-wrapper bg-red-500">
     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
     </svg>
    </div>
   </div>

      <div class="summary-card bg-gradient-to-br from-teal-400 to-teal-500 text-white animate__animated animate__fadeIn animate__delay-5s">
    <div class="flex-grow">
     <h3 class="text-sm font-medium opacity-80">Total Deposit Payments</h3>
     <p class="text-3xl font-bold mt-1">KES {{ depositPaymentsTotal.toLocaleString() }}</p>
    </div>
    <div class="icon-wrapper bg-teal-500">
     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2"></path>
     </svg>
    </div>
   </div>

      <div class="summary-card bg-gradient-to-br from-indigo-400 to-indigo-500 text-white animate__animated animate__fadeIn animate__delay-6s">
    <div class="flex-grow">
     <h3 class="text-sm font-medium opacity-80">Total Rent Payments</h3>
     <p class="text-3xl font-bold mt-1">KES {{ rentPaymentsTotal.toLocaleString() }}</p>
    </div>
    <div class="icon-wrapper bg-indigo-500">
     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m12 0h.02"></path>
     </svg>
    </div>
   </div>

      <div class="summary-card bg-gradient-to-br from-cyan-400 to-cyan-500 text-white animate__animated animate__fadeIn animate__delay-7s">
    <div class="flex-grow">
     <h3 class="text-sm font-medium opacity-80">Total Water Bill Payments</h3>
     <p class="text-3xl font-bold mt-1">KES {{ waterBillPaymentsTotal.toLocaleString() }}</p>
    </div>
    <div class="icon-wrapper bg-cyan-500">
     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5 5.754 5 4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path>
     </svg>
    </div>
   </div>
  </div>
 </section>
</template>

<style scoped>
.summary-card {
 border-radius: 0.75rem; /* rounded-xl */
 box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
 padding: 1.5rem; /* p-6 */
 display: flex;
 align-items: center;
 transition: all 0.3s ease-in-out;
 cursor: pointer;
 position: relative;
 overflow: hidden;
}

.summary-card:hover {
 transform: translateY(-5px);
 box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
}

.icon-wrapper {
 border-radius: 9999px; /* rounded-full */
 padding: 0.75rem; /* p-3 */
 display: flex;
 align-items: center;
 justify-content: center;
 transition: transform 0.3s ease-in-out;
}

.summary-card:hover .icon-wrapper {
 transform: scale(1.1);
}
</style>

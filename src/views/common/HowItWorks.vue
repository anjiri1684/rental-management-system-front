<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const steps = ref([
  {
    title: 'Register Tenants',
    description: 'Onboard tenants by entering details like name, email, and lease terms. Import data via CSV or CRM tools, with encrypted storage for security.',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 0 0 008 0 0zM3 0 0 0 0112 0v1H3z'
  },
  {
    title: 'Add Properties',
    description: 'Input property details such as address, unit types, rent, and photos. Manage multiple properties and export reports.',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 0 10v10a1 1 0 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h0m-6 0a1 0 0 001-001-001-1h2a1 0 001 1v4a1 001 1m-6 0h6'
  },
  {
    title: 'Link Tenants',
    description: 'Assign tenants to units via drag-and-drop or bulk tools. Track leases and get renewal alerts.',
    icon: 'M13 10V3L4l3 14h7v7l9l-11h-7z'
  },
  {
    title: 'Send Bills',
    description: 'Automate rent and utility billing with email/SMS invoices. Integrate with Mpesa or Banks for payments.',
    icon: 'M3 8l7.89 5.26a2 2 0 002 0L21 2 0 0M5 0 0 0 002-2V7a2 2 0 00-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  {
    title: 'Track Payments',
    description: 'Monitor payments in real-time, get late payment alerts, and export data to QuickBooks.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 0 9 0118 0 0z'
  }
])
</script>

<template>
  <section class="h-screen flex flex-col bg-gradient-to-b from-blue-50 via-gray-100 to-indigo-100 pt-20 pb-8">
    <div class="flex-grow flex items-center justify-center px-4 sm:px-6">
      <div class="w-full max-w-4xl bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
        <!-- Header -->
        <header class="text-center mb-4">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 animate__animated animate__fadeInDown">
            How It Works
          </h1>
          <p class="text-xs sm:text-sm text-gray-700 mt-2 max-w-md mx-auto animate__animated animate__fadeInUp animate__delay-1">
            Simplify rental management in five easy steps with our cloud-based platform.
          </p>
        </header>

        <!-- Steps Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex flex-col bg-gray-50 p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate__animated animate__fadeInUp"
            :class="`animate__delay-${index + 1}`"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="bg-blue-600 text-white rounded-lg w-8 h-8 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="step.icon" />
                </svg>
              </div>
              <h2 class="text-sm sm:text-base font-semibold text-gray-900">{{ step.title }}</h2>
            </div>
            <p class="text-xs text-gray-600 flex-grow">{{ step.description }}</p>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="mt-4 text-center">
          <RouterLink
            to="/signup"
            class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm animate__animated animate__pulse animate__infinite"
          >
            Start Managing Today
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import 'animate.css';

.animate__delay-1 {
  animation-delay: 0.2s;
}
.animate__delay-2 {
  animation-delay: 0.4s;
}
.animate__delay-3 {
  animation-delay: 0.6s;
}
.animate__delay-4 {
  animation-delay: 0.8s;
}
.animate__delay-5 {
  animation-delay: 1s;
}
</style>

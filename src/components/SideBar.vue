<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

// State for sidebar toggle (default to open for desktop)
const isSidebarOpen = ref(true)

// Get current route for active link highlighting
const route = useRoute()

// Router for logout functionality
const router = useRouter()

// Navigation items
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'HomeIcon' },
  { name: 'Messages', path: '/dashboard/messages', icon: 'EnvelopeIcon' },
  { name: 'Reports', path: '/dashboard/reports', icon: 'ChartBarIcon' },
  { name: 'Sent Messages', path: '/dashboard/sent-messages', icon: 'PaperAirplaneIcon' },
  { name: 'Add New Tenant', path: '/dashboard/add-tenants', icon: 'UsersIcon' },
  { name: 'View Tenants', path: '/dashboard/view-tenants', icon: 'UsersIcon' },
  { name: 'Houses/Flats', path: '/dashboard/houses-flats', icon: 'BuildingOfficeIcon' },
  { name: 'Water Bills', path: '/dashboard/water-bills', icon: 'DropletIcon' },
  { name: 'Employees', path: '/dashboard/employees', icon: 'UserGroupIcon' },
  { name: 'Payment Received', path: '/dashboard/payment-received', icon: 'CurrencyDollarIcon' },
  { name: 'Payment Allocations', path: '/dashboard/payment-allocations', icon: 'ClipboardDocumentListIcon' },
  { name: 'Main Account', path: '/dashboard/main-account', icon: 'BanknotesIcon' },
  { name: 'Invoices', path: '/dashboard/invoices', icon: 'DocumentTextIcon' }
]

// Compute active link based on current route
const isActive = (path) => route.path === path

// Toggle sidebar on all devices
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('authToken')
  router.push('/login')
}

// Watch isSidebarOpen to toggle body classes
watch(isSidebarOpen, (newValue) => {
  document.body.classList.toggle('sidebar-open', newValue)
  document.body.classList.toggle('sidebar-closed', !newValue)
}, { immediate: true })
</script>

<template>
  <!-- Sidebar Toggle Button (Visible on all devices) -->
  <button
    @click="toggleSidebar"
    class="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
  >
    <svg v-if="!isSidebarOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-white/95 backdrop-blur-sm shadow-2xl transition-all duration-300 z-40',
      isSidebarOpen ? 'w-64' : 'w-16'
    ]"
  >
    <div class="h-full flex flex-col">
      <!-- Logo/Title -->
      <div class="p-4 border-b border-gray-200" :class="{ 'hidden': !isSidebarOpen }">
        <h2 class="text-xl font-bold text-gray-900 animate__animated animate__fadeInDown pl-6 text-center">
          Dashboard
        </h2>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-grow p-4 overflow-y-auto">
        <ul class="space-y-2">
          <li
            v-for="(item, index) in navItems"
            :key="item.path"
            class="relative group"
          >
            <RouterLink
              :to="item.path"
              class="flex items-center p-2 rounded-lg transition-all duration-300 animate__animated animate__fadeInUp"
              :class="[
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600',
                `animate__delay-${index + 1}`
              ]"
            >
              <!-- Icons -->
              <svg v-if="item.icon === 'HomeIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <svg v-if="item.icon === 'EnvelopeIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <svg v-if="item.icon === 'ChartBarIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <svg v-if="item.icon === 'PaperAirplaneIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <svg v-if="item.icon === 'UsersIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-if="item.icon === 'BuildingOfficeIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <svg v-if="item.icon === 'DropletIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c-2.5 5-7 8-7 12a7 7 0 0014 0c0-4-4.5-7-7-12zm0 15a3 3 0 01-3-3c0-2 2-4 3-6 1 2 3 4 3 6a3 3 0 01-3 3z" />
              </svg>
              <svg v-if="item.icon === 'UserGroupIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <svg v-if="item.icon === 'CurrencyDollarIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 8c-2.761 0-5-1.79-5-4s2.239-4 5-4 5 1.79 5 4-2.239 4-5 4zm-7-8h2m12 0h-2m-5-5v2m0 12v-2" />
              </svg>
              <svg v-if="item.icon === 'ClipboardDocumentListIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
              </svg>
              <svg v-if="item.icon === 'BanknotesIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 8c-2.761 0-5-1.79-5-4s2.239-4 5-4 5 1.79 5 4-2.239 4-5 4zm-7-8h2m12 0h-2m-5-5v2m0 12v-2" />
              </svg>
              <svg v-if="item.icon === 'DocumentTextIcon'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <!-- Navigation text -->
              <span
                class="text-sm"
                :class="{ 'hidden': !isSidebarOpen }"
              >
                {{ item.name }}
              </span>
              <!-- Tooltip for collapsed state -->
              <span
                v-if="!isSidebarOpen"
                class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              >
                {{ item.name }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Logout Button -->
      <div class="p-4 border-t border-gray-200">
        <button
          @click="handleLogout"
          class="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300 animate__animated animate__fadeInUp animate__delay-13"
        >
          <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span
            class="text-sm"
            :class="{ 'hidden': !isSidebarOpen }"
          >
            Logout
          </span>
          <!-- Tooltip for collapsed state -->
          <span
            v-if="!isSidebarOpen"
            class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Overlay for Mobile (when sidebar is open) -->
  <div
    v-if="isSidebarOpen"
    class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
    @click="toggleSidebar"
  ></div>
</template>

<style scoped>
/* Tailwind CSS with Animate.css for animations */
@import 'animate.css';

/* Staggered animation delays for nav items */
.animate__delay-1 { animation-delay: 0.2s; }
.animate__delay-2 { animation-delay: 0.3s; }
.animate__delay-3 { animation-delay: 0.4s; }
.animate__delay-4 { animation-delay: 0.5s; }
.animate__delay-5 { animation-delay: 0.6s; }
.animate__delay-6 { animation-delay: 0.7s; }
.animate__delay-7 { animation-delay: 0.8s; }
.animate__delay-8 { animation-delay: 0.9s; }
.animate__delay-9 { animation-delay: 1s; }
.animate__delay-10 { animation-delay: 1.1s; }
.animate__delay-11 { animation-delay: 1.2s; }
.animate__delay-12 { animation-delay: 1.3s; }
.animate__delay-13 { animation-delay: 1.4s; }

/* Custom scrollbar for nav */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Ensure toggle button is visible */
button {
  z-index: 50 !important;
}

/* Adjust content margin when sidebar is open/closed */
body {
  transition: margin-left 0.3s ease;
}
body.sidebar-open {
  margin-left: 256px;
}
body.sidebar-closed {
  margin-left: 64px;
}

/* Ensure sidebar items are centered when collapsed */
aside.w-16 .flex.items-center {
  justify-content: center;
}
</style>

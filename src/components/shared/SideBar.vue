<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

import {
  HomeIcon,
  EnvelopeIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  UsersIcon,
  BuildingOfficeIcon,
  HomeModernIcon as HouseIcon,
  CloudIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon,
} from '@heroicons/vue/24/outline'

const isSidebarOpen = ref(true)
const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'HomeIcon' },
  { name: 'Messages', path: '/dashboard/messages', icon: 'EnvelopeIcon' },
  { name: 'Reports', path: '/dashboard/reports', icon: 'ChartBarIcon' },
  { name: 'Sent Messages', path: '/dashboard/sent-messages', icon: 'PaperAirplaneIcon' },
  { name: 'Add New Tenant', path: '/dashboard/add-tenants', icon: 'UsersIcon' },
  { name: 'View Tenants', path: '/dashboard/view-tenants', icon: 'UsersIcon' },
  { name: 'Houses/Flats', path: '/dashboard/houses-flats', icon: 'BuildingOfficeIcon' },
  { name: 'Add Houses/Flats', path: '/dashboard/houses/add', icon: 'HouseIcon' },
  { name: 'Water Bills', path: '/dashboard/water-bills', icon: 'CloudIcon' },
  { name: 'Employees', path: '/dashboard/employees', icon: 'UserGroupIcon' },
  { name: 'Payment Received', path: '/dashboard/payment-received', icon: 'CurrencyDollarIcon' },
  { name: 'Add Payment', path: '/dashboard/payments/add', icon: 'ClipboardDocumentListIcon' },
  { name: 'Main Account', path: '/dashboard/main-account', icon: 'BanknotesIcon' },
  { name: 'Invoices', path: '/dashboard/invoices', icon: 'DocumentTextIcon' }
]

const icons = {
  HomeIcon,
  EnvelopeIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  UsersIcon,
  BuildingOfficeIcon,
  HouseIcon,
  CloudIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  DocumentTextIcon,
  LogoutIcon,
}

const isActive = (path) => route.path === path

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = () => {
  localStorage.removeItem('authtoken')
  router.push('/login')
}

watch(isSidebarOpen, (val) => {
  document.body.classList.toggle('sidebar-open', val)
  document.body.classList.toggle('sidebar-closed', !val)
}, { immediate: true })
</script>

<template>
  <button
    @click="toggleSidebar"
    :aria-expanded="isSidebarOpen.toString()"
    aria-label="Toggle Sidebar"
    class="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
  >
    <svg v-if="!isSidebarOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-white rounded-r-2xl shadow-lg transition-all duration-300 z-40',
      isSidebarOpen ? 'w-64' : 'w-16',
      'hidden lg:block'
    ]"
  >
    <div class="h-full flex flex-col">
      <div class="p-6 border-b border-gray-100" :class="{ 'hidden': !isSidebarOpen }">
        <h2 class="text-xl font-semibold text-gray-900 tracking-tight text-center animate__animated animate__fadeIn">Dashboard</h2>
      </div>

      <nav class="flex-grow px-4 py-6 overflow-y-auto">
        <ul class="space-y-1">
          <li v-for="(item, index) in navItems" :key="item.path" class="relative group">
            <RouterLink
              :to="item.path"
              class="flex items-center p-3 rounded-lg transition-all duration-200 animate__animated animate__fadeIn"
              :class="[
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600',
                `animate__delay-${Math.min(index + 1, 10)}00ms`
              ]"
            >
              <component :is="icons[item.icon]" class="w-5 h-5 flex-shrink-0" :class="isSidebarOpen ? 'mr-3' : 'mx-auto'" />
              <span class="text-sm font-medium" :class="{ 'hidden': !isSidebarOpen }">{{ item.name }}</span>
              <span
                v-if="!isSidebarOpen"
                class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-sm"
              >
                {{ item.name }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-100">
        <button
          @click="handleLogout"
          class="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 animate__animated animate__fadeIn animate__delay-1100ms"
        >
          <LogoutIcon class="w-5 h-5 flex-shrink-0" :class="isSidebarOpen ? 'mr-3' : 'mx-auto'" />
          <span class="text-sm font-medium" :class="{ 'hidden': !isSidebarOpen }">Logout</span>
          <span
            v-if="!isSidebarOpen"
            class="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-sm"
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  </aside>

  <div
    v-if="isSidebarOpen"
    class="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-30"
    @click="toggleSidebar"
  ></div>
</template>

<style scoped>
@import 'animate.css';

.animate__fadeIn { animation-duration: 0.4s; }
.animate__delay-100ms { animation-delay: 0.1s; }
.animate__delay-200ms { animation-delay: 0.2s; }
.animate__delay-300ms { animation-delay: 0.3s; }
.animate__delay-400ms { animation-delay: 0.4s; }
.animate__delay-500ms { animation-delay: 0.5s; }
.animate__delay-600ms { animation-delay: 0.6s; }
.animate__delay-700ms { animation-delay: 0.7s; }
.animate__delay-800ms { animation-delay: 0.8s; }
.animate__delay-900ms { animation-delay: 0.9s; }
.animate__delay-1000ms { animation-delay: 1s; }
.animate__delay-1100ms { animation-delay: 1.1s; }

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 9999px;
}

body.sidebar-open { margin-left: 256px; }
body.sidebar-closed { margin-left: 64px; }

aside.w-16 .flex.items-center { justify-content: center; }
</style>

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
  CloudIcon ,
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
  { name: 'Water Bills', path: '/dashboard/water-bills', icon: 'CloudIcon ' },
  { name: 'Employees', path: '/dashboard/employees', icon: 'UserGroupIcon' },
  { name: 'Payment Received', path: '/dashboard/payment-received', icon: 'CurrencyDollarIcon' },
  { name: 'Add Payment', path: '/dashboard/payments/add', icon: 'ClipboardDocumentListIcon' },
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
  CloudIcon ,
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
    class="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
  >
    <svg v-if="!isSidebarOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <aside
    :class="[
      'fixed top-0 left-0 h-screen bg-white/95 backdrop-blur-sm shadow-2xl transition-all duration-300 z-40',
      isSidebarOpen ? 'w-64' : 'w-16',
      'hidden lg:block'
    ]"
  >
    <div class="h-full flex flex-col">
      <div class="p-4 border-b border-gray-200" :class="{ hidden: !isSidebarOpen }">
        <h2 class="text-xl font-bold text-gray-900 text-center animate__animated animate__fadeInDown">Dashboard</h2>
      </div>

      <nav class="flex-grow p-4 overflow-y-auto">
        <ul class="space-y-2">
          <li v-for="(item, index) in navItems" :key="item.path" class="relative group">
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
              <component :is="icons[item.icon]" class="w-5 h-5 mr-3 flex-shrink-0" />
              <span class="text-sm" :class="{ hidden: !isSidebarOpen }">{{ item.name }}</span>
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

      <div class="p-4 border-t border-gray-200">
        <button
          @click="handleLogout"
          class="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300 animate__animated animate__fadeInUp animate__delay-13"
        >
          <LogoutIcon class="w-5 h-5 mr-3 flex-shrink-0" />
          <span class="text-sm" :class="{ hidden: !isSidebarOpen }">Logout</span>
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

  <div
    v-if="isSidebarOpen"
    class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
    @click="toggleSidebar"
  ></div>
</template>

<style scoped>
@import 'animate.css';

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

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

body.sidebar-open { margin-left: 256px; }
body.sidebar-closed { margin-left: 64px; }

aside.w-16 .flex.items-center {
  justify-content: center;
}
</style>

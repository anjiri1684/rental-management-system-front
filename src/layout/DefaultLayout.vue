<script setup>
import SideBar from '../components/SideBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Main Content -->
    <main
      class="flex-grow bg-gradient-to-b from-blue-50 via-gray-100 to-indigo-100 transition-all duration-300"
      :class="isDashboardRoute ? 'lg:ml-64' : 'lg:ml-0'"
    >
      <router-view />
    </main>
  </div>
</template>

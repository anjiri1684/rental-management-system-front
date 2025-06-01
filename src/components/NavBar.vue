<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, computed } from 'vue'

// State for mobile menu toggle
const isMobileMenuOpen = ref(false)

// Get current route to determine if on dashboard
const route = useRoute()

// Check if current route starts with /dashboard
const isDashboardRoute = computed(() => {
  const path = route.path
  console.log('Navbar - Current route:', path) // Debugging
  return path === '/dashboard' || path.startsWith('/dashboard/')
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <!-- Navigation Bar (Hidden on Dashboard) -->
  <nav
    v-if="!isDashboardRoute"
    class="bg-white shadow-sm px-6 py-4 mx-4 md:mx-20 lg:mx-32 mt-6 rounded-lg sticky top-0 z-50"
  >
    <div class="flex items-center justify-between">
      <!-- Logo/Home Icon -->
      <RouterLink to="/" class="flex items-center">
        <i class="pi pi-home text-3xl text-blue-600 hover:text-blue-800 transition-colors"></i>
        <span class="ml-2 text-xl font-bold text-gray-800 hidden md:block">RMS</span>
      </RouterLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-8 text-base font-medium text-gray-600">
        <RouterLink
          to="/"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600 border-b-2 border-blue-600"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/about-us"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600 border-b-2 border-blue-600"
        >
          About Us
        </RouterLink>
        <RouterLink
          to="/how-it-works"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600 border-b-2 border-blue-600"
        >
          How It Works
        </RouterLink>
        <RouterLink
          to="/contact"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600 border-b-2 border-blue-600"
        >
          Contact
        </RouterLink>
        <RouterLink
          to="/login"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600 border-b-2 border-blue-600"
        >
          Login
        </RouterLink>
        <RouterLink
          to="/signup"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          active-class="bg-blue-700"
        >
          Register
        </RouterLink>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
        @click="toggleMobileMenu"
      >
        <i :class="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-2xl"></i>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden mt-4 bg-white border-t border-gray-200 rounded-lg shadow-lg"
    >
      <div class="flex flex-col space-y-4 p-4 text-base font-medium text-gray-600">
        <RouterLink
          to="/"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600"
          @click="toggleMobileMenu"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/about-us"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600"
          @click="toggleMobileMenu"
        >
          About Us
        </RouterLink>
        <RouterLink
          to="/how-it-works"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600"
          @click="toggleMobileMenu"
        >
          How It Works
        </RouterLink>
        <RouterLink
          to="/contact"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600"
          @click="toggleMobileMenu"
        >
          Contact
        </RouterLink>
        <RouterLink
          to="/login"
          class="hover:text-blue-600 transition-colors duration-200"
          active-class="text-blue-600"
          @click="toggleMobileMenu"
        >
          Login
        </RouterLink>
        <RouterLink
          to="/signup"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
          active-class="bg-blue-700"
          @click="toggleMobileMenu"
        >
          Register
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

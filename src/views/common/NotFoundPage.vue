<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

// Get the current route
const route = useRoute()

// Check if the route starts with /dashboard
const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg p-8 max-w-md w-full text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 animate__animated animate__fadeInDown">
        {{ isDashboardRoute ? 'Page Under Development' : 'Page Not Found' }}
      </h1>
      <p class="text-gray-600 mb-6 animate__animated animate__fadeInUp animate__delay-1">
        {{ isDashboardRoute
          ? 'This dashboard page is currently under development. Check back soon!'
          : 'Sorry, the page you are looking for does not exist.'
        }}
      </p>
      <RouterLink
        :to="isDashboardRoute ? '/dashboard' : '/'"
        class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 animate__animated animate__fadeInUp animate__delay-2"
      >
      {{ isDashboardRoute
          ? 'Go Back to Dashboard'
          : 'Go back Home'
        }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Import Animate.css for animations */
@import 'animate.css';

/* Animation delays */
.animate__delay-1 {
  animation-delay: 0.2s;
}
.animate__delay-2 {
  animation-delay: 0.4s;
}
</style>

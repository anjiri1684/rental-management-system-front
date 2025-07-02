<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

// Get the current route
const route = useRoute()

// Check if the route starts with /dashboard
const isDashboardRoute = computed(() => route.path.startsWith('/dashboard'))
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-100 relative overflow-hidden p-4 sm:p-6">

    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow animation-delay-2000"></div>

    <div class="relative z-10 bg-white/95 backdrop-blur-md shadow-3xl rounded-3xl p-8 md:p-12 lg:p-16 max-w-lg w-full text-center border border-gray-100 animate-fade-in-up">

      <div class="mb-6 animate-zoom-in">
        <svg v-if="isDashboardRoute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-blue-500 mx-auto transform -rotate-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.708-2.836a.75.75 0 001.063.852l-.708 2.836c.241.406.31.905.136 1.454A11.917 11.917 0 0012 21.75c4.552 0 8.25-3.698 8.25-8.25a8.286 8.286 0 00-1.188-4.045 1.5 1.5 0 010-1.897L16.25 6.471M12 2.25c-5.327 0-9.75 4.314-9.75 9.625 0 1.253.224 2.476.684 3.638m9.043-10.745l.138.277c.234.468.906.601 1.451.353l.13-.065a.92.92 0 00.528-1.127l-.029-.073A1.125 1.125 0 0014.28 2.25H12c-.75 0-1.455.334-1.94 1.007L9.4 4.412a1.5 1.5 0 00-.773 1.091V7.5l-2.403.428z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-red-500 mx-auto transform rotate-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.38 3.375 2.07 3.375h14.006c1.69 0 2.936-1.875 2.07-3.375L13.5 4.625a1.125 1.125 0 00-1.95 0L2.697 16.126zM12 15.75h.007V15.75h-.007z" />
        </svg>
      </div>

      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight animate-slide-in-down">
        {{ isDashboardRoute ? 'Under Development!' : 'Page Not Found' }}
      </h1>
      <p class="text-base sm:text-lg text-gray-700 mb-8 max-w-sm mx-auto font-light animate-fade-in">
        {{ isDashboardRoute
          ? 'This section of the dashboard is currently being built. Please check back soon for exciting updates!'
          : 'Oops! The page you are looking for seems to have gone on an adventure. Let\'s get you back on track.'
        }}
      </p>
      <RouterLink
        :to="isDashboardRoute ? '/dashboard' : '/'"
        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg
               hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl-blue transition-all duration-300
               transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2
               focus:ring-offset-white animate-scale-pulse"
      >
        <svg v-if="isDashboardRoute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        {{ isDashboardRoute
          ? 'Return to Dashboard'
          : 'Go Back Home'
        }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Custom Animations for a fluid modern feel (no animate.css) */
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -10px); }
}

.animate-float-slow {
  animation: float-slow 8s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

@keyframes slide-in-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-in-down {
  animation: slide-in-down 0.7s ease-out forwards;
}

@keyframes scale-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.animate-scale-pulse {
  animation: scale-pulse 2s infinite ease-in-out;
}

@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.animate-zoom-in {
  animation: zoom-in 0.7s ease-out forwards;
  animation-delay: 0.1s; /* Slight delay after card appears */
}

/* Custom Shadows for a modern feel */
.shadow-3xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-xl-blue {
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25), /* Tailwind blue-500 tint */
              0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Default shadow */
}
</style>

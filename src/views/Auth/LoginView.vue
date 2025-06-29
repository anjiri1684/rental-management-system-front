<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { reactive, computed } from 'vue'
import axios from 'axios'

const router = useRouter()
const toast = useToast()

const state = reactive({
  email: '',
  password: '',
  isLoading: false,
  showPassword: false,
  rememberMe: false
})

// Client-side validation
const isFormValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return (
    emailRegex.test(state.email) &&
    state.password.trim().length >= 6
  )
})

const HandleLogin = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill all fields correctly.')
    return
  }

  state.isLoading = true
  const loginData = {
    email: state.email,
    password: state.password
  }

  try {
    const response = await axios.post('http://127.0.0.1:8080/api/v1/auth/login', loginData)
    const { token, user } = response.data

    localStorage.setItem('authToken', token, user)

    toast.success('Login successful!')
    console.log(loginData)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error.response?.data?.message || 'Failed to login. Please check your credentials and try again.'
    toast.error(errorMessage)
  } finally {
    state.isLoading = false
  }
}
</script>

<template>
  <section class="h-screen flex flex-col bg-gradient-to-b from-blue-50 via-gray-100 to-indigo-100 pt-20 pb-8">
    <div class="flex-grow flex items-center justify-center px-4 sm:px-6">
      <div class="w-full max-w-md bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
        <!-- Header -->
        <header class="text-center mb-4">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 animate__animated animate__fadeInDown">
            Welcome Back
          </h1>
          <p class="text-xs sm:text-sm text-gray-700 mt-2 max-w-md mx-auto animate__animated animate__fadeInUp animate__delay-1">
            Log in to your dashboard
          </p>
        </header>

        <!-- Login Form -->
        <form @submit.prevent="HandleLogin" class="space-y-4">
          <div class="grid grid-cols-1 gap-3 sm:gap-4">
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-2">
              <label for="email" class="block text-xs font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                v-model="state.email"
                required
                placeholder="Enter your email"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              >
            </div>
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-3">
              <label for="password" class="block text-xs font-medium text-gray-700">Password</label>
              <div class="relative">
                <input
                  :type="state.showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  v-model="state.password"
                  required
                  placeholder="Enter your password"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                >
                <button
                  type="button"
                  @click="state.showPassword = !state.showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="state.showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between animate__animated animate__fadeInUp animate__delay-4">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="state.rememberMe"
                class="rounded text-blue-500 focus:ring-blue-500"
              >
              <span class="text-xs text-gray-600">Remember me</span>
            </label>
            <RouterLink
              to="/forgot-password"
              class="text-xs text-blue-600 hover:underline"
            >
              Forgot Password?
            </RouterLink>
          </div>
          <button
            :disabled="state.isLoading || !isFormValid"
            type="submit"
            class="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed text-xs sm:text-sm animate__animated animate__fadeInUp animate__delay-5"
          >
            <span v-if="state.isLoading" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
            <span v-else>Log In</span>
          </button>
        </form>

        <!-- Navigation Link -->
        <div class="mt-4 text-center animate__animated animate__fadeInUp animate__delay-6">
          <p class="text-xs text-gray-600">Don't have an account?</p>
          <RouterLink
            to="/signup"
            class="text-blue-600 font-semibold hover:underline text-xs"
          >
            Sign up
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Tailwind CSS with Animate.css for animations */
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
.animate__delay-6 {
  animation-delay: 1.2s;
}
</style>

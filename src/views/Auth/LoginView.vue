<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { reactive, computed } from 'vue'
import apiClient from '../../services/apiClient'
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
    toast.error('Please enter a valid email and a password of at least 6 characters.')
    return
  }

  state.isLoading = true
  const loginData = {
    email: state.email,
    password: state.password
  }

  try {
    const response = await apiClient.post('/auth/login', loginData)
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
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md bg-white rounded-xl shadow-3xl overflow-hidden animate__animated animate__fadeInUp">
      <div class="px-6 py-8 sm:p-10">
        <header class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Welcome Back!
          </h1>
          <p class="mt-2 text-md text-gray-600">
            Log in to your dashboard to continue.
          </p>
        </header>

        <form @submit.prevent="HandleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              v-model="state.email"
              required
              placeholder="you@example.com"
              autocomplete="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                :type="state.showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                v-model="state.password"
                required
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
              <button
                type="button"
                @click="state.showPassword = !state.showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                aria-label="Toggle password visibility"
              >
                <svg v-if="state.showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="state.rememberMe"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <RouterLink
              to="/forgot-password"
              class="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Forgot your password?
            </RouterLink>
          </div>

          <button
            :disabled="state.isLoading || !isFormValid"
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <span v-if="state.isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <RouterLink
              to="/signup"
              class="font-semibold text-blue-600 hover:text-blue-500 hover:underline ml-1"
            >
              Sign up
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import 'animate.css';

/* Custom subtle shadow for the card */
.shadow-3xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>

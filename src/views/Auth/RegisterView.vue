<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const router = useRouter()
const toast = useToast()

const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  terms: false,
  isLoading: false,
  showPassword: false,
  showConfirmPassword: false
})

// Client-side validation
const isFormValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\+?[\d\s-]{7,15}$/
  return (
    state.firstName.trim().length >= 2 &&
    state.lastName.trim().length >= 2 &&
    emailRegex.test(state.email) &&
    phoneRegex.test(state.phoneNumber) &&
    state.password.length >= 6 &&
    state.password === state.confirmPassword &&
    state.terms
  )
})

const HandleRegister = async () => {
  if (!isFormValid.value) {
    toast.error('Please ensure all fields are filled correctly, your password is at least 8 characters, and passwords match. Also, please agree to the terms.')
    return
  }

  state.isLoading = true
  const registerData = {
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    phoneNumber: state.phoneNumber,
    password: state.password
  }

  try {
    const response = await axios.post('http://127.0.0.1:8080/api/v1/auth/register', registerData)
    const { token } = response.data
    localStorage.setItem('authToken', token)

    toast.success('Registration successful! Welcome aboard!')
    console.log(registerData)
    router.push('/login')
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = error.response?.data?.message || 'Failed to register. Please try again. It\'s possible an account with this email already exists.'
    toast.error(errorMessage)
  } finally {
    state.isLoading = false
  }
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-lg bg-white rounded-xl shadow-3xl overflow-hidden animate__animated animate__fadeInUp">
      <div class="px-6 py-8 sm:p-10">
        <header class="text-center mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Create Your Account
          </h1>
          <p class="mt-2 text-md text-gray-600">
            Sign up to get started with Rental Property Management.
          </p>
        </header>

        <form @submit.prevent="HandleRegister" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                v-model="state.firstName"
                required
                placeholder="John"
                autocomplete="given-name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                v-model="state.lastName"
                required
                placeholder="Doe"
                autocomplete="family-name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
            </div>
            <div class="sm:col-span-2">
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
            <div class="sm:col-span-2">
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                v-model="state.phoneNumber"
                required
                placeholder="+1 555 123 4567"
                autocomplete="tel"
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
                  autocomplete="new-password"
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
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div class="relative">
                <input
                  :type="state.showConfirmPassword ? 'text' : 'password'"
                  id="confirm-password"
                  name="confirm-password"
                  v-model="state.confirmPassword"
                  required
                  placeholder="••••••••"
                  autocomplete="new-password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                <button
                  type="button"
                  @click="state.showConfirmPassword = !state.showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                  aria-label="Toggle confirm password visibility"
                >
                  <svg v-if="state.showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              v-model="state.terms"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="terms" class="ml-2 text-sm text-gray-900">
              I agree to the
              <RouterLink to="/terms" class="text-blue-600 font-medium hover:text-blue-500 hover:underline">Terms of Service</RouterLink>
              and
              <RouterLink to="/privacy" class="text-blue-600 font-medium hover:text-blue-500 hover:underline">Privacy Policy</RouterLink>
            </label>
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
              Creating Account...
            </span>
            <span v-else>Sign Up</span>
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <RouterLink
              to="/login"
              class="font-semibold text-blue-600 hover:text-blue-500 hover:underline ml-1"
            >
              Log in
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

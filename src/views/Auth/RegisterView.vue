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
  const phoneRegex = /^\+?[\d\s-]{10,}$/
  return (
    state.firstName.trim().length >= 2 &&
    state.lastName.trim().length >= 2 &&
    emailRegex.test(state.email) &&
    phoneRegex.test(state.phoneNumber) &&
    state.password.length >= 8 &&
    state.password === state.confirmPassword &&
    state.terms
  )
})

const HandleRegister = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill all fields correctly and agree to the terms.')
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
    const response = await axios.post('http://localhost:3000/api/auth/register', registerData)
    const { token } = response.data
    localStorage.setItem('authToken', token)

    toast.success('Registration successful! Welcome aboard!')
    console.log(registerData)
    router.push('/login')
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = error.response?.data?.message || 'Failed to register. Please try again.'
    toast.error(errorMessage)
  } finally {
    state.isLoading = false
  }
}
</script>

<template>
  <section class="h-screen flex flex-col bg-gradient-to-b from-blue-50 via-gray-100 to-indigo-100 pt-20 pb-8">
    <div class="flex-grow flex items-center justify-center px-4 sm:px-6">
      <div class="w-full max-w-lg bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
        <!-- Header -->
        <header class="text-center mb-4">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 animate__animated animate__fadeInDown">
            Create an Account
          </h1>
          <p class="text-xs sm:text-sm text-gray-700 mt-2 max-w-md mx-auto animate__animated animate__fadeInUp animate__delay-1">
            Sign up to get started with Rental Property Management.
          </p>
        </header>

        <!-- Register Form -->
        <form @submit.prevent="HandleRegister" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-2">
              <label for="firstName" class="block text-xs font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                v-model="state.firstName"
                required
                placeholder="First name"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              >
            </div>
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-3">
              <label for="lastName" class="block text-xs font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                v-model="state.lastName"
                required
                placeholder="Last name"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              >
            </div>
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-4">
              <label for="email" class="block text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                v-model="state.email"
                required
                placeholder="Your email"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              >
            </div>
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-5">
              <label for="phoneNumber" class="block text-xs font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                v-model="state.phoneNumber"
                required
                placeholder="Your phone number"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              >
            </div>
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-6">
              <label for="password" class="block text-xs font-medium text-gray-700">Password</label>
              <div class="relative">
                <input
                  :type="state.showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  v-model="state.password"
                  required
                  placeholder="Password"
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
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-7">
              <label for="confirm-password" class="block text-xs font-medium text-gray-700">Confirm Password</label>
              <div class="relative">
                <input
                  :type="state.showConfirmPassword ? 'text' : 'password'"
                  id="confirm-password"
                  name="confirm-password"
                  v-model="state.confirmPassword"
                  required
                  placeholder="Confirm password"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                >
                <button
                  type="button"
                  @click="state.showConfirmPassword = !state.showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="state.showConfirmPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div class="flex items-center animate__animated animate__fadeInUp animate__delay-8">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              v-model="state.terms"
              required
              class="rounded text-blue-500 focus:ring-blue-500"
            >
            <label for="terms" class="ml-2 text-xs text-gray-600">
              I agree to the
              <RouterLink to="/terms" class="text-blue-600 hover:underline">Terms of Service</RouterLink>
              and
              <RouterLink to="/privacy" class="text-blue-600 hover:underline">Privacy Policy</RouterLink>
            </label>
          </div>
          <button
            :disabled="state.isLoading || !isFormValid"
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed text-xs sm:text-sm animate__animated animate__fadeInUp animate__delay-9"
          >
            <span v-if="state.isLoading" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing up...
            </span>
            <span v-else>Sign Up</span>
          </button>
        </form>

        <!-- Navigation Link -->
        <div class="mt-4 text-center animate__animated animate__fadeInUp animate__delay-10">
          <p class="text-xs text-gray-600">Already have an account?</p>
          <RouterLink
            to="/login"
            class="text-blue-600 font-semibold hover:underline text-xs"
          >
            Log in
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
.animate__delay-7 {
  animation-delay: 1.4s;
}
.animate__delay-8 {
  animation-delay: 1.6s;
}
.animate__delay-9 {
  animation-delay: 1.8s;
}
.animate__delay-10 {
  animation-delay: 2s;
}
</style>

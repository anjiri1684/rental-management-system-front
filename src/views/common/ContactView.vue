<script setup>
import { RouterLink } from 'vue-router'
import { reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const toast = useToast()

const state = reactive({
  name: '',
  email: '',
  phoneNumber: '',
  subject: '',
  message: '',
  isLoading: false
})

// Client-side validation
const isFormValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\+?[\d\s-]{10,}$/
  return (
    state.name.trim().length >= 2 &&
    emailRegex.test(state.email) &&
    phoneRegex.test(state.phoneNumber) &&
    state.subject.trim().length >= 3 &&
    state.message.trim().length >= 10
  )
})

const handleContactSubmit = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill all fields correctly.')
    return
  }

  state.isLoading = true
  const contactData = {
    name: state.name,
    email: state.email,
    phoneNumber: state.phoneNumber,
    subject: state.subject,
    message: state.message
  }

  try {
    await axios.post('http://localhost:3000/api/contact', contactData)
    toast.success('Your message has been sent successfully!')
    // Reset form
    state.name = ''
    state.email = ''
    state.phoneNumber = ''
    state.subject = ''
    state.message = ''
  } catch (error) {
    console.error('Contact form error:', error)
    const errorMessage = error.response?.data?.message || 'Failed to send your message. Please try again.'
    toast.error(errorMessage)
  } finally {
    state.isLoading = false
  }
}

const copyEmail = () => {
  const email = 'support@rentalpropertymanagement.com'
  navigator.clipboard.writeText(email)
    .then(() => {
      toast.success('Email copied to clipboard!')
    })
    .catch(() => {
      toast.error('Failed to copy email.')
    })
}
</script>

<template>
  <section class="h-screen flex flex-col bg-gradient-to-b from-blue-50 via-gray-100 to-indigo-100 pt-20 pb-8">
    <div class="flex-grow flex items-center justify-center px-4 sm:px-6">
      <div class="w-full max-w-4xl bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
        <!-- Header -->
        <header class="text-center mb-4">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 animate__animated animate__fadeInDown">
            Contact Us
          </h1>
          <p class="text-xs sm:text-sm text-gray-700 mt-2 max-w-md mx-auto animate__animated animate__fadeInUp animate__delay-1">
            We're here to assist you with your property management needs.
          </p>
        </header>

        <!-- Contact Form -->
        <form @submit.prevent="handleContactSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-1">
              <label for="name" class="block text-xs font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                v-model="state.name"
                required
                placeholder="Your name"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              >
            </div>
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-2">
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
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-3">
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
            <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-4">
              <label for="subject" class="block text-xs font-medium text-gray-700">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                v-model="state.subject"
                required
                placeholder="Subject"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
              >
            </div>
          </div>
          <div class="space-y-1 animate__animated animate__fadeInUp animate__delay-5">
            <label for="message" class="block text-xs font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              v-model="state.message"
              required
              placeholder="Your message"
              rows="3"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
            ></textarea>
          </div>
          <button
            :disabled="state.isLoading || !isFormValid"
            type="submit"
            class="w-full bg-blue-600  text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed text-xs sm:text-sm animate__animated animate__fadeInUp animate__delay-6"
          >
            <span v-if="state.isLoading" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            <span v-else>Send Message</span>
          </button>
        </form>

        <!-- Contact Options -->
        <div class="mt-4 text-center space-y-2 animate__animated animate__fadeInUp animate__delay-7">
          <p class="text-xs text-gray-600">Or reach us directly:</p>
          <div class="flex justify-center gap-3 sm:gap-4">
            <button
              @click="copyEmail"
              class="flex items-center text-blue-600 hover:text-blue-700 text-xs font-semibold"
              title="Copy email"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2h4m4-14v2m-4-2v2m4-2h2a2 2 0 012 2v2m-8 0h4" />
              </svg>
              support@rentalpropertymanagement.com
            </button>
            <a
              href="tel:+1234567890"
              class="flex items-center text-blue-600 hover:text-blue-700 text-xs font-semibold"
              title="Call us"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +254 (705) 423-996
            </a>
          </div>
          <RouterLink
            to="/"
            class="text-blue-600 font-semibold hover:underline text-xs"
          >
            Back to Home
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
</style>

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
  <section class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 items-center justify-center">
    <div class="w-full max-w-4xl bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <header class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight animate__animated animate__fadeInDown">
          Get in Touch
        </h1>
        <p class="text-sm sm:text-base text-gray-600 mt-3 max-w-md mx-auto animate__animated animate__fadeInUp animate__delay-1">
          We'd love to hear from you! Reach out to us for any inquiries regarding property management.
        </p>
      </header>

      <form @submit.prevent="handleContactSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div class="space-y-2 animate__animated animate__fadeInUp animate__delay-1">
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              v-model="state.name"
              required
              placeholder="John Doe"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
            >
          </div>
          <div class="space-y-2 animate__animated animate__fadeInUp animate__delay-2">
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              v-model="state.email"
              required
              placeholder="john.doe@example.com"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
            >
          </div>
          <div class="space-y-2 animate__animated animate__fadeInUp animate__delay-3">
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              v-model="state.phoneNumber"
              required
              placeholder="+1 234 567 8900"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
            >
          </div>
          <div class="space-y-2 animate__animated animate__fadeInUp animate__delay-4">
            <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              v-model="state.subject"
              required
              placeholder="Inquiry about services"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
            >
          </div>
        </div>
        <div class="space-y-2 animate__animated animate__fadeInUp animate__delay-5">
          <label for="message" class="block text-sm font-medium text-gray-700">Your Message</label>
          <textarea
            id="message"
            name="message"
            v-model="state.message"
            required
            placeholder="Type your message here..."
            rows="4"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm"
          ></textarea>
        </div>
        <button
          :disabled="state.isLoading || !isFormValid"
          type="submit"
          class="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed transform hover:scale-105 animate__animated animate__fadeInUp animate__delay-6"
        >
          <span v-if="state.isLoading" class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Message...
          </span>
          <span v-else>Send Message</span>
        </button>
      </form>

      <div class="mt-8 text-center space-y-4 animate__animated animate__fadeInUp animate__delay-7">
        <p class="text-base text-gray-700">Or connect with us directly:</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            @click="copyEmail"
            class="flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 shadow-sm text-sm"
            title="Copy email to clipboard"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@rentalpropertymanagement.com
          </button>
          <a
            href="tel:+254705423996"
            class="flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 shadow-sm text-sm"
            title="Call us now"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +254 (705) 423-996
          </a>
        </div>
        <RouterLink
          to="/"
          class="inline-flex items-center text-blue-600 font-semibold hover:underline mt-4 text-sm"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import 'animate.css';

.animate__delay-1 { animation-delay: 0.2s; }
.animate__delay-2 { animation-delay: 0.4s; }
.animate__delay-3 { animation-delay: 0.6s; }
.animate__delay-4 { animation-delay: 0.8s; }
.animate__delay-5 { animation-delay: 1s; }
.animate__delay-6 { animation-delay: 1.2s; }
.animate__delay-7 { animation-delay: 1.4s; }
</style>

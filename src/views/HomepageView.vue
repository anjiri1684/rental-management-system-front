<script setup>
import { RouterLink } from 'vue-router'
import heroImage from '../assets/heroImage.png'
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:px-20 lg:px-32">
    <!-- Text Content -->
    <div class="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
        Next-Gen Rental Management, Made Simple
      </h1>
      <p class="text-lg md:text-xl text-gray-600 max-w-lg mt-4">
        Automate your rental workflows, centralize your data, and gain full visibility across your property portfolio—anytime, anywhere. Built for scale, designed for ease.
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        <RouterLink
          to="/signup"
          class="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
        >
          Get Started
        </RouterLink>
        <RouterLink
          to="/contact"
          class="bg-transparent border-2 border-gray-800 text-gray-800 font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200 text-center"
        >
          Contact Us
        </RouterLink>
      </div>
    </div>

    <!-- Hero Image -->
    <div class="md:w-1/2 mt-8 md:mt-0 flex justify-center">
      <img
        :src="heroImage"
        alt="Rental Property Management"
        class="w-full max-w-md object-contain rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
      >
    </div>
  </section>
</template>

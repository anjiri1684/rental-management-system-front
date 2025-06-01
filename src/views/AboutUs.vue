<script setup>
import { RouterLink } from 'vue-router'
import teamImage from '../assets/teamImage.png'
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-12 md:px-20 lg:px-32">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800">About Us</h1>
      <p class="text-lg md:text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
        Empowering property managers with innovative tools to streamline rental operations and enhance efficiency.
      </p>
    </div>

    <!-- Mission Section -->
    <div class="flex flex-col md:flex-row items-center gap-8 mb-16">
      <div class="md:w-1/2">
        <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p class="text-gray-600 leading-relaxed">
          At Rental Property Management System, we are dedicated to simplifying the complexities of property management. Our platform provides intuitive tools to help landlords and property managers efficiently manage rentals, tenants, and finances, ensuring a seamless experience for all stakeholders.
        </p>
      </div>
      <div class="md:w-1/2">
        <img
          :src="teamImage"
          alt="Our Team"
          class="w-full max-w-md mx-auto rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
      </div>
    </div>

    <!-- Values Section -->
    <div class="mb-16">
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-8">Our Core Values</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Innovation</h3>
          <p class="text-gray-600">We leverage cutting-edge technology to deliver solutions that evolve with your needs.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Efficiency</h3>
          <p class="text-gray-600">Our tools streamline operations, saving you time and resources.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Trust</h3>
          <p class="text-gray-600">We prioritize transparency and reliability in every interaction.</p>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center">
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Ready to Transform Your Property Management?</h2>
      <p class="text-gray-600 mb-6 max-w-lg mx-auto">
        Join thousands of property managers who trust our platform to simplify their work.
      </p>
      <RouterLink
        to="/signup"
        class="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Get Started
      </RouterLink>
    </div>
  </section>
</template>

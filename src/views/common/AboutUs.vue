<script setup>
import { RouterLink } from 'vue-router'
import teamImage from '../../assets/teamImage.png' // Ensure this path is correct
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 px-6 py-16 md:px-20 lg:px-24 xl:px-32 relative overflow-hidden">

    <div class="absolute -top-20 -left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
    <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

    <div class="text-center mb-16 relative z-10">
      <p class="text-sm uppercase tracking-widest text-blue-600 font-semibold mb-3">Who We Are</p>
      <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
        Building the Future of <br class="hidden md:inline-block"> <span class="text-blue-700">Property Management</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl mx-auto font-light">
        Empowering property managers with innovative, intuitive tools to streamline rental operations, enhance efficiency, and foster growth.
      </p>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20 mb-20 relative z-10">
      <div class="md:w-1/2 order-2 md:order-1">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">Our Mission: Simplify, Enhance, Grow</h2>
        <p class="text-lg text-gray-700 leading-relaxed mb-6">
          At **Rental Property Management System**, we're driven by a singular purpose: to transform the complexities of property management into seamless, effortless processes. Our advanced platform delivers intuitive tools that empower landlords and property managers to confidently handle rentals, tenants, and finances.
        </p>
        <p class="text-lg text-gray-700 leading-relaxed">
          We ensure a **transparent and efficient experience** for every stakeholder, fostering a community where property management is not just a task, but a streamlined journey towards success.
        </p>
      </div>
      <div class="md:w-1/2 order-1 md:order-2 relative group">
        <img
          :src="teamImage"
          alt="Our Team"
          class="w-full max-w-xl mx-auto rounded-xl shadow-2xl transition-all duration-500 ease-out transform group-hover:scale-[1.02] group-hover:shadow-3xl-blue-lg border border-gray-100"
        >
        <div class="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>

    <div class="mb-20 relative z-10">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Our Core Values</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl-blue transition-all duration-300 ease-out transform hover:-translate-y-1 group">
          <div class="mb-4 text-blue-600">
            <svg class="w-10 h-10 group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.303a1.5 1.5 0 01-.872 1.385L6 12l2.878 2.208c.57.436.872 1.102.872 1.834V21h7.5V16.834c0-.732.302-1.398.872-1.834L18 12l-2.878-2.208a1.5 1.5 0 01-.872-1.385V3.104m0 0a2.25 2.25 0 00-4.5 0M12 10.5a3 3 0 11-6 0 3 3 0 016 0zm0 0v-1.5m0 0a2.25 2.25 0 00-4.5 0" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Innovation</h3>
          <p class="text-gray-700 leading-relaxed">
            We continuously embrace **cutting-edge technology** and agile methodologies to deliver solutions that intelligently adapt and evolve with your dynamic needs.
          </p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl-blue transition-all duration-300 ease-out transform hover:-translate-y-1 group">
          <div class="mb-4 text-blue-600">
            <svg class="w-10 h-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L13.5 21.75 21 12H3.75z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Efficiency</h3>
          <p class="text-gray-700 leading-relaxed">
            Our platform is meticulously designed to **streamline operations**, drastically reducing manual effort and saving you invaluable time and resources.
          </p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl-blue transition-all duration-300 ease-out transform hover:-translate-y-1 group">
          <div class="mb-4 text-blue-600">
            <svg class="w-10 h-10 group-hover:animate-bounce-subtle transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Trust</h3>
          <p class="text-gray-700 leading-relaxed">
            We build lasting relationships through **unwavering transparency**, ironclad data security, and dependable reliability in every interaction.
          </p>
        </div>
      </div>
    </div>

    <div class="text-center relative z-10 p-8 bg-blue-600 rounded-3xl shadow-2xl text-white max-w-4xl mx-auto transform transition-all duration-300 ease-out hover:scale-[1.01]">
      <h2 class="text-3xl md:text-4xl font-bold mb-4 leading-tight">Ready to Elevate Your Property Management?</h2>
      <p class="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
        Join the community of thousands of successful property managers who rely on our platform to simplify their work and drive growth.
      </p>
      <RouterLink
        to="/signup"
        class="inline-block bg-white text-blue-700 font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl-blue-lg transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
      >
        Start Your Free Trial Today
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
/* Custom Animations for Modernity */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.4, 1);
}

.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 1s infinite;
}

/* Custom Shadows for a premium feel */
.shadow-2xl-blue {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25), /* Blue tint */
              0 10px 15px -3px rgba(0, 0, 0, 0.1); /* Standard shadow */
}

.shadow-3xl-blue-lg {
  box-shadow: 0 35px 60px -15px rgba(59, 130, 246, 0.35), /* Larger blue tint */
              0 15px 20px -5px rgba(0, 0, 0, 0.15); /* Larger standard shadow */
}
</style>

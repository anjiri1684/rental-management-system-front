<script setup>
import { RouterLink } from 'vue-router'
import heroImage from '../../assets/heroImage.png'
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col lg:flex-row items-center justify-center px-6 py-16 md:px-12 lg:px-24 text-gray-900 overflow-hidden relative">

    <div class="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 animate__animated animate__fadeInLeft z-10">
      <h1 class="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
        Next-Gen Rental Management, <span class="text-blue-700">Simplified.</span>
      </h1>
      <p class="text-base md:text-lg text-gray-700 max-w-xl leading-relaxed opacity-90">
        Automate workflows, centralize data, and gain full visibility across your property portfolio—anytime, anywhere. Built for scale, designed for ease.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
        <RouterLink
          to="/signup"
          class="inline-flex items-center justify-center px-10 py-4 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group"
        >
          Get Started Free
          <svg class="ml-2 -mr-1 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
        </RouterLink>
        <RouterLink
          to="/contact"
          class="inline-flex items-center justify-center px-10 py-4 border-2 border-blue-600 text-blue-600 text-base font-bold rounded-full hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
        >
          Contact Sales
        </RouterLink>
      </div>
    </div>

    <div class="lg:w-1/2 mt-12 lg:mt-0 flex justify-center items-center relative animate__animated animate__fadeInRight z-10">
      <img
        :src="heroImage"
        alt="Modern Rental Property Management Dashboard"
        class="w-full max-w-lg lg:max-w-xl object-contain rounded-xl shadow-3xl border border-gray-200 transform transition-transform duration-500 hover:scale-105"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-50 rounded-xl pointer-events-none"></div>
    </div>
  </section>
</template>

<style scoped>
@import 'animate.css';

/* Custom subtle shadow for the card */
.shadow-3xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Optional: Keyframes for the blob animation if you uncomment the decorative blobs */
/*
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.4, 1);
}

.animation-delay-2000 {
  animation-delay: 2s;
}
*/
</style>

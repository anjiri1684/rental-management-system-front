<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const steps = ref([
  {
    title: 'Register Tenants',
    description: 'Effortlessly onboard new tenants by entering their details and lease terms. Securely import data via CSV or CRM tools, with all information stored securely and encrypted.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>' // User Plus
  },
  {
    title: 'Add Properties',
    description: 'Input comprehensive property details including address, unit types, rental rates, and high-quality photos. Easily manage multiple properties and generate detailed reports.',
    iconSvg: '<svg xmlns="http://www.w3.org/0000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>' // Home Modern
  },
  {
    title: 'Link Tenants & Units',
    description: 'Seamlessly assign tenants to their respective units using intuitive drag-and-drop or bulk assignment tools. Keep track of all lease agreements and receive automated renewal alerts.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0l-3.75 3.75M21 3l-3.75-3.75" /></svg>' // Link
  },
  {
    title: 'Automate Billing',
    description: 'Streamline rent and utility billing with automated invoices sent via email or SMS. Integrate effortlessly with popular payment solutions like Mpesa or direct bank transfers for swift payments.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.72.198 1.458-.368 1.458-1.1V12.75a2.25 2.25 0 00-2.25-2.25H12A2.25 2.25 0 009.75 12.75v5.063M4.5 18.75a60.07 60.07 0 00-2.25-1.074V12.75a2.25 2.25 0 012.25-2.25H12M12 10.5A2.25 2.25 0 009.75 12.75v5.063m-9.75 0V5.625A2.25 2.25 0 012.25 3.375h14.25a2.25 2.25 0 012.25 2.25v13.125M7.5 6.75h6" /></svg>' // Receipt
  },
  {
    title: 'Track Payments & Reports',
    description: 'Monitor all incoming and outgoing payments in real-time. Receive instant alerts for late payments and easily export financial data directly to accounting software like QuickBooks.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' // Check Circle
  }
])
</script>

<template>
  <section class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden">

    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
    <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow animation-delay-2000"></div>

    <div class="w-full max-w-screen-xl bg-white/95 backdrop-blur-md p-8 md:p-12 lg:p-16 rounded-3xl shadow-soft border border-gray-100 relative z-10 animate-fade-in-up">

      <header class="text-center mb-12 lg:mb-16">
        <p class="text-sm uppercase tracking-widest text-blue-600 font-semibold mb-3 animate-fade-in">
          Your Path to Simplicity
        </p>
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight animate-slide-in-down">
          Unlock Efficiency in <br class="hidden sm:inline-block">
          <span class="text-blue-700">Five Clear Steps</span>
        </h1>
        <p class="text-base sm:text-lg text-gray-700 mt-4 max-w-3xl mx-auto font-light animate-fade-in">
          Our cloud-based platform simplifies rental management from tenant onboarding to payment tracking,
          making your work effortless and productive.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 **xl:grid-cols-4** gap-6 sm:gap-8 lg:gap-10 **justify-items-center**">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-soft border border-gray-100
                 hover:shadow-lg-blue transition-all duration-300 transform hover:-translate-y-2 group
                 animate-fade-in-up hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50"
          :style="{ 'animation-delay': `${0.2 + index * 0.15}s` }"
        >
          <div class="mb-5 text-blue-600 p-4 bg-blue-100 rounded-full flex items-center justify-center
                      transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-110">
            <div v-html="step.iconSvg" class="w-9 h-9"></div>
          </div>

          <h2 class="text-xl font-bold text-gray-900 mb-3 leading-tight">{{ step.title }}</h2>
          <p class="text-sm text-gray-700 flex-grow leading-relaxed">{{ step.description }}</p>
        </div>
      </div>

      <div class="mt-16 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4 animate-fade-in-up">
          Ready to Experience Seamless Property Management?
        </h2>
        <p class="text-lg text-gray-600 mb-8 max-w-lg mx-auto animate-fade-in-up">
          Join a growing number of property managers simplifying their work and boosting productivity today.
        </p>
        <RouterLink
          to="/signup"
          class="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg-md
                 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl-blue transition-all duration-300
                 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2
                 focus:ring-offset-white animate-scale-pulse"
        >
          Get Started Now
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom Animations for a fluid modern feel */
@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -10px); }
}

.animate-float-slow {
  animation: float-slow 8s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

@keyframes slide-in-down {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-in-down {
  animation: slide-in-down 0.7s ease-out forwards;
}

@keyframes scale-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.animate-scale-pulse {
  animation: scale-pulse 2s infinite ease-in-out;
}

/* Custom Shadows */
.shadow-soft {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
}

.shadow-lg-blue {
  box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.2), /* Tailwind blue-500 tint */
              0 6px 15px -3px rgba(0, 0, 0, 0.05); /* Default shadow */
}

.shadow-lg-md {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'

import 'vue-toastification/dist/index.css'
import 'primeicons/primeicons.css'
import 'animate.css'
import './main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast)
app.mount('#app')

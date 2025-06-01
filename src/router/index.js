import { createWebHistory, createRouter } from 'vue-router'
import DefaultLayout from '../layout/DefaultLayout.vue'
import HomepageView from '../views/HomepageView.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import LoginView from '../views/Auth/LoginView.vue'
import RegisterView from '../views/Auth/RegisterView.vue'
import AboutUs from '../views/AboutUs.vue'
import ContactView from '../views/ContactView.vue'
import HowItWorks from '../views/HowItWorks.vue'
import DashboardView from '../components/dashboard/DashboardView.vue'
// Import views for sidebar routes
import MessagesView from '../views/MessagesView.vue'
import ReportsView from '../views/ReportsView.vue'
import SentMessagesView from '../views/SentMessagesView.vue'
import ViewTenants from '@/views/ViewTenants.vue'
import HousesFlatsView from '../views/HousesFlatsView.vue'
import WaterBillsView from '../views/WaterBillsView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import AddNewEmployee from "../views/AddNewEmployee.vue"
import PaymentReceivedView from '../views/PaymentReceivedView.vue'
import PaymentAllocationsView from '../views/PaymentAllocationsView.vue'
import MainAccountView from '../views/MainAccountView.vue'
import InvoicesView from '../views/InvoicesView.vue'
import AddNewTenant from '../views/AddNewTenant.vue'
import EditTenants from '../views/EditTenants.vue'

const routes = [
  // Public Routes (No Sidebar, Navbar visible)
  {
    path: '/',
    name: 'Home Page',
    component: HomepageView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'Sign Up',
    component: RegisterView,
  },
  {
    path: '/about-us',
    name: 'About Us',
    component: AboutUs,
  },
  {
    path: '/contact',
    name: 'Contact Us',
    component: ContactView,
  },
  {
    path: '/how-it-works',
    name: 'How It Works',
    component: HowItWorks,
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/messages',
        name: 'Messages',
        component: MessagesView,
        meta: { requiresAuth: true },
      },

      {
        path: 'dashboard/reports',
        name: 'Reports',
        component: ReportsView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/sent-messages',
        name: 'SentMessages',
        component: SentMessagesView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/add-tenants',
        name: 'Add Tenants',
        component: AddNewTenant,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/tenants/edit/:id',
        name: 'edit Tenant',
        component: EditTenants,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/view-tenants',
        name: 'Tenants',
        component: ViewTenants,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/houses-flats',
        name: 'HousesFlats',
        component: HousesFlatsView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/water-bills',
        name: 'WaterBills',
        component: WaterBillsView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/employees',
        name: 'Employees',
        component: EmployeesView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/employees/add',
        name: 'Add Employees',
        component: AddNewEmployee,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/payment-received',
        name: 'PaymentReceived',
        component: PaymentReceivedView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/payment-allocations',
        name: 'PaymentAllocations',
        component: PaymentAllocationsView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/main-account',
        name: 'MainAccount',
        component: MainAccountView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/invoices',
        name: 'Invoices',
        component: InvoicesView,
        meta: { requiresAuth: true },
      },
    ],
  },
  // 404 Route
  {
    path: '/:catchAll(.*)*',
    name: 'Not found',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guard for Authentication
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('authToken') // Basic auth check
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

//   if (requiresAuth && !isAuthenticated) {
//     next({ name: 'Login', query: { redirect: to.fullPath } }) // Redirect to login if not authenticated
//   } else if (isAuthenticated && (to.name === 'Login' || to.name === 'Sign Up')) {
//     next({ name: 'Dashboard' }) // Redirect authenticated users away from login/signup
//   } else {
//     next() // Proceed as normal
//   }
// })

export default router

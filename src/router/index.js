import { createWebHistory, createRouter } from 'vue-router'
import HomepageView from '../views/common/HomepageView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import AboutUs from '@/views/common/AboutUs.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import ContactView from '@/views/common/ContactView.vue'
import HowItWorks from '@/views/common/HowItWorks.vue'
import DashboardView from '@/components/dashboard/DashboardView.vue'
import NotFoundPage from '@/views/common/NotFoundPage.vue'
// Import views for sidebar routes
import MessagesView from '@/components/messages/MessagesView.vue'
import ReportsView from '@/components/reports/ReportsView.vue'
import SentMessagesView from '@/components/messages/SentMessagesView.vue'
import AddNewTenant from '@/components/tenants/AddNewTenant.vue'
import HousesFlatsView from '@/components/properties/HousesFlatsView.vue'
import WaterBillsView from '@/components/bills/WaterBillsView.vue'
import EmployeesView from '@/components/employees/EmployeesView.vue'
import AddNewEmployee from '@/components/employees/AddNewEmployee.vue'
import AddPayment from '@/components/payments/AddPayment.vue'
import InvoicesView from '@/components/invoices/InvoicesView.vue'
import AddApartment from '@/components/properties/AddApartment.vue'
import PaymentReceivedView from '@/components/payments/PaymentReceivedView.vue'
import AddInvoice from '@/components/invoices/AddInvoice.vue'
import MessageDetails from '@/components/messages/MessageDetails.vue'
import PaymentDetails from '@/components/payments/PaymentDetails.vue'
import TenantDetails from '@/components/tenants/TenantDetails.vue'
import EditTenant from '@/components/tenants/EditTenant.vue'
import AllocateHouse from '@/components/tenants/AllocateHouse.vue'
import TenantManagementVue from '@/components/tenants/TenantManagement.vue'

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
        path: 'dashboard/sent-messages/:id',
        name: 'MessageDetails',
        component: MessageDetails,
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
        component: EditTenant,
        meta: { requiresAuth: true },
      },
      {
        path: '/dashboard/tenants/:id/allocate-house',
        name: 'Allocate house',
        component: AllocateHouse,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/tenants',
        name: 'Tenants',
        component: TenantManagementVue,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/tenants/:id',
        name: 'Tenants Details',
        component: TenantDetails,
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
        path: 'dashboard/payments/add',
        name: 'AddPayment',
        component: AddPayment,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/payments/:id',
        name: 'payment details',
        component: PaymentDetails,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/invoices',
        name: 'Invoices',
        component: InvoicesView,
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard/invoices/add',
        name: 'Add Invoices',
        component: AddInvoice,
        meta: { requiresAuth: true },
      },
      {
        path: '/dashboard/invoices/:id',
        name: 'InvoiceDetails',
        component: () => import('@/components/invoices/InvoiceDetails.vue'),
      },

      {
        path: '/dashboard/houses/add',
        name: 'Add Houses',
        component: AddApartment,
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
router.beforeEach((to, from, next) => {
  const isauthenticated = localStorage.getItem('authToken')
  if (to.meta.requiresAuth && !isauthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import SpecificBusiness from "@/views/SpecificBusiness";
import { auth } from '../firebase'
import SpecificBusinessB from "@/views/SpecificBusinessB";

Vue.use(VueRouter)

const GRILMAN = 'גרילמן';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/' + GRILMAN + '/:name',
    name: 'SpecificBusiness',
    component: SpecificBusiness,
  },
      {
    path: '/zzzzz',
    name: 'SpecificBusinessB',
    component: SpecificBusinessB,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/admin/settings',
    name: 'settings',
    component: () => import( /* webpackChunkName: "settings" */ '../views/Settings.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// navigation guard to check for logged in users
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router

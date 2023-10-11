import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { protectedRoute } from '@/router/guards/protectedRoute'
import { NamedRoute, NamedRouteRecord } from '@/router/routes'
import { RouteGuardExecutioner } from '@/services'

const routes: NamedRouteRecord<NamedRoute>[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/:tab?',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      guards: [protectedRoute],
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
})

router.beforeEach(async (to, from) => {
  return await RouteGuardExecutioner.before(to, from)
})

router.afterEach((to, from) => {
  if (to.fullPath !== from.fullPath) {
    document.title = 'Prefect Server'
  }

  return RouteGuardExecutioner.after(to, from)
})
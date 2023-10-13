import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { protectedRoute } from '@/router/guards/protectedRoute'
import { NamedRoute, NamedRouteRecord } from '@/router/routes'
import { RouteGuardExecutioner } from '@/services'
import { capitalize, fromKebabCase } from '@/utilities'

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
    if (typeof to.params.tab === 'string') {
      const title = fromKebabCase(to.params.tab)
      document.title = capitalize(title)
    }
  }

  return RouteGuardExecutioner.after(to, from)
})
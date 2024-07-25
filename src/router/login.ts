import { createRoute } from '@kitbag/router'

export const loginRoutes = [
  createRoute({
    name: 'login',
    path: '/login',
    component: () => import('@/views/LoginView.vue'),
  }),
  createRoute({
    name: 'logout',
    path: '/logout',
    component: () => import('@/views/LogoutView.vue'),
  }),
] as const
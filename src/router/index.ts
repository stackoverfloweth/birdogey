import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { NamedRoute, NamedRouteRecord } from '@/router/routes'

const routes: NamedRouteRecord<NamedRoute>[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
})

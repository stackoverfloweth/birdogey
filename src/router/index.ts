import { createRouter, createRoute, query } from '@kitbag/router'
import { createEventsRoutes } from '@/router/events'
import { protectedRoute } from '@/router/guards'
import { loginRoutes } from '@/router/login'
import { createPlayersRoutes } from '@/router/players'
import Login from '@/views/LoginView.vue'
import NotFound from '@/views/NotFoundView.vue'

const authenticated = createRoute({
  path: '/',
  onBeforeRouteEnter: [protectedRoute],
})

const home = createRoute({
  name: 'home',
  parent: authenticated,
  path: '[?seasonId]',
  query: query('select=[?select]', { select: Boolean }),
  component: () => import('@/views/HomeView.vue'),
})

const dashboard = createRoute({
  parent: authenticated,
  path: '[seasonId]',
  query: query('select=[?select]', { select: Boolean }),
})

const routes = [
  ...loginRoutes,
  authenticated,
  home,
  dashboard,
  ...createPlayersRoutes(dashboard),
  ...createEventsRoutes(dashboard),
] as const

export const router = createRouter(routes, {
  rejections: {
    NotFound: NotFound,
    NotAuthorized: Login,
  },
})
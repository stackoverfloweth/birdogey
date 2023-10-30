import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { protectedRoute, savedRoute, adminRoute } from '@/router/guards'
import { NamedRoute, NamedRouteRecord } from '@/router/routes'
import { RouteGuardExecutioner } from '@/services'

const routes: NamedRouteRecord<NamedRoute>[] = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/',
    name: 'logout',
    component: () => import('@/views/LogoutView.vue'),
  },
  {
    path: '/',
    meta: {
      guards: [protectedRoute, savedRoute],
    },
    children: [
      {
        path: ':seasonId?',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: ':seasonId',
        children: [
          {
            path: 'players',
            children: [
              {
                path: '',
                name: 'players.list',
                component: () => import('@/views/PlayersListView.vue'),
              },
              {
                path: 'create',
                name: 'players.create',
                component: () => import('@/views/PlayersCreateView.vue'),
              },
              {
                path: ':playerId/edit',
                name: 'players.edit',
                component: () => import('@/views/PlayersEditView.vue'),
                meta: {
                  guards: [adminRoute],
                },
              },
            ],
          },
          {
            path: 'events',
            children: [
              {
                path: '',
                name: 'events.list',
                component: () => import('@/views/EventsListView.vue'),
              },
              {
                path: 'create',
                name: 'events.create',
                component: () => import('@/views/EventsCreateView.vue'),
                meta: {
                  guards: [adminRoute],
                },
              },
              {
                path: ':eventId',
                name: 'events.view',
                component: () => import('@/views/EventsView.vue'),
              },
              {
                path: ':eventId/edit',
                name: 'events.edit',
                component: () => import('@/views/EventsEditView.vue'),
                meta: {
                  guards: [adminRoute],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
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
    if (typeof to.params.event === 'string') {
      // todo: get event name
    }
  }

  return RouteGuardExecutioner.after(to, from)
})
import { createRouter, createRoutes, query } from '@kitbag/router'
import { protectedRoute, adminRoute } from '@/router/guards'
import Login from '@/views/LoginView.vue'
import NotFound from '@/views/NotFoundView.vue'

const routes = createRoutes([
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
    onBeforeRouteEnter: [protectedRoute],
    children: createRoutes([
      {
        name: 'home',
        path: '[?seasonId]',
        query: query('selection=[?selection]', { selection: Boolean }),
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: '[seasonId]',
        query: query('selection=[?selection]', { selection: Boolean }),
        children: createRoutes([
          {
            name: 'players',
            path: 'players',
            children: createRoutes([
              {
                path: '',
                name: 'list',
                component: () => import('@/views/PlayersListView.vue'),
              },
              {
                path: 'create',
                name: 'create',
                component: () => import('@/views/PlayersCreateView.vue'),
              },
              {
                path: '[playerId]/edit',
                name: 'edit',
                component: () => import('@/views/PlayersEditView.vue'),
                meta: {
                  guards: [adminRoute],
                },
              },
            ]),
          },
          {
            name: 'events',
            path: 'events',
            children: createRoutes([
              {
                path: '',
                name: 'list',
                component: () => import('@/views/EventsListView.vue'),
              },
              {
                path: 'create',
                name: 'create',
                component: () => import('@/views/EventsCreateView.vue'),
                meta: {
                  guards: [adminRoute],
                },
              },
              {
                path: '[eventId]',
                name: 'view',
                component: () => import('@/views/EventsView.vue'),
              },
              {
                path: '[eventId]/edit',
                name: 'edit',
                component: () => import('@/views/EventsEditView.vue'),
                meta: {
                  guards: [adminRoute],
                },
              },
            ]),
          },
        ]),
      },
    ]),
  },
])

export const router = createRouter(routes, {
  rejections: {
    NotFound: NotFound,
    NotAuthorized: Login,
  },
})
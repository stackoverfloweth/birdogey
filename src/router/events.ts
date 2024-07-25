import { createRoute, Route } from '@kitbag/router'
import { adminRoute } from '@/router/guards'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createEventsRoutes<TParent extends Route>(parent: TParent) {
  const events = createRoute({
    parent,
    name: 'events',
    path: '/events',
  })

  return [
    events,
    createRoute({
      parent: events,
      name: 'create',
      path: '/create',
      component: () => import('@/views/EventsCreateView.vue'),
      meta: {
        guards: [adminRoute],
      },
    }),
    createRoute({
      parent: events,
      name: 'edit',
      path: '/[eventId]/edit',
      component: () => import('@/views/EventsEditView.vue'),
      meta: {
        guards: [adminRoute],
      },
    }),
    createRoute({
      parent: events,
      name: 'view',
      path: '/[eventId]',
      component: () => import('@/views/EventsView.vue'),
    }),
    createRoute({
      parent: events,
      name: 'list',
      path: '',
      component: () => import('@/views/EventsListView.vue'),
    }),
  ] as const
}
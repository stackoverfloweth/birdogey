import { createRoute, Route } from '@kitbag/router'
import { adminRoute } from '@/router/guards'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createPlayersRoutes<TParent extends Route>(parent: TParent) {
  const players = createRoute({
    parent,
    name: 'players',
    path: '/players',
  })

  return [
    players,
    createRoute({
      parent: players,
      name: 'create',
      path: '/create',
      component: () => import('@/views/PlayersCreateView.vue'),
    }),
    createRoute({
      parent: players,
      name: 'edit',
      path: '/[playerId]/edit',
      component: () => import('@/views/PlayersEditView.vue'),
      meta: {
        guards: [adminRoute],
      },
    }),
    createRoute({
      parent: players,
      name: 'list',
      path: '',
      component: () => import('@/views/PlayersListView.vue'),
    }),
  ] as const
}
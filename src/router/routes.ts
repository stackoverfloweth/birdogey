import { RouteLocationRaw, RouteRecordRaw } from 'vue-router'

export type RouteFunction = (...args: any[]) => RouteLocationRaw

type RouteFunctionRecord = Record<string, RouteFunction>

export const routes = {
  login: () => ({ name: 'login' } as const),
  logout: () => ({ name: 'logout' } as const),
  home: (seasonId?: string) => ({ name: 'home', params: { seasonId } } as const),
  events: (seasonId: string) => ({ name: 'events.list', params: { seasonId } } as const),
  event: (eventId: string) => ({ name: 'events.view', params: { eventId } } as const),
  eventCreate: (seasonId: string) => ({ name: 'events.create', params: { seasonId } } as const),
  eventEdit: (eventId: string) => ({ name: 'events.edit', params: { eventId } } as const),
  players: (seasonId: string) => ({ name: 'players.list', params: { seasonId } } as const),
  playerCreate: (seasonId: string) => ({ name: 'players.create', params: { seasonId } } as const),
  playerEdit: (seasonId: string, playerId: string) => ({ name: 'players.edit', params: { seasonId, playerId } } as const),
  notFound: () => ({ name: 'notFound' } as const),
} satisfies RouteFunctionRecord

export type Routes = typeof routes
export type NamedRoute = ReturnType<Routes[keyof Routes]>['name']

type NamedRouteRecordParent<T extends string> = { name?: T, children: NamedRouteRecord<T>[] }
type NamedRouteRecordChild<T extends string> = { name: T }
export type NamedRouteRecord<T extends string> =
    | (Omit<RouteRecordRaw, 'name' | 'children'> & NamedRouteRecordParent<T>)
    | NamedRouteRecordChild<T>

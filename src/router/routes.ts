import { RouteLocationRaw, RouteRecordRaw } from 'vue-router'

export type RouteFunction = (...args: unknown[]) => RouteLocationRaw

type RouteFunctionRecord = Record<string, RouteFunction>

export const routes = {
  home: () => ({ name: 'Home' } as const),
} satisfies RouteFunctionRecord

export type Routes = typeof routes
export type NamedRoute = ReturnType<Routes[keyof Routes]>['name']

type NamedRouteRecordParent<T extends string> = { name?: T, children: NamedRouteRecord<T>[] }
type NamedRouteRecordChild<T extends string> = { name: T }
export type NamedRouteRecord<T extends string> =
    | (Omit<RouteRecordRaw, 'name' | 'children'> & NamedRouteRecordParent<T>)
    | NamedRouteRecordChild<T>

import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { MaybePromise } from '@/types/promise'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type RouteGuardReturn = MaybePromise<void | Error | RouteLocationRaw | boolean>

export interface RouteGuard {
  before?: (to: RouteLocationNormalized, from: RouteLocationNormalized) => RouteGuardReturn,
  after?: (to: RouteLocationNormalized, from: RouteLocationNormalized) => void,
}

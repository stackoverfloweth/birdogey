import { BeforeRouteHook } from '@kitbag/router'
import { auth } from '@/services'

export const protectedRoute: BeforeRouteHook = (to, { reject }) => {
  if (!auth.isAuthorized) {
    reject('NotAuthorized')
  }
}
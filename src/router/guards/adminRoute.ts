import { BeforeRouteHook } from '@kitbag/router'
import { auth } from '@/services'

export const adminRoute: BeforeRouteHook = (to, { push }) => {
  if (!auth.isAdmin) {
    // push('logout')
  }
}
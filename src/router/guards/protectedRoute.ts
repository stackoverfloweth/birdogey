import { returnRoute } from '@/router/guards/savedRoute'
import { routes } from '@/router/routes'
import { auth } from '@/services'
import { RouteGuard } from '@/types'

export const protectedRoute: RouteGuard = {
  before: (to) => {
    if (!auth.isAuthorized) {
      returnRoute.value = to

      return routes.login()
    }
  },
}

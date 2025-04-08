import { routes } from '@/router/routes'
import { auth } from '@/services'
import { RouteGuard } from '@/types'

export const adminRoute: RouteGuard = {
  before: () => {
    if (!auth.isAdmin) {
      return routes.logout()
    }
  },
}

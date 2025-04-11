import { routes } from '@/router/routes'
import { auth } from '@/services'
import { RouteGuard } from '@/types'

export const moderatorRoute: RouteGuard = {
  before: () => {
    if (auth.isReadonly) {
      return routes.logout()
    }
  },
}

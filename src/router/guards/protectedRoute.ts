import { validated } from '@/composables'
import { returnRoute } from '@/router/guards/savedRoute'
import { routes } from '@/router/routes'
import { RouteGuard } from '@/types'

export const protectedRoute: RouteGuard = {
  before: (to) => {
    if (!validated.value) {
      returnRoute.value = to

      return routes.login()
    }
  },
}
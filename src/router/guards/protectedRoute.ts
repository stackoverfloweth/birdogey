import { validated } from '@/composables'
import { routes } from '@/router/routes'
import { RouteGuard } from '@/types'

export const protectedRoute: RouteGuard = {
  before: () => {
    if (!validated.value) {
      return routes.login()
    }
  },
}
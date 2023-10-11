import { validated } from '@/composables'
import { RouteGuard } from '@/types'

export const protectedRoute: RouteGuard = {
  before: () => {
    return !validated.value
  },
}
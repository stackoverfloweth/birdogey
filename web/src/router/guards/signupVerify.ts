import { RouteGuard } from '@/types'

export const signupVerify: RouteGuard = {
  before: (to) => {
    if (!to.params.key) {
      return { name: 'notFound' }
    }
  },
}

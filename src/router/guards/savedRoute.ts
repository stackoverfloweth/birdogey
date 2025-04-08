import { ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router'
import { auth } from '@/services'
import { RouteGuard } from '@/types'

export const returnRoute = ref<RouteLocationNormalized>()

export const savedRoute: RouteGuard = {
  before: () => {
    if (auth.isAuthorized && returnRoute.value) {
      const override = { ...returnRoute.value }

      returnRoute.value = undefined

      return override
    }
  },
}

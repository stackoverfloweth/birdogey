import { ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router'
import { validated } from '@/composables'
import { RouteGuard } from '@/types'

export const returnRoute = ref<RouteLocationNormalized>()

export const savedRoute: RouteGuard = {
  before: () => {
    if (validated.value && returnRoute.value) {
      const override = { ...returnRoute.value }

      returnRoute.value = undefined

      return override
    }
  },
}
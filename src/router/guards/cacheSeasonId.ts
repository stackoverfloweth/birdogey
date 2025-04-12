import { RouteGuard } from '@/types'
import { useLocalStorage } from '@/composables/useLocalStorage'

const { value: storedSeasonId, set: setStoredSeasonId } = useLocalStorage('BIRDOGEY_SELECTED_SEASON')

export const cacheSeasonId: RouteGuard = {
  before: (to) => {
    if (to.params.seasonId) {
      setStoredSeasonId(to.params.seasonId as string)
    } else if (storedSeasonId.value) {
      return { ...to, params: { seasonId: storedSeasonId.value } }
    }
  },
}

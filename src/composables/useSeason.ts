import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
import { MaybeRefOrGetter, Ref, computed, ref, toValue } from 'vue'
import { useApi } from '@/composables/useApi'
import { Season } from '@/models'

export type UseSeason = {
  season: Ref<Season | undefined>,
}

const season = ref<Season>()

export function useSeason(seasonId?: MaybeRefOrGetter<string | null | undefined>): UseSeason {
  const api = useApi()

  const subscriptionArgs = computed<Parameters<typeof api.seasons.getById> | null>(() => {
    const value = toValue(seasonId)
    return value ? [value] : null
  })

  useSubscriptionWithDependencies(api.seasons.getById, subscriptionArgs)
    .promise()
    .then(({ response }) => season.value = response ?? undefined)

  return { season }
}
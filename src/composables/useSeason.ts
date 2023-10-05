import { Ref, ref } from 'vue'
import { Season } from '@/models'

export type UseSeason = {
  season: Ref<Season | undefined>,
}

const season = ref<Season>()

export function useSeason(): UseSeason {
  return { season }
}
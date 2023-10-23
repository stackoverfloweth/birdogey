import { Ref, ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useSavedContext } from '@/composables/useSavedContext'
import { env } from '@/utilities'

export const validated = ref(false)
export const isAdmin = ref(false)

export type UseSiteProtection = {
  validated: Ref<boolean>,
  attempt: (value: string) => Promise<boolean>,
}

export function useSiteProtection(): UseSiteProtection {
  const { courseId, seasonId } = useSavedContext()
  const api = useApi()

  async function attempt(value: string): Promise<boolean> {
    isAdmin.value = env().adminPassword === value

    validated.value = isAdmin.value || await checkSeasonPassword(value)

    return validated.value
  }

  async function checkSeasonPassword(value: string): Promise<boolean> {
    const season = await api.seasons.attemptLogin(value)

    if (season) {
      courseId.value = season.courseId
      seasonId.value = season.id

      return true
    }

    return false
  }

  return {
    attempt,
    validated,
  }
}
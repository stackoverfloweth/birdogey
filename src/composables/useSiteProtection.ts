import { Ref, ref } from 'vue'
import { env } from '@/utilities'

export const validated = ref(false)
export const isAdmin = ref(false)

export type UseSiteProtection = {
  validated: Ref<boolean>,
  attempt: (value: string) => boolean,
}

export function useSiteProtection(): UseSiteProtection {
  function attempt(value: string): boolean {
    isAdmin.value = env().adminPassword === value
    validated.value = isAdmin.value || env().readonlyPassword === value

    return validated.value
  }

  return {
    attempt,
    validated,
  }
}
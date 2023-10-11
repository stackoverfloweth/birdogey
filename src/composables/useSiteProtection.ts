import { Ref, ref } from 'vue'
import { env } from '@/utilities'

export const validated = ref(false)

export type UseSiteProtection = {
  validated: Ref<boolean>,
  attempt: (value: string) => boolean,
}

export function useSiteProtection(): UseSiteProtection {
  function attempt(value: string): boolean {
    validated.value = value === env().sitePassword

    return validated.value
  }

  return {
    attempt,
    validated,
  }
}
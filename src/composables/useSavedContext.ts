import { useLocalStorage } from '@prefecthq/vue-compositions'
import { Ref, computed } from 'vue'
import { SavedContext } from '@/types'

export type UseSavedContext = {
  courseId: Ref<string | undefined>,
  seasonId: Ref<string | undefined>,
  setSavedContext: (value: {
    courseId?: string | undefined,
    seasonId?: string | undefined,
  }) => void,
}

export function useSavedContext(): UseSavedContext {
  const { value: savedContext, set: setSavedContext } = useLocalStorage<SavedContext>('context', {})

  const courseId = computed({
    get() {
      return savedContext.value.courseId
    },
    set(value) {
      setSavedContext({
        ...savedContext.value,
        courseId: value,
      })
    },
  })

  const seasonId = computed({
    get() {
      return savedContext.value.seasonId
    },
    set(value) {
      setSavedContext({
        ...savedContext.value,
        seasonId: value,
      })
    },
  })

  return {
    courseId,
    seasonId,
    setSavedContext,
  }
}
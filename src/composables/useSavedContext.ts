import { useLocalStorage } from '@prefecthq/vue-compositions'
import { Ref, computed, ref, watch } from 'vue'
import { SavedContext } from '@/types'

export type UseSavedContext = {
  courseId: Ref<string | undefined>,
  seasonId: Ref<string | undefined>,
  hasContext: Ref<boolean>,
}

const courseId = ref<string>()
const seasonId = ref<string>()

export function useSavedContext(): UseSavedContext {
  const { value: savedContext, set: setSavedContext } = useLocalStorage<SavedContext>('context', {})

  courseId.value = savedContext.value.courseId
  seasonId.value = savedContext.value.seasonId

  const hasContext = computed(() => !!courseId.value && !!seasonId.value)

  watch([courseId, seasonId], ([courseId, seasonId]) => setSavedContext({ courseId, seasonId }))

  return {
    courseId,
    seasonId,
    hasContext,
  }
}
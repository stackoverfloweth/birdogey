import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
import { MaybeRefOrGetter, Ref, computed, ref, toValue } from 'vue'
import { useApi } from '@/composables/useApi'
import { Course } from '@/models'

export type UseCourse = {
  course: Ref<Course | undefined>,
}

const course = ref<Course>()

export function useCourse(courseId?: MaybeRefOrGetter<string | null | undefined>): UseCourse {
  const api = useApi()

  const subscriptionArgs = computed<Parameters<typeof api.courses.getById> | null>(() => {
    const value = toValue(courseId)
    return value ? [value] : null
  })

  useSubscriptionWithDependencies(api.courses.getById, subscriptionArgs)
    .promise()
    .then(({ response }) => course.value = response ?? undefined)

  return { course }
}
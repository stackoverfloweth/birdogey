import { Ref, ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useSavedContext } from '@/composables/useSavedContext'
import { Course } from '@/models'

export const validated = ref(false)
export const courseAdminFor = ref<Course[]>([])
export const isAdmin = ref(false)

export type UseSiteProtection = {
  validated: Ref<boolean>,
  attempt: (value: string) => Promise<boolean>,
}

export function useSiteProtection(): UseSiteProtection {
  const { courseId, seasonId } = useSavedContext()
  const api = useApi()

  async function attempt(value: string): Promise<boolean> {
    isAdmin.value = await checkCoursePassword(value)

    validated.value = isAdmin.value || await checkSeasonPassword(value)

    return validated.value
  }

  async function checkCoursePassword(value: string): Promise<boolean> {
    courseAdminFor.value = await api.courses.attemptLogin(value)

    if (courseAdminFor.value.length) {
      const shouldDefaultToSingleCourse = courseAdminFor.value.length === 1

      if (shouldDefaultToSingleCourse) {
        const [onlyCourse] = courseAdminFor.value

        courseId.value = onlyCourse.id
      }

      return true
    }

    return false
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
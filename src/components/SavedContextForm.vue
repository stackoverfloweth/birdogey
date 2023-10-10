<script lang="ts" setup>
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, toValue, watch } from 'vue'
  import CourseSelect from '@/components/CourseSelect.vue'
  import SeasonSelect from '@/components/SeasonSelect.vue'
  import { SavedContext } from '@/types'

  const props = defineProps<{
    initialValues?: Partial<SavedContext>,
  }>()

  const emit = defineEmits<{
    submit: [value: SavedContext],
  }>()

  const { validate, pending } = useValidationObserver()
  const courseId = ref(props.initialValues?.courseId)
  const seasonId = ref(props.initialValues?.seasonId)

  watch(courseId, (value, previous) => {
    if (seasonId.value && value !== previous) {
      seasonId.value = undefined
    }
  })

  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const { error: courseErrorMessage, state: courseState } = useValidation(courseId, 'Course', [isRequired])
  const { error: seasonErrorMessage, state: seasonState } = useValidation(seasonId, 'Season', [isRequired])

  async function submit(): Promise<void> {
    const valid = await validate()

    if (valid) {
      emit('submit', toValue({ courseId: courseId.value, seasonId: seasonId.value }))
    }
  }
</script>

<template>
  <p-form class="saved-context-form" @submit="submit">
    <p-label label="Course" :message="courseErrorMessage" :state="courseState">
      <template #default="{ id }">
        <CourseSelect :id="id" v-model="courseId" :state="courseState" />
      </template>
    </p-label>

    <p-label label="Season" :message="seasonErrorMessage" :state="seasonState">
      <template #default="{ id }">
        <SeasonSelect :id="id" v-model="seasonId" :course-id="courseId" :state="seasonState" />
      </template>
    </p-label>

    <template #footer>
      <p-button type="submit" :disabled="pending" primary>
        Select
      </p-button>
    </template>
  </p-form>
</template>
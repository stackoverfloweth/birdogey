<script lang="ts" setup>
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, toValue } from 'vue'
  import CourseSelect from '@/components/CourseSelect.vue'
  import SeasonSelect from '@/components/SeasonSelect.vue'
  import { SavedContext } from '@/types'

  const props = defineProps<{
    isOpen: boolean,
    courseId: string | undefined,
    seasonId: string | undefined,
  }>()

  const emit = defineEmits<{
    'update:isOpen': [value: boolean],
    'submit': [value: SavedContext],
  }>()

  const isOpen = computed({
    get() {
      return props.isOpen
    },
    set(value) {
      emit('update:isOpen', value)
    },
  })

  const { validate, pending } = useValidationObserver()
  const courseId = ref(props.courseId)
  const seasonId = ref(props.seasonId)

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
  <p-modal v-model:show-modal="isOpen" title="Select Season" class="season-selection-modal" auto-close>
    <p-form @submit="submit">
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
    </p-form>
    <template #actions>
      <p-button :disabled="pending" primary @click="submit">
        Select
      </p-button>
    </template>
  </p-modal>
</template>
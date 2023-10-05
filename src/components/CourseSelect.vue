<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useApi } from '@/composables'

  const props = defineProps<{
    modelValue?: string | undefined | null,
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string | null],
  }>()

  const api = useApi()
  const courseSubscription = useSubscription(api.courses.getList)
  const courses = computed(() => courseSubscription.response ?? [])
  const options = computed(() => courses.value.map(course => ({
    label: course.name,
    value: course.id,
  })))

  const modelValue = computed({
    get() {
      return props.modelValue ?? null
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })
</script>

<template>
  <p-select v-model="modelValue" class="course-select" :options="options">
    <template v-if="courseSubscription.loading" #empty-message>
      <p-loading-icon />
    </template>
  </p-select>
</template>
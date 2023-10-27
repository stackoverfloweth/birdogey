<script lang="ts" setup>
  import { computed } from 'vue'
  import { courseAdminFor } from '@/composables'

  const props = defineProps<{
    modelValue?: string | undefined | null,
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string | null],
  }>()

  const options = computed(() => courseAdminFor.value.map(course => ({
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
  <p-select v-model="modelValue" class="course-select" :options="options" />
</template>
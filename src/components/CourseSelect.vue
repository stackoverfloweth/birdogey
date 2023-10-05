<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    modelValue?: string | undefined | null,
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string | null],
  }>()

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
  <p-select v-model="modelValue" class="course-select" :options="['a', 'b', 'c']" />
</template>
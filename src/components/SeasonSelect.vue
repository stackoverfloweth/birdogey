<script lang="ts" setup>
  import { computed } from 'vue'
  import { Season } from '@/models'

  const props = defineProps<{
    courseId?: string,
    modelValue?: Season | null | undefined,
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: Season | null],
  }>()

  const modelValue = computed({
    get() {
      return props.modelValue ?? null
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })

  const options = computed<Season[]>(() => [])

  const seasonId = computed({
    get() {
      return modelValue.value?.id
    },
    set(value) {
      modelValue.value = options.value.find(season => season.id === value) ?? null
    },
  })
</script>

<template>
  <p-select v-model="seasonId" :disabled="!courseId" class="season-select" :options="['1', '2', '3']" />
</template>
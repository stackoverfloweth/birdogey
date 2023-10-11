<script lang="ts" setup>
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useApi } from '@/composables'

  const props = defineProps<{
    courseId?: string,
    modelValue?: string | undefined | null,
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string | undefined | null],
  }>()

  const api = useApi()
  const subscriptionArgs = computed<Parameters<typeof api.seasons.getList> | null>(() => props.courseId ? [props.courseId] : null)
  const seasonSubscription = useSubscriptionWithDependencies(api.seasons.getList, subscriptionArgs)
  const seasons = computed(() => seasonSubscription.response ?? [])
  const options = computed(() => seasons.value.map(season => ({
    label: season.name,
    value: season.id,
  })))

  const modelValue = computed({
    get() {
      return props.modelValue ?? null
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })

  const seasonId = computed({
    get() {
      return modelValue.value
    },
    set(value) {
      modelValue.value = value
    },
  })
</script>

<template>
  <p-select v-model="seasonId" :disabled="!courseId || seasonSubscription.loading" class="season-select" :options="options">
    <template v-if="seasonSubscription.loading" #empty-message>
      <p-loading-icon />
    </template>
  </p-select>
</template>
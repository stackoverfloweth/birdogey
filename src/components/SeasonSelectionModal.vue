<script lang="ts" setup>
  import { computed } from 'vue'
  import SavedContextForm from '@/components/SavedContextForm.vue'
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

  function submit(request: SavedContext): void {
    emit('submit', request)
    isOpen.value = false
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" title="Select Season" class="season-selection-modal" auto-close>
    <SavedContextForm :initial-values="{ courseId, seasonId }" @submit="submit" />
  </p-modal>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import CourseSelect from '@/components/CourseSelect.vue'
  import SeasonSelect from '@/components/SeasonSelect.vue'
  import { useSeason } from '@/composables'

  const props = defineProps<{
    isOpen: boolean,
  }>()

  const emit = defineEmits<{
    'update:isOpen': [value: boolean],
  }>()

  const courseId = ref<string>()
  const { season } = useSeason()

  const isOpen = computed({
    get() {
      return props.isOpen
    },
    set(value) {
      emit('update:isOpen', value)
    },
  })
</script>

<template>
  <p-modal v-model:show-modal="isOpen" class="season-selection-modal">
    <CourseSelect v-model="courseId" />
    <SeasonSelect v-model="season" :course-id="courseId" />
  </p-modal>
</template>
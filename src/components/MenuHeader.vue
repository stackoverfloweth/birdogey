<script lang="ts" setup>
  import { useBoolean } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import SeasonSelectionModal from '@/components/SeasonSelectionModal.vue'
  import { useCourse, useSavedContext, useSeason } from '@/composables'

  const { value, toggle } = useBoolean()
  const { courseId, seasonId, setSavedContext } = useSavedContext()
  const { course } = useCourse(courseId)
  const { season } = useSeason(seasonId)

  const contextDisplay = computed(() => {
    if (!course.value || !season.value) {
      return
    }

    return `${course.value.name} / ${season.value.name}`
  })
</script>

<template>
  <div class="menu-header">
    <p-icon class="menu-header__icon" icon="LifebuoyIcon" />
    <div class="menu-header__actions">
      <p-button primary @click.stop="toggle">
        {{ contextDisplay ?? 'Select Season' }}
      </p-button>
      <p-button icon="UserCircleIcon" />
    </div>
    <SeasonSelectionModal v-model:isOpen="value" :course-id="courseId" :season-id="seasonId" @submit="setSavedContext" />
  </div>
</template>

<style>
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-header__actions {
  display: flex;
  gap: var(--space-xs);
  align-items: center;
}

.menu-header__icon {
  height: 42px;
  width: 42px;
  color: var(--p-color-button-primary-bg);
}
</style>
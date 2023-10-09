<script lang="ts" setup>
  import { useBoolean, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import PlayersManage from '@/components/PlayersManage.vue'
  import SeasonSelectionModal from '@/components/SeasonSelectionModal.vue'
  import { useApi, useSavedContext } from '@/composables'

  const { value: showSeasonModal, toggle: toggleSeasonModal } = useBoolean()
  const { value: showPlayersModal, toggle: togglePlayersModal } = useBoolean()
  const { courseId, seasonId, setSavedContext, hasContext } = useSavedContext()

  const api = useApi()

  const seasonArgs = computed<Parameters<typeof api.seasons.getById> | null>(() => seasonId.value ? [seasonId.value] : null)
  const seasonSubscription = useSubscriptionWithDependencies(api.seasons.getById, seasonArgs)

  const courseArgs = computed<Parameters<typeof api.courses.getById> | null>(() => courseId.value ? [courseId.value] : null)
  const courseSubscription = useSubscriptionWithDependencies(api.courses.getById, courseArgs)

  const contextDisplay = computed(() => {
    if (!courseSubscription.response || !seasonSubscription.response) {
      return
    }

    return `${courseSubscription.response.name} / ${seasonSubscription.response.name}`
  })
</script>

<template>
  <div class="menu-header">
    <p-icon class="menu-header__icon" icon="LifebuoyIcon" />
    <div class="menu-header__actions">
      <p-button :primary="!hasContext" @click.stop="toggleSeasonModal">
        {{ contextDisplay }}
      </p-button>
      <p-button icon="UserCircleIcon" @click.stop="togglePlayersModal" />
    </div>
    <SeasonSelectionModal v-model:isOpen="showSeasonModal" :course-id="courseId" :season-id="seasonId" @submit="setSavedContext" />
    <PlayersManage v-if="seasonId" v-model:isOpen="showPlayersModal" :season-id="seasonId" />
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
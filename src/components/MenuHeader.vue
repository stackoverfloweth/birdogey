<script lang="ts" setup>
  import { useBoolean, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import Birdogey from '@/assets/birdogey.svg?component'
  import Club from '@/assets/club.svg?component'
  import PlayersManage from '@/components/PlayersManage.vue'
  import SeasonSelectionModal from '@/components/SeasonSelectionModal.vue'
  import { useApi, useSavedContext, validated } from '@/composables'
  import { routes } from '@/router/routes'
  import { SavedContext } from '@/types'

  const { value: showSeasonModal, toggle: toggleSeasonModal } = useBoolean()
  const { value: showPlayersModal, toggle: togglePlayersModal } = useBoolean()
  const { courseId, seasonId, hasContext } = useSavedContext()

  const api = useApi()

  const seasonArgs = computed<Parameters<typeof api.seasons.getById> | null>(() => validated.value && seasonId.value ? [seasonId.value] : null)
  const seasonSubscription = useSubscriptionWithDependencies(api.seasons.getById, seasonArgs)

  const courseArgs = computed<Parameters<typeof api.courses.getById> | null>(() => validated.value && courseId.value ? [courseId.value] : null)
  const courseSubscription = useSubscriptionWithDependencies(api.courses.getById, courseArgs)

  const contextDisplay = computed(() => {
    return `${courseSubscription.response?.name ?? '...'} / ${seasonSubscription.response?.name ?? '...'}`
  })

  function setSavedContext(context: SavedContext): void {
    courseId.value = context.courseId
    seasonId.value = context.seasonId
  }
</script>

<template>
  <div class="menu-header">
    <p-link :to="routes.home()">
      <div class="menu-header__logo">
        <Birdogey class="menu-header__logo--birdogey" height="80" width="180" />
        <Club class="menu-header__logo--club" height="80" width="180" />
      </div>
    </p-link>
    <div v-if="validated" class="menu-header__actions">
      <template v-if="hasContext">
        <p-button @click.stop="toggleSeasonModal">
          {{ contextDisplay }}
        </p-button>
        <p-button icon="UserCircleIcon" @click.stop="togglePlayersModal" />
      </template>
      <template v-else>
        <p-button primary @click.stop="toggleSeasonModal">
          Select Season
        </p-button>
      </template>

      <SeasonSelectionModal v-model:isOpen="showSeasonModal" :course-id="courseId" :season-id="seasonId" @submit="setSavedContext" />
      <PlayersManage v-if="seasonId" v-model:isOpen="showPlayersModal" :season-id="seasonId" />
    </div>
  </div>
</template>

<style>
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.menu-header__actions {
  display: flex;
  gap: var(--space-xs);
  align-items: center;
}

.menu-header__logo {
  color: var(--p-color-button-primary-bg);
  display: flex;
  align-items: center;
}

.menu-header__logo--club {
  color: var(--contrast-gray-800);
}
</style>
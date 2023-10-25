<script lang="ts" setup>
  import { useBoolean, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import PlayersManage from '@/components/PlayersManage.vue'
  import SeasonSelectionModal from '@/components/SeasonSelectionModal.vue'
  import { useApi, useSavedContext, validated, isAdmin } from '@/composables'
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

  const classes = computed(() => ({
    root: {
      'menu-header--validated': validated.value,
    },
  }))

  function setSavedContext(context: SavedContext): void {
    courseId.value = context.courseId
    seasonId.value = context.seasonId
  }
</script>

<template>
  <div class="menu-header" :class="classes.root">
    <p-link :to="routes.home()">
      <img class="menu-header__logo" src="/birdogey.png">
    </p-link>

    <div v-if="validated" class="menu-header__actions">
      <template v-if="hasContext">
        <p-button :disabled="!isAdmin" :flat="!isAdmin" @click.stop="toggleSeasonModal">
          {{ contextDisplay }}
        </p-button>
        <template v-if="isAdmin">
          <p-button icon="UserCircleIcon" @click.stop="togglePlayersModal" />
        </template>
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
  justify-content: center;
  align-items: center;
  row-gap: var(--space-sm);
  flex-wrap: wrap;
}

.menu-header--validated {
  justify-content: space-between;
  align-items: flex-start;
}

.menu-header__logo {
  max-width: 50vw;
}

@media (max-width: 640px) {
  .menu-header {
    justify-content: center;
  }

  .menu-header__logo {
    max-width: 100%;
  }
}

.menu-header__actions {
  display: flex;
  gap: var(--space-xs);
  align-items: center;
}
</style>
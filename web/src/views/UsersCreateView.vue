<script lang="ts" setup>
  import { showToast, Crumb } from '@prefecthq/prefect-design'
  import { useBoolean, useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import UserForm from '@/components/UserForm.vue'
  import UsersList from '@/components/UsersList.vue'
  import { useApi } from '@/composables'
  import { User, UserRequest, Season } from '@birdogey/shared'
  import { routes } from '@/router/routes'
  import { auth } from '@/services'

  const api = useApi()
  const router = useRouter()
  const seasonId = useRouteParam('seasonId')
  const filteredSeasons = ref<string[]>([])

  const playerSubscription = useSubscription(api.users.getList, [filteredSeasons])
  const seasonPlayerSubscription = useSubscription(api.users.getSeasonList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const seasonPlayers = computed(() => seasonPlayerSubscription.response ?? [])
  const playersNotInSeason = computed(() => players.value.filter((player) => !seasonPlayers.value.some((seasonPlayer) => seasonPlayer.id === player.id)))
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  const crumbs = computed<Crumb[]>(() => [
    { text: 'Players', to: routes.users(seasonId.value) },
    { text: 'Create' },
  ])

  function isFiltered(season: Season): boolean {
    return filteredSeasons.value.some((filteredSeason) => filteredSeason === season.id)
  }

  function toggleIsFiltered(season: Season): void {
    if (isFiltered(season)) {
      filteredSeasons.value = filteredSeasons.value.filter((filteredSeason) => filteredSeason !== season.id)
    } else {
      filteredSeasons.value = [...filteredSeasons.value, season.id]
    }
  }

  async function addPlayer(request: UserRequest): Promise<void> {
    startLoading()
    await api.users.create(request)

    showToast('Player Created!', 'success')
    playerSubscription.refresh()
    seasonPlayerSubscription.refresh()
    stopLoading()

    router.push(routes.users(seasonId.value))
  }

  async function addExistingPlayer(player: User): Promise<void> {
    startLoading()
    await api.users.update(player.id, { seasonId: seasonId.value })

    showToast('Player Added!', 'success')
    playerSubscription.refresh()
    seasonPlayerSubscription.refresh()
    stopLoading()

    router.push(routes.users(seasonId.value))
  }
</script>

<template>
  <div class="players-create-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

    <p-card class="players-create-view__existing-players-card">
      <div class="players-create-view__existing-players-filters">
        <template v-for="season in auth.seasons" :key="season.id">
          <p-tag class="players-create-view__existing-players-filter" :class="{ 'players-create-view__existing-players-filter--filtered': isFiltered(season) }" @click="toggleIsFiltered(season)">
            {{ season.course.name }} / {{ season.name }}
          </p-tag>
        </template>
      </div>

      <UsersList class="players-create-view__existing-players" :players="playersNotInSeason" @select="addExistingPlayer" />
    </p-card>

    <p-card>
      <UserForm
        :loading="loading"
        :season-id="seasonId"
        @submit="addPlayer"
        @cancel="router.back"
      />
    </p-card>
  </div>
</template>

<style>
.players-create-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.players-create-view__existing-players-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.players-create-view__existing-players-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.players-create-view__existing-players-filter {
  cursor: pointer;
}

.players-create-view__existing-players-filter--filtered {
  color: white;
  background-color: var(--p-color-focus-ring);
}

.players-create-view__existing-players {
  max-height: 300px;
  overflow-y: auto;
}
</style>

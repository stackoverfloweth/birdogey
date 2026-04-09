<script lang="ts" setup>
  import { showToast, Crumb } from '@prefecthq/prefect-design'
  import { useBoolean, useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import PlayersList from '@/components/PlayersList.vue'
  import { useApi } from '@/composables'
  import { Player, PlayerRequest } from '@birdogey/shared'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const seasonId = useRouteParam('seasonId')

  const playerSubscription = useSubscription(api.players.getList, [])
  const seasonPlayerSubscription = useSubscription(api.players.getSeasonList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const seasonPlayers = computed(() => seasonPlayerSubscription.response ?? [])
  const playersNotInSeason = computed(() => players.value.filter((player) => !seasonPlayers.value.some((seasonPlayer) => seasonPlayer.id === player.id)))
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  const crumbs = computed<Crumb[]>(() => [
    { text: 'Players', to: routes.players(seasonId.value) },
    { text: 'Create' },
  ])

  async function addPlayer(request: PlayerRequest): Promise<void> {
    startLoading()
    await api.players.create(request)

    showToast('Player Created!', 'success')
    playerSubscription.refresh()
    seasonPlayerSubscription.refresh()
    stopLoading()

    router.push(routes.players(seasonId.value))
  }

  async function addExistingPlayer(player: Player): Promise<void> {
    startLoading()
    await api.players.update(player.id, { seasonId: seasonId.value })

    showToast('Player Added!', 'success')
    playerSubscription.refresh()
    seasonPlayerSubscription.refresh()
    stopLoading()

    router.push(routes.players(seasonId.value))
  }
</script>

<template>
  <div class="players-create-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

    <p-card class="players-create-view__existing-players">
      <PlayersList :players="playersNotInSeason" @select="addExistingPlayer" />
    </p-card>

    <p-card>
      <PlayerForm
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

.players-create-view__existing-players {
  max-height: 300px;
  overflow-y: auto;
}
</style>

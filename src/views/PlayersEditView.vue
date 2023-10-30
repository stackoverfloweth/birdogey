<script lang="ts" setup>
  import { Crumb, showToast } from '@prefecthq/prefect-design'
  import { useBoolean, useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import { useApi } from '@/composables'
  import { PlayerRequest } from '@/models'
  import { routes } from '@/router/routes'

  const seasonId = useRouteParam('seasonId')
  const playerId = useRouteParam('playerId')

  const api = useApi()
  const router = useRouter()
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const player = computed(() => players.value.find(({ id }) => id === playerId.value))
  const playerName = computed(() => player.value?.name ?? '...')

  await playerSubscription.promise()

  const crumbs = computed<Crumb[]>(() => [
    { text: 'Players', to: routes.players(seasonId.value) },
    { text: playerName.value },
  ])

  async function updatePlayer(request: PlayerRequest): Promise<void> {
    startLoading()
    await api.players.update(playerId.value, request)

    showToast('Player Updated!', 'success')
    playerSubscription.refresh()
    stopLoading()
  }

  async function deletePlayer(): Promise<void> {
    // eslint-disable-next-line no-alert
    if (!confirm('Are you sure?')) {
      return
    }

    startLoading()
    await api.players.remove(playerId.value)

    showToast(`${player.value?.name} deleted`, 'success')
    playerSubscription.refresh()
    stopLoading()
    router.push(routes.players(seasonId.value))
  }
</script>

<template>
  <div class="players-edit-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

    <p-card>
      <PlayerForm
        :loading="loading"
        :season-id="seasonId"
        :initial-values="player"
        show-remove-button
        @submit="updatePlayer"
        @remove="deletePlayer"
        @cancel="router.back"
      />
    </p-card>
  </div>
</template>

<style>
.players-edit-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
<script lang="ts" setup>
  import { useRoute, useRouter } from '@kitbag/router'
  import { Crumb, showToast } from '@stackoverfloweth/prefect-design'
  import { useBoolean, useSubscription } from '@stackoverfloweth/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import { useApi } from '@/composables'
  import { PlayerRequest } from '@/models'


  const api = useApi()
  const router = useRouter()
  const route = useRoute('players.edit')
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  const playerSubscription = useSubscription(api.players.getList, [route.params.seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const player = computed(() => players.value.find(({ id }) => id === route.params.playerId))
  const playerName = computed(() => player.value?.name ?? '...')

  await playerSubscription.promise()

  const crumbs = computed<Crumb[]>(() => {
    const to = router.resolve('players', { seasonId: route.params.seasonId })

    return [
      { text: 'Players', to },
      { text: playerName.value },
    ]
  })

  async function updatePlayer(request: PlayerRequest): Promise<void> {
    startLoading()
    await api.players.update(route.params.playerId, request)

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
    await api.players.remove(route.params.playerId)

    showToast(`${player.value?.name} deleted`, 'success')
    playerSubscription.refresh()
    stopLoading()
    // router.push('players', { seasonId: seasonId.value })
  }
</script>

<template>
  <div class="players-edit-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

    <p-card>
      <PlayerForm
        :loading="loading"
        :season-id="route.params.seasonId"
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
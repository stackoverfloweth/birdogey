<script lang="ts" setup>
  import { showToast, Crumb } from '@prefecthq/prefect-design'
  import { useBoolean, useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import { useApi } from '@/composables'
  import { PlayerRequest } from '@/models'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const seasonId = useRouteParam('seasonId')

  const playerSubscription = useSubscription(api.players.getList, [seasonId])
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
    stopLoading()

    router.push(routes.players(seasonId.value))
  }
</script>

<template>
  <div class="players-create-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

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
</style>

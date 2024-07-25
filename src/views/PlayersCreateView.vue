<script lang="ts" setup>
  import { useRoute, useRouter } from '@kitbag/router'
  import { showToast, Crumb } from '@stackoverfloweth/prefect-design'
  import { useBoolean, useSubscription } from '@stackoverfloweth/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import { useApi } from '@/composables'
  import { PlayerRequest } from '@/models'

  const api = useApi()
  const router = useRouter()
  const route = useRoute('players.create')

  const playerSubscription = useSubscription(api.players.getList, [route.params.seasonId])
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  const crumbs = computed<Crumb[]>(() => {
    const to = router.resolve('players', { seasonId: route.params.seasonId })

    return [
      { text: 'Players', to },
      { text: 'Create' },
    ]
  })

  async function addPlayer(request: PlayerRequest): Promise<void> {
    startLoading()
    await api.players.create(request)

    showToast('Player Created!', 'success')
    playerSubscription.refresh()
    stopLoading()

    router.push('players', { seasonId: route.params.seasonId })
  }
</script>

<template>
  <div class="players-create-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

    <p-card>
      <PlayerForm
        :loading="loading"
        :season-id="route.params.seasonId"
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
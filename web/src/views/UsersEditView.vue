<script lang="ts" setup>
  import { Crumb, showToast } from '@prefecthq/prefect-design'
  import { useBoolean, useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import UserForm from '@/components/UserForm.vue'
  import { useApi } from '@/composables'
  import { UserRequest } from '@birdogey/shared'
  import { routes } from '@/router/routes'

  const seasonId = useRouteParam('seasonId')
  const userId = useRouteParam('userId')

  const api = useApi()
  const router = useRouter()
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  const playerSubscription = useSubscription(api.season.getUsersInSeason, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const user = computed(() => players.value.find(({ id }) => id === userId.value))
  const userName = computed(() => user.value?.name ?? '...')

  await playerSubscription.promise()

  const crumbs = computed<Crumb[]>(() => [
    { text: 'Players', to: routes.users(seasonId.value) },
    { text: userName.value },
  ])

  async function updatePlayer(request: UserRequest): Promise<void> {
    startLoading()
    await api.users.update(userId.value, request)

    showToast('Player Updated!', 'success')
    playerSubscription.refresh()
    stopLoading()
  }

  async function deletePlayer(): Promise<void> {
    if (!confirm('Are you sure?')) {
      return
    }

    startLoading()
    await api.users.remove(userId.value)

    showToast(`${user.value?.name} deleted`, 'success')
    playerSubscription.refresh()
    stopLoading()
    router.push(routes.users(seasonId.value))
  }
</script>

<template>
  <div class="players-edit-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

    <p-card>
      <UserForm
        :loading="loading"
        :season-id="seasonId"
        :initial-values="user"
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

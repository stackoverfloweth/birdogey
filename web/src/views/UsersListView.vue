<script lang="ts" setup>
  import { Crumb } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import UsersList from '@/components/UsersList.vue'
  import UsersListViewEmptyState from '@/components/UsersListViewEmptyState.vue'
  import UsersListViewMenu from '@/components/UsersListViewMenu.vue'
  import { useApi } from '@/composables'
  import { User } from '@birdogey/shared'
  import { routes } from '@/router/routes'

  const seasonId = useRouteParam('seasonId')

  const api = useApi()
  const router = useRouter()

  const playerSubscription = useSubscription(api.users.getUsersInSeason, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const crumbs = computed<Crumb[]>(() => [{ text: 'Players' }])

  function editPlayer(player: User): void {
    router.push(routes.userEdit(seasonId.value, player.id))
  }
</script>

<template>
  <div class="players-list-view">
    <UsersListViewMenu :season-id="seasonId" />
    <ContextBreadCrumbs :crumbs="crumbs" />

    <template v-if="playerSubscription.loading">
      <p-loading-icon />
    </template>
    <template v-else-if="players.length === 0">
      <UsersListViewEmptyState :season-id="seasonId" />
    </template>
    <template v-else>
      <UsersList :players="players" @select="editPlayer" />
    </template>
  </div>
</template>

<style>
.players-list-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>

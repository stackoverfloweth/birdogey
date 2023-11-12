<script lang="ts" setup>
  import { Crumb } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import PlayersList from '@/components/PlayersList.vue'
  import PlayersListViewEmptyState from '@/components/PlayersListViewEmptyState.vue'
  import PlayersListViewMenu from '@/components/PlayersListViewMenu.vue'
  import { useApi } from '@/composables'
  import { Player } from '@/models'
  import { routes } from '@/router/routes'

  const seasonId = useRouteParam('seasonId')

  const api = useApi()
  const router = useRouter()

  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const crumbs = computed<Crumb[]>(() => [{ text: 'Players' }])

  function editPlayer(player: Player): void {
    router.push(routes.playerEdit(seasonId.value, player.id))
  }
</script>

<template>
  <div class="players-list-view">
    <PlayersListViewMenu :season-id="seasonId" />
    <ContextBreadCrumbs :crumbs="crumbs" />

    <template v-if="playerSubscription.loading">
      <p-loading-icon />
    </template>
    <template v-else-if="players.length === 0">
      <PlayersListViewEmptyState :season-id="seasonId" />
    </template>
    <template v-else>
      <PlayersList :players="players" @select="editPlayer" />
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
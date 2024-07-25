<script lang="ts" setup>
  import { useRoute, useRouter } from '@kitbag/router'
  import { Crumb } from '@stackoverfloweth/prefect-design'
  import { useSubscription } from '@stackoverfloweth/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import PlayersList from '@/components/PlayersList.vue'
  import PlayersListViewEmptyState from '@/components/PlayersListViewEmptyState.vue'
  import PlayersListViewMenu from '@/components/PlayersListViewMenu.vue'
  import { useApi } from '@/composables'
  import { Player } from '@/models'

  const api = useApi()
  const router = useRouter()
  const route = useRoute('players.list')

  const playerSubscription = useSubscription(api.players.getList, [route.params.seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const crumbs = computed<Crumb[]>(() => [{ text: 'Players' }])

  function editPlayer(player: Player): void {
    router.push('players.edit', { ...route.params, playerId: player.id })
  }
</script>

<template>
  <div class="players-list-view">
    <PlayersListViewMenu :season-id="route.params.seasonId" />
    <ContextBreadCrumbs :crumbs="crumbs" />

    <template v-if="playerSubscription.loading">
      <p-loading-icon />
    </template>
    <template v-else-if="players.length === 0">
      <PlayersListViewEmptyState :season-id="route.params.seasonId" />
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
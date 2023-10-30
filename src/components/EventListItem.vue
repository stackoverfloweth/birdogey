<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useApi } from '@/composables'
  import { Event } from '@/models'
  import { calculateEventAcePot, calculateEventCtpPot } from '@/services'
  import { penniesToUSD } from '@/utilities'

  const props = defineProps<{
    event: Event,
  }>()

  const api = useApi()
  const seasonId = computed(() => props.event.seasonId)
  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const playerNames = computed(() => props.event.players.map(({ playerId }) => {
    return players.value.find(player => player.id === playerId)?.name ?? 'Player Deleted'
  }))

  const ctp = computed(() => calculateEventCtpPot(props.event))
  const ace = computed(() => calculateEventAcePot(props.event))
</script>

<template>
  <p-list-item class="event-list-item">
    <div class="event-list-item__name">
      <template v-if="!event.completed">
        <div success class="event-list-item__active-tag" />
      </template>

      <span class="event-list-item__name-value">{{ event.name }}</span>
    </div>

    <div class="event-list-item__payout-summary">
      <p-key-value label="CTP" class="event-list-item__payout" :value="penniesToUSD(ctp)" />
      <p-key-value label="ACE" class="event-list-item__payout" :value="penniesToUSD(ace)" />
    </div>

    <p-tag-wrapper class="event-list-item__players" :tags="playerNames" />
  </p-list-item>
</template>

<style>
.event-list-item {
  display: grid;
  column-gap: var(--space-sm);
  row-gap: var(--space-xxxs);
  grid-template-columns: minmax(0, 1fr) 110px;
  grid-template-areas:
    'name payout-summary'
    'players payout-summary';
  cursor: pointer;
}

.event-list-item__name {
  grid-area: name;
  display: flex;
  align-items: center;
  gap: var(--space-xxs);
}

.event-list-item__name-value {
  white-space: nowrap;
  font-size: var(--text-lg);
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}

.event-list-item__active-tag {
  height: 8px;
  width: 8px;
  flex-shrink: 0;
  border-radius: 100%;
  margin: 3px;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.5);
  background-color: var(--p-color-sentiment-positive);
}

.event-list-item__payout-summary {
  grid-area: payout-summary;
  display: flex;
  gap: var(--space-sm);
}

.event-list-item__players {
  grid-area: players;
}

@container(max-width: 300px) {
  .event-list-item {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'name'
      'players';
  }

  .event-list-item__payout-summary {
    display: none;
  }
}
</style>
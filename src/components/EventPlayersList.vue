<script lang="ts" setup>
  import { SelectModelValue, SelectOption } from '@prefecthq/prefect-design'
  import { useBoolean, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import { useApi } from '@/composables'

  const props = defineProps<{
    seasonId: string,
    eventId: string,
  }>()

  const api = useApi()
  const { eventId, seasonId } = toRefs(props)
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  const eventPlayerSubscription = useSubscription(api.eventPlayers.getList, [eventId])
  const eventPlayers = computed(() => eventPlayerSubscription.response ?? [])

  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const playersNotIn = computed(() => players.value.filter(player => eventPlayers.value.every(eventPlayer => eventPlayer.playerId !== player.id)))
  const options = computed(() => playersNotIn.value.map<SelectOption>(player => ({
    label: player.name,
    value: player.id,
  })))

  async function addPlayer(playerId: SelectModelValue | SelectModelValue[]): Promise<void> {
    startLoading()
    if (typeof playerId !== 'string') {
      return
    }

    await api.eventPlayers.create({
      eventId: eventId.value,
      playerId,
    })

    eventPlayerSubscription.refresh()
    stopLoading()
  }
</script>

<template>
  <div class="event-players-list">
    <template v-if="eventPlayerSubscription.loading || loading">
      <p-loading-icon />
    </template>
    <template v-for="eventPlayer in eventPlayers" v-else :key="eventPlayer.id">
      <p-list-item>
        <div class="event-players-list__item">
          <div class="event-players-list__item-name">
            {{ eventPlayer.playerId }}
          </div>
        </div>
      </p-list-item>
    </template>
    <p-list-item>
      <div class="event-players-list__new-item">
        <p-select empty-message="Add Player" :model-value="undefined" :options="options" @update:model-value="addPlayer" />
      </div>
    </p-list-item>
  </div>
</template>

<style>
.event-players-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.event-players-list__item {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  justify-content: space-between;
}

.event-players-list__item-paid {
  color: var(--p-color-sentiment-negative);
}

.event-players-list__item-paid--paid {
  color: var(--p-color-sentiment-positive);
}
</style>
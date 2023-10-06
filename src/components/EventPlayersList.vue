<script lang="ts" setup>
  import { SelectModelValue, SelectOption } from '@prefecthq/prefect-design'
  import { useBoolean, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import EventPlayerListItem from '@/components/EventPlayerListItem.vue'
  import EventUpdateForm from '@/components/EventUpdateForm.vue'
  import { useApi } from '@/composables'
  import { Event, Player } from '@/models'

  const props = defineProps<{
    seasonId: string,
    event: Event,
  }>()

  const api = useApi()
  const { seasonId } = toRefs(props)
  const eventId = computed(() => props.event.id)
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
  const eventCompleted = computed(() => !!props.event.completed)

  function getPlayer(playerId: string): Player | undefined {
    return players.value.find(({ id }) => playerId === id)
  }

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
    <p-list-item v-if="!eventCompleted">
      <p-select empty-message="Add Player" :disabled="eventCompleted" :model-value="undefined" :options="options" @update:model-value="addPlayer" />
    </p-list-item>
    <template v-if="eventPlayerSubscription.loading || loading">
      <p-loading-icon />
    </template>
    <template v-for="eventPlayer in eventPlayers" v-else :key="eventPlayer.id">
      <p-list-item>
        <EventPlayerListItem :disabled="eventCompleted" :event-player="eventPlayer" :player="getPlayer(eventPlayer.playerId)" />
      </p-list-item>
    </template>
    <p-list-item>
      <EventUpdateForm :event="event" :season-id="seasonId" />
    </p-list-item>
  </div>
</template>

<style>
.event-players-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.event-players-list__item-paid {
  color: var(--p-color-sentiment-negative);
}

.event-players-list__item-paid--paid {
  color: var(--p-color-sentiment-positive);
}
</style>
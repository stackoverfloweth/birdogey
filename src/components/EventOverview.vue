<script lang="ts" setup>
  import { SelectModelValue, SelectOption } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventPlayerListItem from '@/components/EventPlayerListItem.vue'
  import EventUpdateForm from '@/components/EventUpdateForm.vue'
  import { useApi, useSeason } from '@/composables'
  import { Event, Player } from '@/models'
  import { penniesToUSD } from '@/utilities'

  const props = defineProps<{
    event: Event,
  }>()

  const api = useApi()
  const eventId = computed(() => props.event.id)
  const seasonId = computed(() => props.event.seasonId)
  const { season } = useSeason(seasonId)

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

  const ctpInPennies = computed(() => {
    if (eventPlayerSubscription.loading) {
      return '--'
    }

    const value = eventPlayers.value.reduce((sum, eventPlayer) => {
      if (eventPlayer.inForCtp && season.value?.ctpInPennies) {
        sum += season.value.ctpInPennies
      }

      return sum
    }, props.event.ctpPennyBalance ?? 0)

    return penniesToUSD(value)
  })
  const aceInPennies = computed(() => {
    if (eventPlayerSubscription.loading) {
      return '--'
    }

    const value = eventPlayers.value.reduce((sum, eventPlayer) => {
      if (eventPlayer.inForAce && season.value?.aceInPennies) {
        sum += season.value.aceInPennies
      }

      return sum
    }, props.event.acePennyBalance ?? 0)

    return penniesToUSD(value)
  })

  function getPlayer(playerId: string): Player | undefined {
    return players.value.find(({ id }) => playerId === id)
  }

  async function addPlayer(playerId: SelectModelValue | SelectModelValue[]): Promise<void> {
    if (typeof playerId !== 'string') {
      return
    }

    await api.eventPlayers.create({
      eventId: eventId.value,
      playerId,
    })

    eventPlayerSubscription.refresh()
  }
</script>

<template>
  <div class="event-overview">
    <div class="event-overview__payout-summary">
      <p-key-value label="CTP" class="event-overview__payout" :value="ctpInPennies" />
      <p-key-value label="ACE" class="event-overview__payout" :value="aceInPennies" />
    </div>

    <p-list-item v-if="!eventCompleted">
      <p-select empty-message="Add Player" :disabled="eventCompleted" :model-value="undefined" :options="options" @update:model-value="addPlayer" />
    </p-list-item>

    <template v-if="!eventPlayerSubscription.executed && eventPlayerSubscription.loading">
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
.event-overview {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.event-overview__payout-summary {
  padding: var(--space-md) 0;
  display: flex;
  gap: var(--space-xl);
  align-items: center;
  justify-content: center;
}

.event-overview__payout {
  width: min-content;
  align-items: center;
  white-space: nowrap;
  font-size: var(--text-lg);
}

.event-overview__item-paid {
  color: var(--p-color-sentiment-negative);
}

.event-overview__item-paid--paid {
  color: var(--p-color-sentiment-positive);
}
</style>
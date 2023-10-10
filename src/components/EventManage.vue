<script lang="ts" setup>
  import { SelectModelValue, SelectOption, showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, reactive, ref } from 'vue'
  import EventPlayerListItem from '@/components/EventPlayerListItem.vue'
  import { useApi } from '@/composables'
  import { Event, EventPlayerRequest, EventRequest, Player } from '@/models'
  import { calculateEventAcePot, calculateEventCtpPot } from '@/services'
  import { penniesToUSD } from '@/utilities'

  const props = defineProps<{
    event: Event,
  }>()

  const api = useApi()
  const seasonId = computed(() => props.event.seasonId)
  const eventId = computed(() => props.event.id)

  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const eventCompleted = computed(() => !!props.event.completed)

  const notes = ref(props.event.notes)
  const eventPlayers = reactive<EventPlayerRequest[]>(props.event.players)
  const ctpPlayerIds = ref(props.event.ctpPlayerIds)
  const acePlayerIds = ref(props.event.acePlayerIds)

  const playersNotIn = computed(() => players.value.filter(player => eventPlayers.every(eventPlayer => eventPlayer.playerId !== player.id)))
  const playersNotInOptions = computed(() => playersNotIn.value.map<SelectOption>(player => ({
    label: player.name,
    value: player.id,
  })))

  const playersIn = computed(() => players.value.filter(player => eventPlayers.some(eventPlayer => eventPlayer.playerId === player.id)))
  const playersInOptions = computed(() => playersIn.value.map<SelectOption>(player => ({
    label: player.name,
    value: player.id,
  })))

  const ctpInPennies = computed(() => {
    const value = calculateEventCtpPot({
      ...props.event,
      players: eventPlayers,
    })

    return penniesToUSD(value)
  })

  const aceInPennies = computed(() => {
    const value = calculateEventAcePot({
      ...props.event,
      players: eventPlayers,
    })

    return penniesToUSD(value)
  })

  function getPlayer(playerId: string): Player | undefined {
    return players.value.find(({ id }) => playerId === id)
  }

  function removePlayer(playerId: string): void {
    const playerIndex = eventPlayers.findIndex(eventPlayer => eventPlayer.playerId === playerId)

    eventPlayers.splice(playerIndex, 1)
  }

  function addPlayer(playerId: SelectModelValue | SelectModelValue[]): void {
    if (typeof playerId !== 'string') {
      return
    }

    const player = players.value.find(({ id }) => playerId === id)

    if (!player) {
      return
    }

    eventPlayers.push({
      playerId: player.id,
      incomingTagId: player.tagId,
    })
  }

  async function updateEvent(): Promise<void> {
    const request: Partial<EventRequest> = {
      players: eventPlayers,
      notes: notes.value,
      ctpPlayerIds: ctpPlayerIds.value,
      acePlayerIds: acePlayerIds.value,
    }

    await api.events.update(eventId.value, request)
    showToast('Event Updated!', 'success')
  }

  async function completeEvent(): Promise<void> {
    const request: Partial<EventRequest> = {
      players: eventPlayers,
      notes: notes.value,
      ctpPlayerIds: ctpPlayerIds.value,
      acePlayerIds: acePlayerIds.value,
    }

    await api.events.complete(eventId.value, request)
    showToast('Event Completed!', 'success')
  }
</script>

<template>
  <p-form class="event-manage" @submit="updateEvent">
    <div class="event-manage__payout-summary">
      <p-key-value label="CTP" class="event-manage__payout" :value="ctpInPennies" />
      <p-key-value label="ACE" class="event-manage__payout" :value="aceInPennies" />
    </div>

    <p-list-item v-if="!eventCompleted">
      <p-select empty-message="Add Player" :disabled="eventCompleted" :model-value="undefined" :options="playersNotInOptions" @update:model-value="addPlayer" />
    </p-list-item>

    <template v-for="(eventPlayer, index) in eventPlayers" :key="eventPlayer.id">
      <p-list-item>
        <EventPlayerListItem v-model:event-player="eventPlayers[index]" :disabled="eventCompleted" :player="getPlayer(eventPlayer.playerId)" @remove="removePlayer" />
      </p-list-item>
    </template>

    <p-list-item class="event-manage__lower-form">
      <p-label label="Notes">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="notes" :disabled="eventCompleted" />
        </template>
      </p-label>

      <div class="event-manage__lower-form-2-col">
        <p-label label="Who won CTP?">
          <template #default="{ id }">
            <p-select :id="id" v-model="ctpPlayerIds" :disabled="eventCompleted" :options="playersInOptions" />
          </template>
        </p-label>

        <p-label label="Any Aces?">
          <template #default="{ id }">
            <p-select :id="id" v-model="acePlayerIds" :disabled="eventCompleted" :options="playersInOptions" />
          </template>
        </p-label>
      </div>

      <div v-if="!eventCompleted" class="event-manage__lower-form-actions">
        <p-button type="submit">
          Save
        </p-button>

        <p-button primary @click="completeEvent">
          Complete Event
        </p-button>
      </div>
    </p-list-item>
  </p-form>
</template>

<style>
.event-manage {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.event-manage__payout-summary {
  padding: var(--space-md) 0;
  display: flex;
  gap: var(--space-xl);
  align-items: center;
  justify-content: center;
}

.event-manage__payout {
  width: min-content;
  align-items: center;
  white-space: nowrap;
  font-size: var(--text-lg);
}

.event-manage__item-paid {
  color: var(--p-color-sentiment-negative);
}

.event-manage__item-paid--paid {
  color: var(--p-color-sentiment-positive);
}

.event-manage__lower-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.event-manage__lower-form-2-col {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.event-manage__lower-form-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}
</style>
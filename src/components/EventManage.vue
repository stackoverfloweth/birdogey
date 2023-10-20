<script lang="ts" setup>
  import { SelectOption, showToast } from '@prefecthq/prefect-design'
  import { ValidationRule, useBoolean, useSubscription, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import CardSuggestionModal from '@/components/CardSuggestionModal.vue'
  import EventPlayerListItem from '@/components/EventPlayerListItem.vue'
  import { isAdmin, useApi } from '@/composables'
  import { Event, EventPlayerRequest, EventRequest, Player } from '@/models'
  import { calculateEventAcePot, calculateEventCtpPot } from '@/services'
  import { penniesToUSD } from '@/utilities'

  const props = defineProps<{
    event: Event,
  }>()

  const api = useApi()
  const seasonId = computed(() => props.event.seasonId)
  const eventId = computed(() => props.event.id)

  const eventSubscription = useSubscription(api.events.getList, [seasonId])

  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const eventDisabled = computed(() => !isAdmin.value || !!props.event.completed)

  const { value: showingCardSuggestions, setTrue: showCardSuggestions } = useBoolean()

  const notes = ref(props.event.notes)
  const ctpPlayerIds = ref(props.event.ctpPlayerIds)
  const acePlayerIds = ref(props.event.acePlayerIds)
  const ctpStartingBalance = ref(props.event.ctpStartingBalance / 100)
  const aceStartingBalance = ref(props.event.aceStartingBalance / 100)
  const eventPlayers = ref<EventPlayerRequest[]>(props.event.players)

  const selectedPlayers = computed({
    get() {
      return eventPlayers.value.map(({ playerId }) => playerId)
    },
    set(value) {
      eventPlayers.value = value.map(playerId => {
        const previousEventPlayer = eventPlayers.value.find(player => player.playerId === playerId)
        const player = players.value.find(player => player.id === playerId)

        return {
          playerId,
          incomingTagId: player!.tagId,
          ...previousEventPlayer,
        }
      })
    },
  })

  const { validate, pending } = useValidationObserver()

  const playerIsInForCtp: ValidationRule<string[]> = (value) => {
    if (value.every(playerId => eventPlayers.value.find(player => player.playerId === playerId)?.inForCtp)) {
      return true
    }

    return value.length === 1 ? 'Player is not in for ctp' : 'Not every player selected is in for ctp'
  }
  const playerIsInForAce: ValidationRule<string[]> = (value) => {
    if (value.every(playerId => eventPlayers.value.find(player => player.playerId === playerId)?.inForAce)) {
      return true
    }

    return value.length === 1 ? 'Player is not in for ace' : 'Not every player selected is in for ace'
  }

  const { error: ctpPlayerIdsErrorMessage, state: ctpPlayerIdsState } = useValidation(ctpPlayerIds, 'Who won ctp', [playerIsInForCtp])
  const { error: acePlayerIdsErrorMessage, state: acePlayerIdsState } = useValidation(acePlayerIds, 'Any aces', [playerIsInForAce])

  const ctpPlayerIdsMessage = computed(() => {
    if (ctpPlayerIdsErrorMessage.value) {
      return ctpPlayerIdsErrorMessage.value
    }

    const numberOfWinners = ctpPlayerIds.value.length

    if (numberOfWinners === 1) {
      return `Player gets ${penniesToUSD(ctpInPennies.value)}`
    }

    if (numberOfWinners > 1) {
      const split = Math.floor(ctpInPennies.value / numberOfWinners)
      return `Each player gets ${penniesToUSD(split)}`
    }

    return undefined
  })

  const acePlayerIdsMessage = computed(() => {
    if (acePlayerIdsErrorMessage.value) {
      return acePlayerIdsErrorMessage.value
    }

    const numberOfWinners = acePlayerIds.value.length

    if (numberOfWinners === 1) {
      return `Player gets ${penniesToUSD(aceInPennies.value)}`
    }

    if (numberOfWinners > 1) {
      const split = Math.floor(aceInPennies.value / numberOfWinners)
      return `Each player gets ${penniesToUSD(split)}`
    }

    return undefined
  })

  const playersOptions = computed(() => players.value.map<SelectOption>(player => ({
    label: player.name,
    value: player.id,
  })))

  const playersIn = computed(() => players.value.filter(player => eventPlayers.value.some(eventPlayer => eventPlayer.playerId === player.id)))
  const playersInOptions = computed(() => playersIn.value.map<SelectOption>(player => ({
    label: player.name,
    value: player.id,
  })))

  const ctpInPennies = computed(() => {
    return calculateEventCtpPot({
      ...props.event,
      players: eventPlayers.value,
    })
  })

  const aceInPennies = computed(() => {
    return calculateEventAcePot({
      ...props.event,
      players: eventPlayers.value,
    })
  })

  function getPlayer(playerId: string): Player | undefined {
    return players.value.find(({ id }) => playerId === id)
  }

  async function updateEvent(): Promise<void> {
    const request: Partial<EventRequest> = {
      players: eventPlayers.value,
      notes: notes.value,
      ctpPlayerIds: ctpPlayerIds.value,
      acePlayerIds: acePlayerIds.value,
      ctpStartingBalance: ctpStartingBalance.value * 100,
      aceStartingBalance: aceStartingBalance.value * 100,
    }

    await api.events.update(eventId.value, request)
    showToast('Event Updated!', 'success')
    eventSubscription.refresh()
  }

  async function completeEvent(): Promise<void> {
    const valid = await validate()

    if (!valid) {
      return
    }

    const request: Partial<EventRequest> = {
      players: eventPlayers.value,
      notes: notes.value,
      ctpPlayerIds: ctpPlayerIds.value,
      acePlayerIds: acePlayerIds.value,
      ctpStartingBalance: ctpStartingBalance.value * 100,
      aceStartingBalance: aceStartingBalance.value * 100,
    }

    await api.events.complete(eventId.value, request)
    showToast('Event Completed!', 'success')
    eventSubscription.refresh()
  }

  watch(() => props.event, event => {
    notes.value = event.notes
    ctpPlayerIds.value = event.ctpPlayerIds
    acePlayerIds.value = event.acePlayerIds
    ctpStartingBalance.value = event.ctpStartingBalance / 100
    aceStartingBalance.value = event.aceStartingBalance / 100
    eventPlayers.value = event.players
  })
</script>

<template>
  <p-form class="event-manage" @submit="updateEvent">
    <div class="event-manage__payout-summary">
      <p-key-value label="CTP" class="event-manage__payout" :value="penniesToUSD(ctpInPennies)" />
      <p-key-value label="ACE" class="event-manage__payout" :value="penniesToUSD(aceInPennies)" />
    </div>

    <p-list-item v-if="!eventDisabled">
      <p-select v-model="selectedPlayers" empty-message="Add Player" :disabled="eventDisabled" :options="playersOptions" multiple />
    </p-list-item>

    <template v-for="(eventPlayer, index) in eventPlayers" :key="eventPlayer.id">
      <p-list-item>
        <EventPlayerListItem v-model:event-player="eventPlayers[index]" :disabled="eventDisabled" :player="getPlayer(eventPlayer.playerId)" />
      </p-list-item>
    </template>

    <p-list-item class="event-manage__lower-form">
      <p-label label="Notes">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="notes" :disabled="eventDisabled" />
        </template>
      </p-label>

      <div class="event-manage__lower-form-2-col">
        <p-label label="Ctp" description="starting balance">
          <template #default="{ id }">
            <p-number-input :id="id" v-model="ctpStartingBalance" :disabled="eventDisabled" prepend="$" />
          </template>
        </p-label>

        <p-label label="Ace" description="starting balance">
          <template #default="{ id }">
            <p-number-input :id="id" v-model="aceStartingBalance" :disabled="eventDisabled" prepend="$" />
          </template>
        </p-label>

        <p-label label="Who won ctp?" :message="ctpPlayerIdsMessage" :state="ctpPlayerIdsState">
          <template #default="{ id }">
            <p-select :id="id" v-model="ctpPlayerIds" :disabled="eventDisabled" :options="playersInOptions" :state="ctpPlayerIdsState" />
          </template>
        </p-label>

        <p-label label="Any aces?" :message="acePlayerIdsMessage" :state="acePlayerIdsState">
          <template #default="{ id }">
            <p-select
              :id="id"
              v-model="acePlayerIds"
              empty-message="No Aces"
              :disabled="eventDisabled"
              :options="playersInOptions"
              :state="acePlayerIdsState"
            />
          </template>
        </p-label>
      </div>

      <div v-if="!eventDisabled" class="event-manage__lower-form-actions">
        <p-button @click="showCardSuggestions">
          Suggest Cards
        </p-button>

        <p-button :loading="pending" type="submit">
          Save
        </p-button>

        <p-button :loading="pending" primary @click="completeEvent">
          Complete Event
        </p-button>
      </div>
    </p-list-item>
    <CardSuggestionModal v-model:isOpen="showingCardSuggestions" :players="playersIn" />
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
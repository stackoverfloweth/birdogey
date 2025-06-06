<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { ValidationRule, useBoolean, useSubscription, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import EventPlayerListItem from '@/components/EventPlayerListItem.vue'
  import EventsEditViewMenu from '@/components/EventsEditViewMenu.vue'
  import { useApi } from '@/composables'
  import { Event, EventPlayerRequest, EventRequest, Player } from '@/models'
  import { calculateEventAcePot, calculateEventCtpPot } from '@/services'
  import { penniesToUSD } from '@/utilities'
  import EventPlayersModal from './EventPlayersModal.vue'

  const props = defineProps<{
    event: Event,
    disabled?: boolean,
  }>()

  const emit = defineEmits<{
    save: [request: Partial<EventRequest>],
    complete: [request: Partial<EventRequest>],
    cancel: [],
  }>()

  const api = useApi()
  const seasonId = computed(() => props.event.seasonId)

  const eventSubscription = useSubscription(api.events.getList, [seasonId])

  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const notes = ref(props.event.notes)
  const ctpPlayerIds = ref(props.event.ctpPlayerIds)
  const acePlayerIds = ref(props.event.acePlayerIds)
  const ctpStartingBalance = ref(props.event.ctpStartingBalance / 100)
  const aceStartingBalance = ref(props.event.aceStartingBalance / 100)
  const ctpPerPlayer = ref(props.event.ctpPerPlayer / 100)
  const acePerPlayer = ref(props.event.acePerPlayer / 100)
  const eventPlayers = ref<EventPlayerRequest[]>(props.event.players)

  const { validate, pending } = useValidationObserver()

  const playerIsInForCtp: ValidationRule<string[]> = (value) => {
    if (value.every((playerId) => eventPlayers.value.find((player) => player.playerId === playerId)?.inForCtp)) {
      return true
    }

    return value.length === 1 ? 'Player is not in for ctp' : 'Not every player selected is in for ctp'
  }
  const playerIsInForAce: ValidationRule<string[]> = (value) => {
    if (value.every((playerId) => eventPlayers.value.find((player) => player.playerId === playerId)?.inForAce)) {
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

  const { value: showingPlayersModal, setTrue: showPlayersModal } = useBoolean()

  const playersIn = computed(() => players.value.filter((player) => eventPlayers.value.some((eventPlayer) => eventPlayer.playerId === player.id)))
  const playersInOptions = computed(() => sortByName(playersIn.value)
    .map<SelectOption>((player) => ({
      label: player.name,
      value: player.id,
    })),
  )

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

  function sortByName(players: Player[]): Player[] {
    return players.sort((aPlayer, bPlayer) => {
      return aPlayer.name > bPlayer.name ? 1 : -1
    })
  }

  function updateEvent(): void {
    const request: Partial<EventRequest> = {
      players: eventPlayers.value,
      notes: notes.value,
      ctpPlayerIds: ctpPlayerIds.value,
      acePlayerIds: acePlayerIds.value,
      ctpStartingBalance: ctpStartingBalance.value * 100,
      aceStartingBalance: aceStartingBalance.value * 100,
      ctpPerPlayer: ctpPerPlayer.value * 100,
      acePerPlayer: acePerPlayer.value * 100,
    }

    emit('save', request)
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

    emit('complete', request)
    eventSubscription.refresh()
  }

  watch(() => props.event, (event) => {
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
    <EventsEditViewMenu
      v-if="!disabled"
      :season-id="seasonId"
      :players="playersIn"
      @cancel="emit('cancel')"
      @save="updateEvent"
      @complete="completeEvent"
    />

    <template v-if="playerSubscription.loading">
      <p-loading-icon />
    </template>

    <template v-else>
      <div v-if="!disabled" class="event-manage__actions">
        <p-button icon="ArrowLeftIcon" @click="emit('cancel')">
          Cancel
        </p-button>

        <p-button icon="UserGroupIcon" @click="showPlayersModal">
          Players
        </p-button>

        <p-button icon="CloudArrowDownIcon" @click="updateEvent">
          Save
        </p-button>
      </div>

      <template v-if="eventPlayers.length">
        <div class="event-manage__players">
          <template v-for="(eventPlayer, index) in eventPlayers" :key="eventPlayer.id">
            <EventPlayerListItem
              v-model:event-player="eventPlayers[index]"
              :disabled="disabled"
              :player="getPlayer(eventPlayer.playerId)"
              :won-ctp="ctpPlayerIds.includes(eventPlayer.playerId)"
              :won-ace="acePlayerIds.includes(eventPlayer.playerId)"
            />
          </template>
        </div>
      </template>
    </template>

    <p-list-item class="event-manage__lower-form">
      <p-label label="Notes">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="notes" :disabled="disabled" />
        </template>
      </p-label>

      <div class="event-manage__lower-form-2-col">
        <div class="event-manage__lower-form-2-col-item">
          <h2>CTP ({{ penniesToUSD(ctpInPennies) }})</h2>

          <p-label label="Per Player">
            <p-number-input v-model="ctpPerPlayer" :disabled="disabled" prepend="$" step="0.01" />
          </p-label>

          <p-label label="Starting balance">
            <template #default="{ id }">
              <p-number-input :id="id" v-model="ctpStartingBalance" :disabled="disabled" prepend="$" step="0.01" />
            </template>
          </p-label>

          <p-label label="Who won ctp?" :message="ctpPlayerIdsMessage" :state="ctpPlayerIdsState">
            <template #default="{ id }">
              <p-select
                :id="id"
                v-model="ctpPlayerIds"
                :disabled="disabled"
                :options="playersInOptions"
                :state="ctpPlayerIdsState"
              />
            </template>
          </p-label>
        </div>

        <div class="event-manage__lower-form-2-col-item">
          <h2>ACE ({{ penniesToUSD(aceInPennies) }})</h2>

          <p-label label="Per Player">
            <p-number-input v-model="acePerPlayer" :disabled="disabled" prepend="$" step="0.01" />
          </p-label>

          <p-label label="Starting balance">
            <template #default="{ id }">
              <p-number-input :id="id" v-model="aceStartingBalance" :disabled="disabled" prepend="$" step="0.01" />
            </template>
          </p-label>

          <p-label label="Any aces?" :message="acePlayerIdsMessage" :state="acePlayerIdsState">
            <template #default="{ id }">
              <p-select
                :id="id"
                v-model="acePlayerIds"
                :disabled="disabled"
                :options="playersInOptions"
                :state="acePlayerIdsState"
              />
            </template>
          </p-label>
        </div>
      </div>

      <div v-if="!disabled" class="event-manage__lower-form-actions">
        <p-button @click="emit('cancel')">
          Cancel
        </p-button>

        <p-button :loading="pending" type="submit">
          Save
        </p-button>

        <p-button :loading="pending" :disabled="!!event.completed" primary @click="completeEvent">
          Complete Event
        </p-button>
      </div>
    </p-list-item>

    <template v-if="showingPlayersModal">
      <EventPlayersModal v-model:is-open="showingPlayersModal" v-model="eventPlayers" :players="players" />
    </template>
  </p-form>
</template>

<style>
.event-manage {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.event-manage__actions {
  display: flex;
  gap: var(--space-sm);
}

.event-manage__players {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
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
  container-type: inline-size;
}

.event-manage__lower-form-2-col {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.event-manage__lower-form-2-col-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.event-manage__lower-form-actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}

@container(max-width: 445px){
  .event-manage__lower-form-actions {
    flex-direction: column;
  }
}
</style>

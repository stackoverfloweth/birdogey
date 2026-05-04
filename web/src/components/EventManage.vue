<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { ValidationRule, useBoolean, useSubscription, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import EventPlayerListItem from '@/components/EventPlayerListItem.vue'
  import EventsEditViewMenu from '@/components/EventsEditViewMenu.vue'
  import UDiscImportModal from '@/components/UDiscImportModal.vue'
  import { useApi } from '@/composables'
  import { Event, EventPlayerRequest, EventRequest, User, UserSeason, calculatePayoutSplit, penniesToUSD } from '@birdogey/shared'
  import { calculateEventAcePot, calculateEventCtpPot } from '@/services'
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

  const playerSubscription = useSubscription(api.season.getUsersInSeason, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const notes = ref(props.event.notes)
  const ctpUserIds = ref(props.event.ctpUserIds)
  const aceUserIds = ref(props.event.aceUserIds)
  const ctpStartingBalance = ref(props.event.ctpStartingBalance / 100)
  const aceStartingBalance = ref(props.event.aceStartingBalance / 100)
  const ctpPerPlayer = ref(props.event.ctpPerPlayer / 100)
  const acePerPlayer = ref(props.event.acePerPlayer / 100)
  const ctpHole = ref(props.event.ctpHole)
  const eventPlayers = ref<EventPlayerRequest[]>(props.event.players)

  const { validate, pending } = useValidationObserver()

  const playerIsInForCtp: ValidationRule<string[]> = (value) => {
    if (value.every((userId) => eventPlayers.value.find((player) => player.userId === userId)?.inForCtp)) {
      return true
    }

    return value.length === 1 ? 'Player is not in for ctp' : 'Not every player selected is in for ctp'
  }
  const playerIsInForAce: ValidationRule<string[]> = (value) => {
    if (value.every((userId) => eventPlayers.value.find((player) => player.userId === userId)?.inForAce)) {
      return true
    }

    return value.length === 1 ? 'Player is not in for ace' : 'Not every player selected is in for ace'
  }

  const { error: ctpUserIdsErrorMessage, state: ctpUserIdsState } = useValidation(ctpUserIds, 'Who won ctp', [playerIsInForCtp])
  const { error: aceUserIdsErrorMessage, state: aceUserIdsState } = useValidation(aceUserIds, 'Any aces', [playerIsInForAce])

  const ctpUserIdsMessage = computed(() => {
    if (ctpUserIdsErrorMessage.value) {
      return ctpUserIdsErrorMessage.value
    }

    const numberOfWinners = ctpUserIds.value.length
    const split = calculatePayoutSplit(ctpInPennies.value, numberOfWinners)

    if (numberOfWinners === 1) {
      return `Player gets ${penniesToUSD(split)}`
    }

    if (numberOfWinners > 1) {
      return `Each player gets ${penniesToUSD(split)}`
    }

    return undefined
  })

  const aceUserIdsMessage = computed(() => {
    if (aceUserIdsErrorMessage.value) {
      return aceUserIdsErrorMessage.value
    }

    const numberOfWinners = aceUserIds.value.length

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
  const { value: showingUDiscModal, setTrue: showUDiscModal } = useBoolean()

  const playersIn = computed(() => players.value.filter((player) => eventPlayers.value.some((eventPlayer) => eventPlayer.userId === player.id)))
  const playersInOptions = computed(() => sortByName(playersIn.value)
    .map<SelectOption>((player) => ({
      label: player.name,
      value: player.id,
    })),
  )

  function getPlayer(userId: string): UserSeason {
    const emptyPlayer = { name: 'loading...' } as UserSeason

    return players.value.find((player) => player.id === userId) ?? emptyPlayer
  }

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

  function sortByName(players: User[]): User[] {
    return players.sort((aPlayer, bPlayer) => {
      return aPlayer.name > bPlayer.name ? 1 : -1
    })
  }

  async function applyScores(scores: Map<string, number>): Promise<void> {
    eventPlayers.value = eventPlayers.value.map((player) => {
      const score = scores.get(player.userId)

      if (typeof score === 'number') {
        return { ...player, score }
      }

      return player
    })
  }

  function updateEvent(): void {
    const request: Partial<EventRequest> = {
      players: eventPlayers.value,
      notes: notes.value,
      ctpUserIds: ctpUserIds.value,
      aceUserIds: aceUserIds.value,
      ctpStartingBalance: ctpStartingBalance.value * 100,
      aceStartingBalance: aceStartingBalance.value * 100,
      ctpPerPlayer: ctpPerPlayer.value * 100,
      acePerPlayer: acePerPlayer.value * 100,
      ctpHole: ctpHole.value,
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
      ctpUserIds: ctpUserIds.value,
      aceUserIds: aceUserIds.value,
      ctpStartingBalance: ctpStartingBalance.value * 100,
      aceStartingBalance: aceStartingBalance.value * 100,
      ctpHole: ctpHole.value,
    }

    emit('complete', request)
    eventSubscription.refresh()
  }

  watch(() => props.event, (event) => {
    notes.value = event.notes
    ctpUserIds.value = event.ctpUserIds
    aceUserIds.value = event.aceUserIds
    ctpStartingBalance.value = event.ctpStartingBalance / 100
    aceStartingBalance.value = event.aceStartingBalance / 100
    ctpHole.value = event.ctpHole

    if (event.completed) {
      eventPlayers.value = event.players
    } else {
      eventPlayers.value = event.players
        .map((player) => {
          const { name } = players.value.find(({ id }) => id === player.userId) ?? { name: 'loading...' }

          return {
            ...player,
            name,
          }
        })
        .sort((aPlayer, bPlayer) => aPlayer.name.localeCompare(bPlayer.name))
    }
  }, { immediate: true })
</script>

<template>
  <p-form class="event-manage" @submit="updateEvent">
    <EventsEditViewMenu
      v-if="!disabled"
      :season-id="seasonId"
      :players="playersIn"
    />

    <template v-if="playerSubscription.loading">
      <p-loading-icon />
    </template>

    <template v-else>
      <div v-if="!disabled" class="event-manage__actions">
        <p-button icon="UserGroupIcon" @click="showPlayersModal">
          Players
        </p-button>

        <p-button icon="ArrowUpTrayIcon" @click="showUDiscModal">
          Import Scores
        </p-button>

        <p-button icon="CloudArrowDownIcon" @click="updateEvent">
          Save
        </p-button>
      </div>

      <template v-if="eventPlayers.length">
        <div class="event-manage__players">
          <template v-for="(eventPlayer, index) in eventPlayers" :key="eventPlayer.userId">
            <EventPlayerListItem
              v-model:event-player="eventPlayers[index]"
              :disabled="disabled"
              :player="getPlayer(eventPlayer.userId)"
              :won-ctp="ctpUserIds.includes(eventPlayer.userId)"
              :won-ace="aceUserIds.includes(eventPlayer.userId)"
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

          <p-label label="Hole">
            <template #default="{ id }">
              <p-number-input :id="id" v-model="ctpHole" :disabled="disabled" :min="1" step="1" />
            </template>
          </p-label>

          <p-label label="Who won ctp?" :message="ctpUserIdsMessage" :state="ctpUserIdsState">
            <template #default="{ id }">
              <p-select
                :id="id"
                v-model="ctpUserIds"
                :disabled="disabled"
                :options="playersInOptions"
                :state="ctpUserIdsState"
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

          <p-label label="Any aces?" :message="aceUserIdsMessage" :state="aceUserIdsState">
            <template #default="{ id }">
              <p-select
                :id="id"
                v-model="aceUserIds"
                :disabled="disabled"
                :options="playersInOptions"
                :state="aceUserIdsState"
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

    <template v-if="showingUDiscModal">
      <UDiscImportModal
        v-model:is-open="showingUDiscModal"
        :players="players"
        :event-players="eventPlayers"
        @import="applyScores"
      />
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
  overflow-x: auto;
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

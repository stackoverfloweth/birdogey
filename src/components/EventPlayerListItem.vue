<script lang="ts" setup>
  import { ValidationRule, usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { EventPlayerRequest, Player } from '@/models'

  const props = defineProps<{
    disabled?: boolean,
    eventPlayer: EventPlayerRequest,
    player?: Player,
  }>()

  const emit = defineEmits<{
    'update:eventPlayer': [value: EventPlayerRequest],
    'remove': [playerId: string],
  }>()

  const eventPlayer = computed({
    get() {
      return props.eventPlayer
    },
    set(value) {
      emit('update:eventPlayer', value)
    },
  })

  const inForCtp = usePatchRef(eventPlayer, 'inForCtp')
  const inForAce = usePatchRef(eventPlayer, 'inForAce')
  const score = usePatchRef(eventPlayer, 'score')

  const isRequired: ValidationRule<number | undefined> = (value) => value !== undefined
  const { error: scoreErrorMessage, state: scoreState } = useValidation(score, 'Score', [isRequired])

  function removePlayer(): void {
    emit('remove', props.eventPlayer.playerId)
  }
</script>

<template>
  <div class="event-player-list-item">
    <div class="event-player-list-item__header">
      <div v-if="player" class="event-player-list-item__name">
        {{ player.name }}
      </div>

      <div v-else class="event-player-list-item__name event-player-list-item__name--not-found">
        Player Deleted
      </div>

      <div class="event-player-list-item__tag">
        {{ eventPlayer.outgoingTagId }}
      </div>

      <div class="event-player-list-item__tag" :class="{ 'event-player-list-item__tag--replaced': typeof eventPlayer.outgoingTagId === 'number' }">
        {{ eventPlayer.incomingTagId }}
      </div>
    </div>

    <div class="event-player-list-item__form">
      <p-label label="In for Ctp" class="event-player-list-item__in-for-ctp">
        <template #default="{ id }">
          <p-toggle :id="id" v-model="inForCtp" :disabled="disabled" />
        </template>
      </p-label>

      <p-label label="In for Ace" class="event-player-list-item__in-for-ace">
        <template #default="{ id }">
          <p-toggle :id="id" v-model="inForAce" :disabled="disabled" />
        </template>
      </p-label>

      <p-label label="Score" class="event-player-list-item__score" :message="scoreErrorMessage" :state="scoreState">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="score" :disabled="disabled" :state="scoreState" />
        </template>
      </p-label>

      <p-button class="event-player-list-item__trash" dangerous icon="TrashIcon" @click="removePlayer" />
    </div>
  </div>
</template>

<style>
.event-player-list-item__form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) min-content;
  row-gap: var(--space-md);
  column-gap: var(--space-sm);
  align-items: flex-end;
}

.event-player-list-item__header {
  display: flex;
  gap: var(--space-xs);
  align-items: center;
  font-size: var(--text-lg);
  font-weight: bold;
}

.event-player-list-item__name {
  white-space: nowrap;
  flex-grow: 1;
}

.event-player-list-item__trash {
  color: var(--p-color-sentiment-negative);
}

.event-player-list-item__name--not-found {
  color: var(--p-color-sentiment-negative);
}

.event-player-list-item__tag--replaced {
  text-decoration: line-through;
  color: var(--contrast-gray-400);
}
</style>
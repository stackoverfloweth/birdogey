<script lang="ts" setup>
  import { ValidationRule, usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ScoreInput from '@/components/ScoreInput.vue'
  import { EventPlayerRequest, Player } from '@/models'

  const props = defineProps<{
    disabled?: boolean,
    eventPlayer: EventPlayerRequest,
    player?: Player,
  }>()

  const emit = defineEmits<{
    'update:eventPlayer': [value: EventPlayerRequest],
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
  const tagReplaced = computed(() => typeof props.eventPlayer.outgoingTagId === 'number')

  const classes = computed(() => ({
    tag: {
      'event-player-list-item__tag--replaced': tagReplaced.value,
    },
  }))

  const isRequired: ValidationRule<number | undefined> = (value) => typeof value === 'number'
  const { error: scoreErrorMessage, state: scoreState } = useValidation(score, 'Score', [isRequired])
</script>

<template>
  <div class="event-player-list-item">
    <div class="event-player-list-item__tag" :class="classes.tag">
      <div class="event-player-list-item__tag-outgoing">
        {{ eventPlayer.outgoingTagId }}
      </div>

      <div class="event-player-list-item__tag-incoming">
        {{ eventPlayer.incomingTagId }}
      </div>
    </div>

    <p-list-item class="event-player-list-item__player">
      <div v-if="player" class="event-player-list-item__name">
        {{ player.name }}
        <p-tooltip v-if="!player?.entryPaid" text="Player has not paid entry">
          <p-icon class="event-player-list-item__entry-not-paid" icon="ExclamationCircleIcon" />
        </p-tooltip>
      </div>

      <div v-else class="event-player-list-item__name event-player-list-item__name--not-found">
        Player Deleted
      </div>

      <p-label label="In for Ctp" class="event-player-list-item__toggle">
        <template #default="{ id }">
          <p-toggle :id="id" v-model="inForCtp" :disabled="disabled" />
        </template>
      </p-label>

      <p-label label="In for Ace" class="event-player-list-item__toggle">
        <template #default="{ id }">
          <p-toggle :id="id" v-model="inForAce" :disabled="disabled" />
        </template>
      </p-label>

      <p-label class="event-player-list-item__score" :message="scoreErrorMessage" :state="scoreState">
        <template #default="{ id }">
          <ScoreInput :id="id" v-model="score" :disabled="disabled" :state="scoreState" />
        </template>
      </p-label>
    </p-list-item>
  </div>
</template>

<style>
.event-player-list-item {
  display: flex;
  gap: var(--space-xs);
  align-items: stretch;
}

.event-player-list-item__tag {
  --tag-outgoing-tag-color: transparent;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--p-radius-default);
  padding: .75rem 0;
  width: 72px;
  overflow: hidden;
  font-weight: bolder;
  background: linear-gradient(135deg, var(--tag-outgoing-tag-color) 0%, var(--tag-outgoing-tag-color) 45%, transparent 46%, transparent 54%, var(--p-color-bg-floating) 55%, var(--p-color-bg-floating) 100%);
}

.event-player-list-item__tag--replaced {
  --tag-outgoing-tag-color: var(--p-color-button-primary-bg);
}

.event-player-list-item__tag-outgoing {
  position: absolute;
  left: 20%;
  top: 10%;
}

.event-player-list-item__tag-incoming {
  position: absolute;
  right: 20%;
  bottom: 10%;
}

.event-player-list-item__player {
  --p-color-toggle-bg-checked: var(--p-color-button-primary-bg);

  flex-grow: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 100px 100px 200px;
  align-items: center;
}

.event-player-list-item__name {
  white-space: nowrap;
  font-size: var(--text-lg);
  font-weight: bold;
}

.event-player-list-item__toggle {
  align-items: center;
}

.event-player-list-item__entry-not-paid {
  border-radius: 100%;
  overflow: hidden;
  background-color: var(--p-color-message-warning-bg);
  color: var(--p-color-message-warning-text);
}

.event-player-list-item__name--not-found {
  color: var(--p-color-sentiment-negative);
}
</style>
<script lang="ts" setup>
  import { ValidationRule, useBoolean, usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventPlayerEditModal from '@/components/EventPlayerEditModal.vue'
  import PlayerEditModal from '@/components/PlayerEditModal.vue'
  import ScoreInput from '@/components/ScoreInput.vue'
  import PlayerImage from '@/components/PlayerImage.vue'
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

  const { value: showingEditPlayerModal, setTrue: showEditPlayerModal } = useBoolean()
  const { value: showingEditTagModal, setTrue: showEditTagModal } = useBoolean()

  const inForCtp = usePatchRef(eventPlayer, 'inForCtp')
  const inForAce = usePatchRef(eventPlayer, 'inForAce')
  const score = usePatchRef(eventPlayer, 'score')
  const incomingTagId = usePatchRef(eventPlayer, 'incomingTagId')
  const outgoingTagId = usePatchRef(eventPlayer, 'outgoingTagId')
  const hasNewTag = computed(() => typeof props.eventPlayer.outgoingTagId === 'number')

  const classes = computed(() => ({
    player: {
      'event-player-list-item__player--not-paid': !props.player?.entryPaid,
    },
    tag: {
      'event-player-list-item__tag--disabled': props.disabled,
      'event-player-list-item__tag--has-new-tag': hasNewTag.value,
    },
  }))

  const isRequired: ValidationRule<number | undefined> = (value) => typeof value === 'number'
  const { error: scoreErrorMessage, state: scoreState } = useValidation(score, 'Score', [isRequired])

  function tryShowEditPlayerModal(): void {
    if (!props.disabled) {
      showEditPlayerModal()
    }
  }

  function tryShowEditTagModal(): void {
    if (!props.disabled) {
      showEditTagModal()
    }
  }
</script>

<template>
  <div class="event-player-list-item">
    <div class="event-player-list-item__tags-container" @click="tryShowEditTagModal">
      <div class="event-player-list-item__tag event-player-list-item__tag--incoming" :class="classes.tag">
        {{ incomingTagId }}
      </div>

      <div class="event-player-list-item__tag event-player-list-item__tag--outgoing" :class="classes.tag">
        {{ outgoingTagId ?? '--' }}
      </div>
    </div>

    <div class="event-player-list-item__image">
      <PlayerImage :image-url="player?.imageUrl" width="100%" />
    </div>

    <p-list-item class="event-player-list-item__player" :class="classes.player">
      <div v-if="player" class="event-player-list-item__name" @click="tryShowEditPlayerModal">
        {{ player.name }}
      </div>

      <div v-else class="event-player-list-item__name event-player-list-item__name--not-found">
        Player Deleted
      </div>

      <div class="event-player-list-item__score-container">
        <p-label class="event-player-list-item__score-input" :message="scoreErrorMessage" :state="scoreState">
          <template #default="{ id }">
            <ScoreInput :id="id" v-model="score" :disabled="disabled" :state="scoreState" />
          </template>
        </p-label>

        <p-label label="Ctp" class="event-player-list-item__toggle">
          <template #default="{ id }">
            <p-toggle :id="id" v-model="inForCtp" :disabled="disabled" />
          </template>
        </p-label>

        <p-label label="Ace" class="event-player-list-item__toggle">
          <template #default="{ id }">
            <p-toggle :id="id" v-model="inForAce" :disabled="disabled" />
          </template>
        </p-label>
      </div>
    </p-list-item>

    <template v-if="player && showingEditPlayerModal">
      <PlayerEditModal v-model:is-open="showingEditPlayerModal" :season-id="player.seasonId" :player-id="player.id" />
    </template>
    <template v-if="showingEditTagModal">
      <EventPlayerEditModal v-model:is-open="showingEditTagModal" v-model:event-player="eventPlayer" />
    </template>
  </div>
</template>

<style>
.event-player-list-item {
  display: grid;
  grid-template-columns: 72px 1fr;
  grid-template-areas:
  'image player'
  'tag player';
  gap: var(--space-xs);
  align-items: stretch;
  container-type: inline-size;
}

.event-player-list-item__tags-container {
  grid-area: tag;
  display: flex;
  justify-content: center;
}

.event-player-list-item__tag {
  --tag-color: var(--p-color-text-default);
  --tag-bg-color: var(--p-color-bg-floating);

  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: .75rem 0;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  overflow: hidden;
  font-weight: bolder;
  color: var(--tag-color);
  background: var(--tag-bg-color);
}

.event-player-list-item__tag--incoming {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.event-player-list-item__tag--outgoing {
  --tag-color: var(--p-color-bg-1);
  --tag-bg-color: var(--p-color-button-primary-bg);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.event-player-list-item__tag--disabled {
  cursor: not-allowed;
}

.event-player-list-item__image {
  grid-area: image;
}

.event-player-list-item__player {
  --p-color-toggle-bg-checked: var(--p-color-button-primary-bg);

  grid-area: player;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-xs);
}

.event-player-list-item__player--not-paid {
  --p-color-toggle-bg-checked: var(--p-color-sentiment-negative);
}

.event-player-list-item__name {
  display: flex;
  gap: var(--space-xxxs);
  align-items: center;
  font-size: var(--text-lg);
  font-weight: bold;
  cursor: pointer;
}

.event-player-list-item__score {
  display: flex;
  gap: var(--space-sm);
  justify-content: space-between;
  align-items: flex-end;
}

.event-player-list-item__name-button {
  cursor: pointer;
}

.event-player-list-item__score-container {
  display: flex;
  gap: var(--space-sm);
  align-items: flex-end;
}

.event-player-list-item__toggle {
  width: min-content;
  white-space: nowrap;
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

.event-player-list-item__score-input {
  width: min-content;
}
</style>

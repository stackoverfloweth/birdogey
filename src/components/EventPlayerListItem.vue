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
  const tagReplaced = computed(() => typeof props.eventPlayer.outgoingTagId === 'number')

  const classes = computed(() => ({
    tag: {
      'event-player-list-item__tag--disabled': props.disabled,
      'event-player-list-item__tag--replaced': tagReplaced.value,
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
    <div class="event-player-list-item__tag" :class="classes.tag" @click="tryShowEditTagModal">
      <div class="event-player-list-item__tag-outgoing">
        {{ outgoingTagId }}
      </div>

      <div class="event-player-list-item__tag-incoming">
        {{ incomingTagId }}
      </div>
    </div>

    <p-list-item class="event-player-list-item__player">
      <div v-if="player" class="event-player-list-item__name">
        <div class="event-player-list-item__name-image">
          <PlayerImage :image-url="player.imageUrl" height="30" width="30" />
        </div>
        <span class="event-player-list-item__name-button" @click="tryShowEditPlayerModal">{{ player.name }}</span>
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
  display: flex;
  gap: var(--space-xs);
  align-items: stretch;
  container-type: inline-size;
}

.event-player-list-item__tag {
  --tag-outgoing-tag-color: transparent;

  position: relative;
  cursor: pointer;
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

.event-player-list-item__tag--disabled {
  cursor: not-allowed;
}

.event-player-list-item__tag--replaced {
  --tag-outgoing-tag-color: var(--p-color-button-primary-bg);
}

.event-player-list-item__tag-outgoing {
  position: absolute;
  color: var(--p-color-bg-1);
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
  column-gap: var(--space-sm);
  grid-template-columns: minmax(140px, 1fr) 100px 100px 120px;
  align-items: flex-end;
}

@container (max-width: 600px) {
  .event-player-list-item__name {
    grid-column: 1 / -1;
  }

  .event-player-list-item__player {
    grid-template-columns: 70px 70px minmax(0, 1fr);
  }
}

.event-player-list-item__name {
  display: flex;
  gap: var(--space-xxxs);
  white-space: nowrap;
  font-size: var(--text-lg);
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}

.event-player-list-item__name-button {
  cursor: pointer;
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

<script lang="ts" setup>
  import { ref } from 'vue'
  import { EventPlayer, Player } from '@/models'

  const props = defineProps<{
    disabled?: boolean,
    eventPlayer: EventPlayer,
    player?: Player,
  }>()

  const score = ref(props.eventPlayer.score)
  const inForCtp = ref(props.eventPlayer.inForCtp)
  const inForAce = ref(props.eventPlayer.inForAce)

  async function submit(): Promise<void> {

  }
</script>

<template>
  <div class="event-player-list-item">
    <div class="event-player-list-item__header">
      <div v-if="player" class="event-player-list-item__name">
        {{ player.name }}
      </div>

      <div v-else class="event-player-list-item__name event-player-list-item__name--not-found">
        Player Not Found
      </div>

      <div class="event-player-list-item__tag">
        {{ eventPlayer.outgoingTagId }}
      </div>

      <div class="event-player-list-item__tag" :class="{ 'event-player-list-item__tag--replaced': !!eventPlayer.outgoingTagId }">
        {{ eventPlayer.incomingTagId }}
      </div>
    </div>

    <p-form class="event-player-list-item__form" @submit="submit">
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

      <p-label label="Score" class="event-player-list-item__score">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="score" :disabled="disabled" />
        </template>
      </p-label>
    </p-form>
  </div>
</template>

<style>
.event-player-list-item__form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  row-gap: var(--space-md);
  column-gap: var(--space-sm);
  align-items: center;
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

.event-player-list-item__name--not-found {
  color: var(--p-color-sentiment-negative);
}

.event-player-list-item__tag--replaced {
  text-decoration: line-through;
  color: var(--contrast-gray-400);
}
</style>
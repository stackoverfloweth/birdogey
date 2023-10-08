<script lang="ts" setup>
  import { useDebouncedRef, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import { useApi } from '@/composables'
  import { EventPlayer, Player } from '@/models'

  const props = defineProps<{
    disabled?: boolean,
    eventPlayer: EventPlayer,
    player?: Player,
  }>()

  const emit = defineEmits<{
    'update': [playerId: string],
  }>()

  const api = useApi()

  const score = ref(props.eventPlayer.score)
  const inForCtp = ref(props.eventPlayer.inForCtp)
  const inForAce = ref(props.eventPlayer.inForAce)

  const request = computed(() => ({
    score: score.value,
    inForCtp: inForCtp.value,
    inForAce: inForAce.value,
  }))
  const debounced = useDebouncedRef(request, 1000)

  watch(debounced, async (value) => {
    await api.eventPlayers.update(props.eventPlayer.id, value)
    emit('update', props.eventPlayer.playerId)
  })

  async function removePlayer(): Promise<void> {
    await api.eventPlayers.remove(props.eventPlayer.id)
    emit('update', props.eventPlayer.playerId)
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

      <div class="event-player-list-item__tag" :class="{ 'event-player-list-item__tag--replaced': !!eventPlayer.outgoingTagId }">
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

      <p-label label="Score" class="event-player-list-item__score">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="score" :disabled="disabled" />
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
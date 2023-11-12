<script lang="ts" setup>
  import { Player } from '@/models'

  defineProps<{
    players: Player[],
  }>()

  const emit = defineEmits<{
    'select': [value: Player],
  }>()
</script>

<template>
  <div class="players-list">
    <template v-for="player in players" :key="player.id">
      <div class="player-list__player" @click="emit('select', player)">
        <div class="player-list__player-tag">
          {{ player.tagId }}
        </div>
        <p-list-item class="player-list__player-details" :value="player.id">
          <div class="player-list__player-details-name">
            {{ player.name }}
          </div>
          <p-icon class="player-list__player-details-paid" :class="{ 'player-list__player-details-paid--paid': player.entryPaid }" icon="CurrencyDollarIcon" />
        </p-list-item>
      </div>
    </template>
  </div>
</template>

<style>
.players-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.player-list__player {
  display: flex;
  gap: var(--space-xs);
  align-items: flex-start;
  cursor: pointer;
}

.player-list__player-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--p-radius-default);
  padding: .75rem 0;
  width: 50px;
  font-weight: bolder;
  background-color: var(--p-color-bg-floating);
}

.player-list__player-details {
  flex-grow: 1;
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.player-list__player-details-name {
  flex-grow: 1;
}

.player-list__player-details-paid {
  color: var(--p-color-sentiment-negative);
}

.player-list__player-details-paid--paid {
  color: var(--p-color-sentiment-positive);
}
</style>
<script lang="ts" setup>
  import { computed } from 'vue'
  import PlayerTag from '@/components/PlayerTag.vue'
  import { Player } from '@/models'

  const props = defineProps<{
    players: Player[],
    selected: string[],
  }>()

  const emit = defineEmits<{
    'update:selected': [value: string[]],
  }>()

  const selected = computed({
    get() {
      return props.selected
    },
    set(value) {
      emit('update:selected', value)
    },
  })
</script>

<template>
  <div class="players-list">
    <template v-for="player in players" :key="player.id">
      <p-list-item-input v-model:selected="selected" :value="player.id">
        <div class="players-list__item">
          <div class="players-list__item-name">
            {{ player.name }}
          </div>
          <PlayerTag :tag="player.tagId" />
          <p-icon class="players-list__item-paid" :class="{ 'players-list__item-paid--paid': player.entryPaid }" icon="CurrencyDollarIcon" />
        </div>
      </p-list-item-input>
    </template>
  </div>
</template>

<style>
.players-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.players-list__item {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.players-list__item-name {
  flex-grow: 1;
}

.players-list__item-paid {
  color: var(--p-color-sentiment-negative);
}

.players-list__item-paid--paid {
  color: var(--p-color-sentiment-positive);
}
</style>
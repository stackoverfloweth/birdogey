<script lang="ts" setup>
  import { User, UserSeason } from '@birdogey/shared'
  import UserImage from '@/components/UserImage.vue'

  defineProps<{
    players: (User & Partial<UserSeason>)[],
  }>()

  const emit = defineEmits<{
    select: [value: User],
  }>()
</script>

<template>
  <div class="players-list">
    <template v-for="player in players" :key="player.id">
      <div class="player-list__player" @click="emit('select', player)">
        <template v-if="player.seasonId">
          <div class="player-list__player-tag">
            {{ player.tagId }}
          </div>
        </template>
        <p-list-item class="player-list__player-details" :value="player.id">
          <div class="player-list__player-details-name">
            {{ player.name }}
          </div>
          <UserImage :image-url="player.imageUrl" height="30" width="30" />

          <template v-if="player.seasonId">
            <p-icon class="player-list__player-details-paid" :class="{ 'player-list__player-details-paid--paid': player.entryPaid }" icon="CurrencyDollarIcon" />
          </template>
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

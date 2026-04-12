<script lang="ts" setup>
  import { EventPlayerRequest, User, UserSeason } from '@birdogey/shared'
  import UserImage from '@/components/UserImage.vue'
  import { computed } from 'vue'

  const model = defineModel<EventPlayerRequest[]>({ required: true })
  const isOpen = defineModel<boolean>('isOpen')

  const { players } = defineProps<{
    players: UserSeason[],
  }>()

  const selectedPlayers = computed({
    get() {
      return model.value.map(({ userId }) => userId)
    },
    set(value) {
      model.value = value.map((userId) => {
        const previousEventPlayer = model.value.find((player) => player.userId === userId)
        const player = players.find((player) => player.id === userId)

        return {
          userId,
          incomingTagId: player?.tagId ?? Infinity,
          name: player?.name ?? '',
          ...previousEventPlayer,
        }
      }).sort((aPlayer, bPlayer) => aPlayer.name.localeCompare(bPlayer.name))
    },
  })

  function sortPlayers(aPlayer: User, bPlayer: User): number {
    return aPlayer.name.localeCompare(bPlayer.name)
  }

  function selectPlayer(userId: string): void {
    selectedPlayers.value = [...selectedPlayers.value, userId]
  }

  function deselectPlayer(userId: string): void {
    selectedPlayers.value = selectedPlayers.value.filter((id) => id !== userId)
  }

  function isSelected(userId: string): boolean {
    return selectedPlayers.value.includes(userId)
  }

  function togglePlayer(userId: string): void {
    if (isSelected(userId)) {
      deselectPlayer(userId)
    } else {
      selectPlayer(userId)
    }
  }
</script>

<template>
  <p-modal
    v-model:show-modal="isOpen"
    title="Event Players"
    class="event-players-modal"
    auto-close
    hide-close-button
  >
    <div class="event-players-modal__players">
      <template v-for="player in players.toSorted(sortPlayers)" :key="player.id">
        <button type="button" class="event-players-modal__player" :class="{ 'event-players-modal__player--selected': isSelected(player.id) }" @click="togglePlayer(player.id)">
          <UserImage :image-url="player.imageUrl" height="100" width="100" />

          <div class="event-players-modal__player-name">
            {{ player.name }}
          </div>
        </button>
      </template>
    </div>

    <template #cancel>
      <span />
    </template>

    <template #actions="{ close }">
      <p-button @click="close">
        Done
      </p-button>
    </template>
  </p-modal>
</template>

<style>
.event-players-modal__players {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

.event-players-modal__player {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: var(--p-radius-default);
  padding: var(--space-sm);
  gap: var(--space-xxxs);
  overflow: hidden;
}

.event-players-modal__player--selected {
  background-color: color-mix(in srgb, var(--p-color-sentiment-positive) 50%, transparent);
}

.event-players-modal__player-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.event-players-modal .p-modal__footer {
  display: flex;
}
</style>

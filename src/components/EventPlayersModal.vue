<script lang="ts" setup>
  import { EventPlayerRequest, Player } from '@/models'
  import PlayerImage from '@/components/PlayerImage.vue'
  import { computed } from 'vue'

  const model = defineModel<EventPlayerRequest[]>({ required: true })
  const isOpen = defineModel<boolean>('isOpen')

  const { players } = defineProps<{
    players: Player[],
  }>()

  const selectedPlayers = computed({
    get() {
      return model.value.map(({ playerId }) => playerId)
    },
    set(value) {
      model.value = value.map((playerId) => {
        const previousEventPlayer = model.value.find((player) => player.playerId === playerId)
        const player = players.find((player) => player.id === playerId)

        return {
          playerId,
          incomingTagId: player?.tagId ?? Infinity,
          ...previousEventPlayer,
        }
      })
    },
  })

  function sortPlayers(aPlayer: Player, bPlayer: Player): number {
    return aPlayer.name.localeCompare(bPlayer.name)
  }

  function selectPlayer(playerId: string): void {
    selectedPlayers.value = [...selectedPlayers.value, playerId]
  }

  function deselectPlayer(playerId: string): void {
    selectedPlayers.value = selectedPlayers.value.filter((id) => id !== playerId)
  }

  function isSelected(playerId: string): boolean {
    return selectedPlayers.value.includes(playerId)
  }

  function togglePlayer(playerId: string): void {
    if (isSelected(playerId)) {
      deselectPlayer(playerId)
    } else {
      selectPlayer(playerId)
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
          <PlayerImage :image-url="player.imageUrl" height="100" width="100" />

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

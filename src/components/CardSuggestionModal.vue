<script lang="ts" setup>
  import { randomId } from '@stackoverfloweth/prefect-design'
  import { computed, ref, watch } from 'vue'
  import { Card, Player } from '@/models'

  const props = defineProps<{
    isOpen: boolean,
    players: Player[],
  }>()

  const emit = defineEmits<{
    'update:isOpen': [value: boolean],
  }>()

  const draggingOverCard = ref<Card>()
  const draggingPlayer = ref<Player>()

  const classes = computed(() => ({
    card: (card: Card) => ({
      'card-suggestion-modal__card--hovering': card.id === draggingOverCard.value?.id,
    }),
    player: (player: Player) => ({
      'card-suggestion-modal__player--dragging': player.id === draggingPlayer.value?.id,
    }),
  }))

  const isOpen = computed({
    get() {
      return props.isOpen
    },
    set(value) {
      emit('update:isOpen', value)
    },
  })

  const willHaveFiveOnCard = computed(() => {
    const extraPlayers = props.players.length % 4

    return extraPlayers === 1
  })

  const numberOfCards = computed(() => {
    if (props.players.length <= 1) {
      return 1
    }

    const value = props.players.length / 4

    if (willHaveFiveOnCard.value) {
      return Math.floor(value)
    }

    return Math.ceil(value)
  })

  const cards = ref<Card[]>([])

  watch(isOpen, value => {
    if (!value) {
      return
    }

    const newCards = new Array(numberOfCards.value).fill(null).map<Card>((__, index) => ({
      id: randomId(),
      players: [],
      maxPlayersCount: index === 0 && willHaveFiveOnCard.value ? 5 : 4,
    }))

    const players = [...props.players]

    cards.value = assignPlayersToCards(players, newCards)
  }, { immediate: true })

  function cardIsOpen(card: Card): boolean {
    return card.maxPlayersCount > card.players.length
  }

  function assignPlayersToCards(playersWithoutCard: Player[], cards: Card[]): Card[] {
    if (!playersWithoutCard.length) {
      return cards
    }

    const randomPlayerIndex = Math.floor(Math.random() * playersWithoutCard.length)
    const [firstOpenCard] = cards.filter(cardIsOpen).sort((aCard, bCard) => aCard.players.length - bCard.players.length)

    firstOpenCard.players.push(playersWithoutCard[randomPlayerIndex])

    playersWithoutCard.splice(randomPlayerIndex, 1)

    return assignPlayersToCards(playersWithoutCard, cards)
  }

  function movePlayer(player: Player, destination: Card): void {
    const playerAlreadyOnCard = destination.players.find(({ id }) => id === player.id)

    if (playerAlreadyOnCard) {
      return
    }

    cards.value = cards.value.map(card => {
      const players = card.players.filter(({ id }) => player.id !== id)
      const newCard = {
        ...card,
        players,
      }

      if (destination.id === card.id) {
        newCard.players.push(player)
      }

      return newCard
    })
  }

  function dragStart(event: DragEvent, player: Player): void {
    if (!event.dataTransfer) {
      return
    }

    draggingPlayer.value = player

    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('playerId', player.id)
  }

  function dragEnd(): void {
    draggingOverCard.value = undefined
    draggingPlayer.value = undefined
  }

  function dragEnter(card: Card): void {
    draggingOverCard.value = card
  }

  function dragDrop(event: DragEvent, card: Card): void {
    const droppedPlayerId = event.dataTransfer?.getData('playerId')
    const player = props.players.find(({ id }) => droppedPlayerId === id)

    if (!player) {
      return
    }

    movePlayer(player, card)
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" title="Suggest Cards" class="card-suggestion-modal" auto-close>
    <template v-for="card in cards" :key="card.id">
      <p-list-item
        class="card-suggestion-modal__card"
        :class="classes.card(card)"
        @dragover.prevent
        @dragenter.prevent="dragEnter(card)"
        @drop="dragDrop($event, card)"
      >
        <template v-for="player in card.players" :key="player.id">
          <div draggable="true" class="card-suggestion-modal__player" :class="classes.player(player)" @dragstart="dragStart($event, player)" @dragend="dragEnd">
            {{ player.name }}
          </div>
        </template>
      </p-list-item>
    </template>
  </p-modal>
</template>

<style>
.card-suggestion-modal__player {
  cursor: pointer;
  padding: var(--space-sm);
}

.card-suggestion-modal__card {
  --border-color: var(--contrast-gray-100);
  border: 1px solid var(--border-color);
}

.card-suggestion-modal__card--hovering {
  --border-color: var(--p-color-button-primary-bg);
}

.card-suggestion-modal__player--dragging {
  opacity: 0.25;
}
</style>
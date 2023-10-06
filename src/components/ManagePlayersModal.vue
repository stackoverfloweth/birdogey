<script lang="ts" setup>
  import { showToast, toPluralString } from '@prefecthq/prefect-design'
  import { useBoolean, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref, toRefs } from 'vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import PlayersList from '@/components/PlayersList.vue'
  import { useApi } from '@/composables'
  import { PlayerRequest } from '@/models'

  const props = defineProps<{
    isOpen: boolean,
    seasonId: string,
  }>()

  const emit = defineEmits<{
    'update:isOpen': [value: boolean],
  }>()

  const isOpen = computed({
    get() {
      return props.isOpen
    },
    set(value) {
      emit('update:isOpen', value)
    },
  })

  const api = useApi()
  const { seasonId } = toRefs(props)
  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const { value: showingPlayerForm, setTrue: showPlayerForm, setFalse: hidePlayerForm } = useBoolean()
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()
  const selected = ref<string[]>([])

  function clearSelected(): void {
    selected.value = []
  }

  async function addPlayer(request: PlayerRequest): Promise<void> {
    startLoading()
    await api.players.create(request)

    showToast('Player Created!', 'success')
    playerSubscription.refresh()
    hidePlayerForm()
    stopLoading()
  }

  async function makePlayersPaid(): Promise<void> {
    startLoading()
    const requests = selected.value.map(id => api.players.update(id, {
      entryPaid: true,
    }))

    await Promise.all(requests)

    showToast('Player Updated!', 'success')
    playerSubscription.refresh()
    clearSelected()
    stopLoading()
  }

  async function deletePlayers(): Promise<void> {
    startLoading()
    // eslint-disable-next-line no-alert
    if (!confirm('Are you sure?')) {
      return
    }

    const requests = selected.value.map(id => api.players.remove(id))

    await Promise.all(requests)

    showToast(`${toPluralString('player', selected.value.length)} deleted`, 'success')
    playerSubscription.refresh()
    clearSelected()
    stopLoading()
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" title="Manage Players" class="manage-players-modal" auto-close>
    <template v-if="showingPlayerForm">
      <PlayerForm :season-id="seasonId" @submit="addPlayer" @cancel="hidePlayerForm" />
    </template>
    <template v-else-if="playerSubscription.loading || loading">
      <p-loading-icon />
    </template>
    <template v-else>
      <PlayersList v-model:selected="selected" :players="players" />
      <div class="manage-players-modal__actions">
        <p-button v-if="selected.length === 0" @click="showPlayerForm">
          Add new player
        </p-button>
        <template v-else>
          <p-button @click="clearSelected">
            Cancel
          </p-button>
          <p-button @click="makePlayersPaid">
            Mark as Paid
          </p-button>
          <p-button dangerous @click="deletePlayers">
            Delete
          </p-button>
        </template>
      </div>
    </template>
  </p-modal>
</template>

<style>
.manage-players-modal__actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}
</style>
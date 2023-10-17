<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useBoolean, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref, toRefs } from 'vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import PlayersList from '@/components/PlayersList.vue'
  import { useApi } from '@/composables'
  import { Player, PlayerRequest } from '@/models'

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
  const selected = ref<Player>()

  function clearSelected(): void {
    selected.value = undefined
  }

  function setSelected(player: Player): void {
    selected.value = player
  }

  async function addPlayer(request: PlayerRequest): Promise<void> {
    startLoading()
    await api.players.create(request)

    showToast('Player Created!', 'success')
    playerSubscription.refresh()
    hidePlayerForm()
    stopLoading()
  }

  async function updatePlayer(request: PlayerRequest): Promise<void> {
    if (!selected.value) {
      return
    }

    startLoading()
    await api.players.update(selected.value.id, request)

    showToast('Player Updated!', 'success')
    playerSubscription.refresh()
    clearSelected()
    stopLoading()
  }

  async function deletePlayer(): Promise<void> {
    if (!selected.value) {
      return
    }

    // eslint-disable-next-line no-alert
    if (!confirm('Are you sure?')) {
      return
    }

    startLoading()
    await api.players.remove(selected.value.id)

    showToast(`${selected.value.name} deleted`, 'success')
    playerSubscription.refresh()
    clearSelected()
    stopLoading()
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" title="Manage Players" class="players-manage" auto-close>
    <template v-if="showingPlayerForm">
      <PlayerForm :season-id="seasonId" @submit="addPlayer" @cancel="hidePlayerForm" />
    </template>
    <template v-else-if="selected">
      <PlayerForm
        :season-id="seasonId"
        :initial-values="selected"
        show-remove-button
        @submit="updatePlayer"
        @remove="deletePlayer"
        @cancel="clearSelected"
      />
    </template>
    <template v-else-if="playerSubscription.loading || loading">
      <p-loading-icon />
    </template>
    <template v-else>
      <PlayersList :players="players" @select="setSelected" />
      <div class="players-manage__actions">
        <p-button @click="showPlayerForm">
          Add new player
        </p-button>
      </div>
    </template>
  </p-modal>
</template>

<style>
.players-manage__actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}
</style>
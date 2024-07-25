<script lang="ts" setup>
  import { showToast } from '@stackoverfloweth/prefect-design'
  import { useBoolean, useSubscription } from '@stackoverfloweth/vue-compositions'
  import { computed, toRefs } from 'vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import { useApi } from '@/composables'
  import { PlayerRequest } from '@/models'

  const props = defineProps<{
    isOpen: boolean,
    seasonId: string,
    playerId: string,
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
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  const { seasonId } = toRefs(props)
  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const player = computed(() => players.value.find(({ id }) => id === props.playerId))

  function close(): void {
    isOpen.value = false
  }

  async function updatePlayer(request: PlayerRequest): Promise<void> {
    if (!player.value) {
      return
    }

    startLoading()
    await api.players.update(props.playerId, request)

    showToast('Player Updated!', 'success')
    playerSubscription.refresh()
    stopLoading()
    close()
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" title="Edit Player" class="player-edit-modal" auto-close>
    <template v-if="loading">
      <p-loading-icon />
    </template>
    <PlayerForm
      v-else-if="player"
      :season-id="seasonId"
      :initial-values="player"
      @submit="updatePlayer"
      @cancel="close"
    />
  </p-modal>
</template>
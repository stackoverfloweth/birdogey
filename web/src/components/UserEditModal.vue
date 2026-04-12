<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useBoolean, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import UserForm from '@/components/UserForm.vue'
  import { useApi } from '@/composables'
  import { UserRequest } from '@birdogey/shared'

  const props = defineProps<{
    isOpen: boolean,
    seasonId: string,
    userId: string,
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
  const playerSubscription = useSubscription(api.users.getSeasonList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const player = computed(() => players.value.find(({ id }) => id === props.userId))

  function close(): void {
    isOpen.value = false
  }

  async function updatePlayer(request: UserRequest): Promise<void> {
    if (!player.value) {
      return
    }

    startLoading()
    await api.users.update(props.userId, request)

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
    <UserForm
      v-else-if="player"
      :season-id="seasonId"
      :initial-values="player"
      @submit="updatePlayer"
      @cancel="close"
    />
  </p-modal>
</template>

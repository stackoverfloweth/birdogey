<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useBoolean, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import PlayerForm from '@/components/PlayerForm.vue'
  import { useApi } from '@/composables'
  import { PlayerRequest } from '@/models'
  import { routes } from '@/router/routes'

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
  const router = useRouter()

  const { seasonId } = toRefs(props)
  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  async function addPlayer(request: PlayerRequest): Promise<void> {
    startLoading()
    await api.players.create(request)

    showToast('Player Created!', 'success')
    playerSubscription.refresh()
    stopLoading()

    router.push(routes.players(seasonId.value))
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" class="player-create-modal" title="Add Player" auto-close>
    <PlayerForm
      :loading="loading"
      :season-id="seasonId"
      @submit="addPlayer"
      @cancel="router.back"
    />
  </p-modal>
</template>
<script lang="ts" setup>
  import { SelectOption, showToast } from '@prefecthq/prefect-design'
  import { usePatchRef, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref, toRefs, watch } from 'vue'
  import { useApi } from '@/composables'
  import { PlayerCheckInRequest } from '@/models/api'

  const props = defineProps<{
    isOpen: boolean,
    seasonId: string,
    eventId: string,
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

  const { seasonId } = toRefs(props)
  const selectedPlayer = ref<string>()

  const api = useApi()
  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])
  const playersOptions = computed(() => players.value.map<SelectOption>(player => ({
    label: player.name,
    value: player.id,
  })))

  const editingPlayer = ref<Partial<PlayerCheckInRequest>>({})
  const tagId = usePatchRef(editingPlayer, 'tagId')
  const udiscId = usePatchRef(editingPlayer, 'udiscId')

  watch(selectedPlayer, id => {
    const player = players.value.find(player => player.id === id)

    if (player) {
      editingPlayer.value = player
    }
  })

  async function submit(): Promise<void> {
    if (!selectedPlayer.value) {
      return
    }

    try {
      await api.players.checkin(selectedPlayer.value, {
        eventId: props.eventId,
        ...editingPlayer.value,
      })

      showToast('Thank you!', 'success')
      emit('update:isOpen', false)
    } catch {
      showToast('Already checked in!', 'error')
      emit('update:isOpen', false)
    }
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" title="Player Check-in" class="player-checkin-modal" auto-close>
    <p-select v-model="selectedPlayer" empty-message="Who are you?" :options="playersOptions" />

    <template v-if="selectedPlayer">
      <p-form @submit="submit">
        <p-label label="Current Tag">
          <template #default="{ id }">
            <p-number-input :id="id" v-model="tagId" />
          </template>
        </p-label>

        <p-label label="UDisc Handle">
          <template #default="{ id }">
            <p-text-input :id="id" v-model="udiscId" />
          </template>
        </p-label>

        <p-button type="submit" primary>
          Check-in
        </p-button>
      </p-form>
    </template>
  </p-modal>
</template>
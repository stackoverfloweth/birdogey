<script lang="ts" setup>
  import { SelectOption, showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref, toRefs } from 'vue'
  import { useApi } from '@/composables'
  import { Event, EventRequest } from '@/models'

  const props = defineProps<{
    event: Event,
    seasonId: string,
  }>()

  const emit = defineEmits<{
    submit: [value: string],
  }>()

  const api = useApi()
  const eventId = computed(() => props.event.id)
  const { seasonId } = toRefs(props)

  const eventPlayerSubscription = useSubscription(api.eventPlayers.getList, [eventId])
  const eventPlayers = computed(() => eventPlayerSubscription.response ?? [])

  const playerSubscription = useSubscription(api.players.getList, [seasonId])
  const players = computed(() => playerSubscription.response ?? [])

  const options = computed(() => eventPlayers.value.map<SelectOption>(player => ({
    label: players.value.find(({ id }) => player.playerId === id)?.name ?? 'Player Not Found',
    value: player.playerId,
  })))
  const eventCompleted = computed(() => !!props.event.completed)

  const notes = ref(props.event.notes)
  const ctpPlayerIds = ref(props.event.ctpPlayerIds ?? [])
  const acePlayerIds = ref(props.event.acePlayerIds ?? [])

  async function submit(): Promise<void> {
    const request: Partial<EventRequest> = {
      notes: notes.value,
      seasonId: props.seasonId,
      ctpPlayerIds: ctpPlayerIds.value,
      acePlayerIds: acePlayerIds.value,
    }

    await api.events.update(eventId.value, request)
    showToast('Event Created!', 'success')
    emit('submit', eventId.value)
  }
</script>

<template>
  <p-form class="event-update-form" @submit="submit">
    <p-label label="Notes">
      <template #default="{ id }">
        <p-textarea :id="id" v-model="notes" :disabled="eventCompleted" />
      </template>
    </p-label>

    <div class="event-update-form__2-col">
      <p-label label="Who won CTP?">
        <template #default="{ id }">
          <p-select :id="id" v-model="ctpPlayerIds" :disabled="eventCompleted" :options="options" />
        </template>
      </p-label>

      <p-label label="Any Aces?">
        <template #default="{ id }">
          <p-select :id="id" v-model="acePlayerIds" :disabled="eventCompleted" :options="options" />
        </template>
      </p-label>
    </div>

    <template v-if="!eventCompleted" #footer>
      <p-button type="submit" primary>
        Complete Event
      </p-button>
    </template>
  </p-form>
</template>

<style>
.event-update-form__2-col {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
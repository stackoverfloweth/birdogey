<script lang="ts" setup>
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { Event, EventRequest, getNextCtpHole } from '@birdogey/shared'
  import { calculateEventAcePotIfNoWinners, calculateEventCtpPotIfNoWinners, auth } from '@/services'

  const props = defineProps<{
    seasonId: string,
    disabled?: boolean,
    previousEvent?: Event,
  }>()

  const emit = defineEmits<{
    submit: [request: EventRequest],
    cancel: [],
  }>()

  const { validate, pending } = useValidationObserver()
  const season = computed(() => auth.seasons.find((season) => season.id === props.seasonId))

  const previousEventBalance = computed(() => ({
    ctpPerPlayer: props.previousEvent?.ctpPerPlayer ?? season.value?.ctpPerPlayer ?? 0,
    acePerPlayer: props.previousEvent?.acePerPlayer ?? season.value?.acePerPlayer ?? 0,
    ctpStartingBalance: props.previousEvent ? calculateEventCtpPotIfNoWinners(props.previousEvent) : 0,
    aceStartingBalance: props.previousEvent ? calculateEventAcePotIfNoWinners(props.previousEvent) : 0,
  }))

  const previousEventCtpHole = computed(() => props.previousEvent?.ctpHole)

  const start = ref(new Date())
  const notes = ref<string>()
  const ctpStartingBalance = ref(previousEventBalance.value.ctpStartingBalance / 100)
  const aceStartingBalance = ref(previousEventBalance.value.aceStartingBalance / 100)
  const ctpPerPlayer = ref(previousEventBalance.value.ctpPerPlayer / 100)
  const acePerPlayer = ref(previousEventBalance.value.acePerPlayer / 100)
  const ctpHole = ref(getNextCtpHole(previousEventCtpHole.value, season.value))

  async function submit(): Promise<void> {
    const valid = await validate()

    if (!valid) {
      return
    }

    const request = {
      start: start.value,
      notes: notes.value,
      seasonId: props.seasonId,
      ctpStartingBalance: Math.floor(ctpStartingBalance.value * 100),
      aceStartingBalance: Math.floor(aceStartingBalance.value * 100),
      ctpPerPlayer: Math.floor(ctpPerPlayer.value * 100),
      acePerPlayer: Math.floor(acePerPlayer.value * 100),
      ctpHole: ctpHole.value,
    } as EventRequest

    emit('submit', request)
  }
</script>

<template>
  <p-form class="event-create-form" @submit="submit">
    <p-message v-if="disabled" warning>
      You must complete active event before creating another
    </p-message>

    <p-label label="Notes">
      <template #default="{ id }">
        <p-textarea :id="id" v-model="notes" :disabled="disabled" />
      </template>
    </p-label>

    <div class="event-create-form__form-2-col">
      <p-label label="Ctp" description="per player">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="ctpPerPlayer" :disabled="disabled" prepend="$" :step="0.01" />
        </template>
      </p-label>

      <p-label label="Ace" description="per player">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="acePerPlayer" :disabled="disabled" prepend="$" :step="0.01" />
        </template>
      </p-label>

      <p-label label="Ctp" description="starting balance">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="ctpStartingBalance" :disabled="disabled" prepend="$" :step="0.01" />
        </template>
      </p-label>

      <p-label label="Ace" description="starting balance">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="aceStartingBalance" :disabled="disabled" prepend="$" :step="0.01" />
        </template>
      </p-label>

      <p-label label="Ctp" description="hole">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="ctpHole" :disabled="disabled" :min="1" :step="1" />
        </template>
      </p-label>
    </div>

    <template #footer>
      <p-button @click="emit('cancel')">
        Cancel
      </p-button>

      <p-button :disabled="disabled || pending" type="submit" primary>
        Create Event
      </p-button>
    </template>
  </p-form>
</template>

<style>
.event-create-form__form-2-col {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>

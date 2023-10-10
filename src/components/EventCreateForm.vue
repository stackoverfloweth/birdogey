<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { format } from 'date-fns'
  import { computed, ref } from 'vue'
  import { useApi } from '@/composables'
  import { Event, EventRequest } from '@/models'
  import { calculateEventAcePotIfNoWinners, calculateEventCtpPotIfNoWinners } from '@/services'

  const props = defineProps<{
    seasonId: string,
    disabled?: boolean,
    previousEvent?: Event,
  }>()

  const emit = defineEmits<{
    submit: [value: string],
  }>()

  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const previousEventBalance = computed(() => ({
    ctpPerPlayer: props.previousEvent?.ctpPerPlayer ?? 0,
    acePerPlayer: props.previousEvent?.acePerPlayer ?? 0,
    ctpStartingBalance: props.previousEvent ? calculateEventCtpPotIfNoWinners(props.previousEvent) : 0,
    aceStartingBalance: props.previousEvent ? calculateEventAcePotIfNoWinners(props.previousEvent) : 0,
  }))

  const today = format(new Date(), 'MMMM do')
  const name = ref<string>(today)
  const notes = ref<string>()
  const ctpStartingBalance = ref(previousEventBalance.value.ctpStartingBalance / 100)
  const aceStartingBalance = ref(previousEventBalance.value.aceStartingBalance / 100)
  const ctpPerPlayer = ref(previousEventBalance.value.ctpPerPlayer / 100)
  const acePerPlayer = ref(previousEventBalance.value.acePerPlayer / 100)

  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const { error: nameErrorMessage, state: nameState } = useValidation(name, 'Name', [isRequired])

  async function submit(): Promise<void> {
    const valid = await validate()

    if (!valid) {
      return
    }

    const request = {
      name: name.value,
      notes: notes.value,
      seasonId: props.seasonId,
      ctpStartingBalance: Math.floor(ctpStartingBalance.value * 100),
      aceStartingBalance: Math.floor(aceStartingBalance.value * 100),
      ctpPerPlayer: Math.floor(ctpPerPlayer.value * 100),
      acePerPlayer: Math.floor(acePerPlayer.value * 100),
    } as EventRequest

    const eventId = await api.events.create(request)
    showToast('Event Created!', 'success')
    emit('submit', eventId)
  }
</script>

<template>
  <p-form class="event-create-form" @submit="submit">
    <p-message v-if="disabled" warning>
      You must complete active event before creating another
    </p-message>

    <p-label label="Name" :message="nameErrorMessage" :state="nameState">
      <template #default="{ id }">
        <!-- todo: make this disabled -->
        <p-text-input :id="id" v-model="name" :disabled="disabled" :state="nameState" />
      </template>
    </p-label>

    <p-label label="Notes">
      <template #default="{ id }">
        <p-textarea :id="id" v-model="notes" :disabled="disabled" />
      </template>
    </p-label>

    <div class="event-create-form__form-2-col">
      <p-label label="Ctp" description="per player">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="ctpPerPlayer" :disabled="disabled" prepend="$" />
        </template>
      </p-label>

      <p-label label="Ace" description="per player">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="acePerPlayer" :disabled="disabled" prepend="$" />
        </template>
      </p-label>

      <p-label label="Ctp" description="starting balance">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="ctpStartingBalance" :disabled="disabled" prepend="$" />
        </template>
      </p-label>

      <p-label label="Ace" description="starting balance">
        <template #default="{ id }">
          <p-number-input :id="id" v-model="aceStartingBalance" :disabled="disabled" prepend="$" />
        </template>
      </p-label>
    </div>

    <template #footer>
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
<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { format } from 'date-fns'
  import { ref } from 'vue'
  import { useApi } from '@/composables'
  import { EventRequest } from '@/models'

  const props = defineProps<{
    seasonId: string,
    disabled?: boolean,
  }>()

  const emit = defineEmits<{
    submit: [value: string],
  }>()

  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const today = format(new Date(), 'MMMM do')
  const name = ref<string>(today)
  const notes = ref<string>()
  const ctpStartingBalance = ref(0)
  const aceStartingBalance = ref(0)
  const ctpPerPlayer = ref(0)
  const acePerPlayer = ref(0)

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

    <p-label label="Ctp (per player)">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="ctpPerPlayer" :disabled="disabled" prepend="$" />
      </template>
    </p-label>

    <p-label label="Ace (per player)">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="acePerPlayer" :disabled="disabled" prepend="$" />
      </template>
    </p-label>

    <p-label label="Ctp (starting balance)">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="ctpStartingBalance" :disabled="disabled" prepend="$" />
      </template>
    </p-label>

    <p-label label="Ace (starting balance)">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="aceStartingBalance" :disabled="disabled" prepend="$" />
      </template>
    </p-label>

    <template #footer>
      <p-button :disabled="disabled || pending" type="submit" primary>
        Create Event
      </p-button>
    </template>
  </p-form>
</template>
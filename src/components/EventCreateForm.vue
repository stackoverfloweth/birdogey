<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { useApi } from '@/composables'
  import { EventRequest } from '@/models'

  const props = defineProps<{
    seasonId: string,
  }>()

  const emit = defineEmits<{
    submit: [value: string],
  }>()

  const api = useApi()
  const { ctpPennyBalance, acePennyBalance } = await api.events.getSuggestedBalance(props.seasonId)
  const { validate, pending } = useValidationObserver()
  const name = ref<string>()
  const notes = ref<string>()
  const ctpBalance = ref<number>(ctpPennyBalance / 100)
  const aceBalance = ref<number>(acePennyBalance / 100)

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
      ctpPennyBalance: Math.floor(ctpBalance.value * 100),
      acePennyBalance: Math.floor(aceBalance.value * 100),
    } as EventRequest

    const eventId = await api.events.create(request)
    showToast('Event Created!', 'success')
    emit('submit', eventId)
  }
</script>

<template>
  <p-form class="event-create-form" @submit="submit">
    <p-label label="Name" :message="nameErrorMessage" :state="nameState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="name" :state="nameState" />
      </template>
    </p-label>

    <p-label label="Notes">
      <template #default="{ id }">
        <p-textarea :id="id" v-model="notes" />
      </template>
    </p-label>

    <p-label label="Ctp (starting balance)">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="ctpBalance" prepend="$" />
      </template>
    </p-label>

    <p-label label="Ace (starting balance)">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="aceBalance" prepend="$" />
      </template>
    </p-label>

    <template #footer>
      <p-button :disabled="pending" type="submit" primary>
        Create Event
      </p-button>
    </template>
  </p-form>
</template>
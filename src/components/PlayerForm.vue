<script lang="ts" setup>
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { Player, PlayerRequest } from '@/models'

  const props = defineProps<{
    seasonId: string,
    initialValues?: Partial<Player>,
  }>()

  const emit = defineEmits<{
    submit: [value: PlayerRequest],
    cancel: [],
  }>()

  const { validate, pending } = useValidationObserver()
  const name = ref(props.initialValues?.name)
  const tagId = ref(props.initialValues?.tagId)
  const entryPaid = ref(props.initialValues?.entryPaid)

  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const { error: nameErrorMessage, state: nameState } = useValidation(name, 'Name', [isRequired])

  async function submit(): Promise<void> {
    const valid = await validate()

    if (valid && !!name.value) {
      emit('submit', {
        seasonId: props.seasonId,
        name: name.value,
        tagId: tagId.value,
        entryPaid: entryPaid.value,
      })
    }
  }
</script>

<template>
  <p-form class="player-form" @submit="submit">
    <p-label class="player-form__name" label="Name" :message="nameErrorMessage" :state="nameState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="name" :state="nameState" />
      </template>
    </p-label>

    <p-label class="player-form__tagId" label="Tag #">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="tagId" :min="0" />
      </template>
    </p-label>

    <p-label class="player-form__paid" label="Entry Paid?">
      <template #default="{ id }">
        <p-toggle :id="id" v-model="entryPaid" />
      </template>
    </p-label>

    <template #footer>
      <p-button @click="emit('cancel')">
        cancel
      </p-button>

      <p-button type="submit" :disabled="pending" primary>
        Save
      </p-button>
    </template>
  </p-form>
</template>
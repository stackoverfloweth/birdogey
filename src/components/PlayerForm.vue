<script lang="ts" setup>
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import PlayerImage from '@/components/PlayerImage.vue'
  import { Player, PlayerRequest } from '@/models'
  import { auth } from '@/services'

  const props = defineProps<{
    seasonId: string,
    loading?: boolean,
    initialValues?: Partial<Player>,
    showRemoveButton?: boolean,
  }>()

  const emit = defineEmits<{
    submit: [value: PlayerRequest],
    remove: [],
    cancel: [],
  }>()

  const { validate, pending } = useValidationObserver()
  const name = ref(props.initialValues?.name)
  const tagId = ref(props.initialValues?.tagId)
  const entryPaid = ref(props.initialValues?.entryPaid ?? true)
  const imageUrl = ref(props.initialValues?.imageUrl)

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
        imageUrl: imageUrl.value,
      })
    }
  }
</script>

<template>
  <p-form class="player-form" @submit="submit">
    <PlayerImage
      v-model="imageUrl"
    />

    <p-label class="player-form__name" label="Name" :message="nameErrorMessage" :state="nameState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="name" :disabled="!auth.isAdmin" :state="nameState" />
      </template>
    </p-label>

    <p-label class="player-form__tag-id" label="Tag #">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="tagId" :disabled="!auth.isAdmin" :min="0" />
      </template>
    </p-label>

    <p-label class="player-form__paid" label="Entry Paid?">
      <template #default="{ id }">
        <p-toggle :id="id" v-model="entryPaid" :disabled="!auth.isAdmin" />
      </template>
    </p-label>

    <template #footer>
      <p-button @click="emit('cancel')">
        Cancel
      </p-button>

      <template v-if="showRemoveButton">
        <p-button dangerous :disabled="!auth.isAdmin" @click="emit('remove')">
          Delete
        </p-button>
      </template>

      <p-button :loading="loading" type="submit" :disabled="!auth.isAdmin || pending" primary>
        Save
      </p-button>
    </template>
  </p-form>
</template>

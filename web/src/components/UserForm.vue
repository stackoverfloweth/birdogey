<script lang="ts" setup>
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import UserImageUpload from '@/components/UserImageUpload.vue'
  import { UserRequest, UserSeason } from '@birdogey/shared'
  import { auth } from '@/services'

  const props = defineProps<{
    seasonId: string,
    loading?: boolean,
    initialValues?: Partial<UserSeason>,
    showRemoveButton?: boolean,
  }>()

  const emit = defineEmits<{
    submit: [value: UserRequest],
    remove: [],
    cancel: [],
  }>()

  const { validate, pending } = useValidationObserver()
  const name = ref(props.initialValues?.name)
  const pdgaNumber = ref(props.initialValues?.pdgaNumber)
  const udiscId = ref(props.initialValues?.udiscId)
  const tagId = ref(props.initialValues?.tagId)
  const entryPaid = ref(props.initialValues?.entryPaid ?? true)
  const imageUrl = ref(props.initialValues?.imageUrl)
  const privateNotes = ref(props.initialValues?.privateNotes)

  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const { error: nameErrorMessage, state: nameState } = useValidation(name, 'Name', [isRequired])

  async function submit(): Promise<void> {
    const valid = await validate()

    if (valid && !!name.value) {
      emit('submit', {
        seasonId: props.seasonId,
        name: name.value,
        pdgaNumber: pdgaNumber.value,
        udiscId: udiscId.value,
        tagId: tagId.value,
        entryPaid: entryPaid.value,
        imageUrl: imageUrl.value,
        privateNotes: privateNotes.value,
      })
    }
  }
</script>

<template>
  <p-form class="player-form" @submit="submit">
    <UserImageUpload v-model="imageUrl" />

    <p-label class="player-form__name" label="Name" :message="nameErrorMessage" :state="nameState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="name" :disabled="auth.isReadonly" :state="nameState" />
      </template>
    </p-label>

    <p-label class="player-form__pdga-number" label="PDGA Number">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="pdgaNumber" :disabled="auth.isReadonly" />
      </template>
    </p-label>

    <p-label class="player-form__udisc-id" label="UDisc ID">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="udiscId" :disabled="auth.isReadonly" />
      </template>
    </p-label>

    <p-label class="player-form__tag-id" label="Tag #">
      <template #default="{ id }">
        <p-number-input :id="id" v-model="tagId" :disabled="auth.isReadonly" :min="0" />
      </template>
    </p-label>

    <p-label class="player-form__paid" label="Entry Paid?">
      <template #default="{ id }">
        <p-toggle :id="id" v-model="entryPaid" :disabled="auth.isReadonly" />
      </template>
    </p-label>

    <template v-if="auth.role === 'admin'">
      <p-label class="player-form__private-notes" label="Private Notes (admins only)">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="privateNotes" :disabled="auth.isReadonly" />
        </template>
      </p-label>
    </template>

    <template #footer>
      <p-button @click="emit('cancel')">
        Cancel
      </p-button>

      <template v-if="showRemoveButton">
        <p-button dangerous :disabled="auth.isReadonly" @click="emit('remove')">
          Delete
        </p-button>
      </template>

      <p-button :loading="loading" type="submit" :disabled="auth.isReadonly || pending" primary>
        Save
      </p-button>
    </template>
  </p-form>
</template>

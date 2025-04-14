<script lang="ts" setup>
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import PlayerImageUpload from '@/components/PlayerImageUpload.vue'
  import { PlayerSignupRequest } from '@/models'
  import { auth } from '@/services'

  const { signupKey, loading } = defineProps<{
    loading?: boolean,
    signupKey: string,
  }>()

  const emit = defineEmits<{
    submit: [value: PlayerSignupRequest],
    cancel: [],
  }>()

  const { validate, pending } = useValidationObserver()
  const firstName = ref<string>()
  const lastName = ref<string>()
  const imageUrl = ref<string>()

  const name = computed(() => {
    if (firstName.value && lastName.value) {
      return `${firstName.value} ${lastName.value}`
    }

    return undefined
  })

  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const { error: nameErrorMessage, state: nameState } = useValidation(name, 'Name', [isRequired])

  async function submit(): Promise<void> {
    const valid = await validate()

    if (valid && !!name.value) {
      emit('submit', {
        name: name.value,
        imageUrl: imageUrl.value,
        key: signupKey,
      })
    }
  }
</script>

<template>
  <p-form class="player-form" @submit="submit">
    <PlayerImageUpload v-model="imageUrl" />

    <p-label class="player-form__name" label="First Name" :message="nameErrorMessage" :state="nameState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="firstName" :disabled="auth.isReadonly" :state="nameState" />
      </template>
    </p-label>

    <p-label class="player-form__name" label="Last Name">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="lastName" :disabled="auth.isReadonly" />
      </template>
    </p-label>

    <template #footer>
      <p-button @click="emit('cancel')">
        Cancel
      </p-button>

      <p-button :loading="loading" type="submit" :disabled="auth.isReadonly || pending" primary>
        Sign Up
      </p-button>
    </template>
  </p-form>
</template>

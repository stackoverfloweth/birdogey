<script lang="ts" setup>
  import { useRouter } from '@kitbag/router'
  import { ValidationRule, useValidation, useValidationObserver } from '@stackoverfloweth/vue-compositions'
  import { ref } from 'vue'
  import { useApi } from '@/composables'
  import { attemptLogin, auth } from '@/services'

  const password = ref<string>()

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const { error: passwordErrorMessage, state: passwordState } = useValidation(password, 'Password', [isRequired])

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || typeof password.value === 'undefined') {
      return
    }

    const isAuthenticated = await attemptLogin(api, password.value)

    if (isAuthenticated) {
      router.push('home', { seasonId: getSeasonIdIfOnlyOne() })
    }
  }

  function getSeasonIdIfOnlyOne(): string | undefined {
    if (auth.seasons.length === 1) {
      const [onlySeason] = auth.seasons

      return onlySeason.id
    }
  }
</script>

<template>
  <div class="login-view">
    <img class="login-view__logo" src="/birdogey-logo.png" alt="Birdogey Logo">
    <p-card class="login-view__login-form">
      <p-form @submit="submit">
        <p-label label="Password" :message="passwordErrorMessage" :state="passwordState">
          <template #default="{ id }">
            <p-text-input :id="id" v-model="password" type="password" :state="passwordState" />
          </template>
        </p-label>

        <p-button :loading="pending" primary type="submit">
          Login
        </p-button>
      </p-form>
    </p-card>
  </div>
</template>

<style>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.login-view__logo,
.login-view__login-form {
  width: 100%;
  flex-grow: 1;
  max-width: 400px;
}
</style>
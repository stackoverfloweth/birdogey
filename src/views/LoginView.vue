<script lang="ts" setup>
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSiteProtection } from '@/composables'
  import { routes } from '@/router/routes'

  const password = ref<string>()
  const { attempt } = useSiteProtection()
  const router = useRouter()

  const { validate } = useValidationObserver()
  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const { error: passwordErrorMessage, state: passwordState } = useValidation(password, 'Password', [isRequired])

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || typeof password.value === 'undefined') {
      return
    }

    const isAuthenticated = await attempt(password.value)

    if (isAuthenticated) {
      router.push(routes.home())
    }
  }
</script>

<template>
  <div class="login-view">
    <p-card class="login-view__login-form">
      <p-form @submit="submit">
        <p-label label="Password" :message="passwordErrorMessage" :state="passwordState">
          <template #default="{ id }">
            <p-text-input :id="id" v-model="password" type="password" :state="passwordState" />
          </template>
        </p-label>

        <p-button primary type="submit">
          Login
        </p-button>
      </p-form>
    </p-card>
  </div>
</template>

<style>
.login-view {
  display: flex;
  justify-content: center;
}

.login-view__login-form {
  flex-grow: 1;
  max-width: 360px;
}
</style>
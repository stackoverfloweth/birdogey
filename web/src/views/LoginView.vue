<script lang="ts" setup>
  import { ValidationRule, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useApi } from '@/composables'
  import { routes } from '@/router/routes'
  import { sendVerificationCode, verifyCode, auth } from '@/services'
  import PhoneNumberInput from '@/components/PhoneNumberInput.vue'

  type Step = 'phone' | 'code'

  const step = ref<Step>('phone')
  const phoneNumber = ref<string>()

  const code = ref<string>()
  const error = ref<string>()

  const api = useApi()
  const router = useRouter()

  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const isValidPhone: ValidationRule<string | undefined> = (value) => value !== undefined && value.replace(/\D/g, '').length >= 10

  const { validate: validatePhone, pending: phonePending } = useValidationObserver()
  const { error: phoneErrorMessage, state: phoneState } = useValidation(phoneNumber, 'Phone number', [isRequired, isValidPhone])

  const { validate: validateCode, pending: codePending } = useValidationObserver()
  const isValidCode: ValidationRule<string | undefined> = (value) => value?.replace(/\D/g, '').length === 6
  const { error: codeErrorMessage, state: codeState } = useValidation(code, 'Verification code', [isRequired, isValidCode])

  async function submitPhone(): Promise<void> {
    const isValid = await validatePhone()

    if (!isValid || typeof phoneNumber.value === 'undefined') {
      return
    }

    error.value = undefined

    try {
      await sendVerificationCode(api, phoneNumber.value)
      step.value = 'code'
    } catch {
      error.value = 'Failed to send verification code'
    }
  }

  async function submitCode(): Promise<void> {
    const isValid = await validateCode()

    if (!isValid || typeof phoneNumber.value === 'undefined' || typeof code.value === 'undefined') {
      return
    }

    error.value = undefined

    try {
      const isAuthenticated = await verifyCode(api, phoneNumber.value, code.value)

      if (isAuthenticated) {
        router.push(routes.home(getSeasonIdIfOnlyOne()))
      }
    } catch {
      error.value = 'Invalid verification code'
    }
  }

  function goBack(): void {
    step.value = 'phone'
    code.value = undefined
    error.value = undefined
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
    <img class="login-view__logo" src="/birdogey-logo.png">
    <p-card class="login-view__login-form">
      <template v-if="step === 'phone'">
        <p-form @submit="submitPhone">
          <p-label label="Phone Number" :message="phoneErrorMessage" :state="phoneState">
            <template #default="{ id }">
              <PhoneNumberInput
                :id="id"
                v-model="phoneNumber"
                type="tel"
                placeholder="(555) 555-5555"
                :state="phoneState"
              />
            </template>
          </p-label>

          <p-message v-if="error" danger>
            {{ error }}
          </p-message>

          <p-button :loading="phonePending" primary type="submit">
            Send Code
          </p-button>
        </p-form>
      </template>

      <template v-else>
        <p class="login-view__subtitle">
          Enter the code sent to {{ phoneNumber }}
        </p>

        <p-form @submit="submitCode">
          <p-label label="Verification Code" :message="codeErrorMessage" :state="codeState">
            <template #default="{ id }">
              <p-text-input
                :id="id"
                v-model="code"
                inputmode="numeric"
                placeholder="000000"
                maxlength="6"
                :state="codeState"
              />
            </template>
          </p-label>

          <p-message v-if="error" danger>
            {{ error }}
          </p-message>

          <p-button :loading="codePending" primary type="submit">
            Verify
          </p-button>

          <p-button @click="goBack">
            Use a different number
          </p-button>
        </p-form>
      </template>
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

.login-view__subtitle {
  text-align: center;
  margin-bottom: var(--space-md);
  color: var(--text-subdued);
}
</style>

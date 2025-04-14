<script setup lang="ts">
  import { showToast } from '@prefecthq/prefect-design'
  import { useBoolean, useRouteParam } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { RecaptchaV2 } from 'vue3-recaptcha-v2'
  import BirdogeyTitle from '@/components/BirdogeyTitle.vue'
  import PlayerSignupForm from '@/components/PlayerSignupForm.vue'
  import { useApi } from '@/composables'
  import { PlayerSignupRequest } from '@/models/api'
  import { useRouter } from 'vue-router'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const key = useRouteParam('key')

  const captchaVerified = ref(false)
  const isFinished = ref(false)

  const { value: loading, setTrue: startLoading, setFalse: stopLoading } = useBoolean()

  async function addPlayer(request: Omit<PlayerSignupRequest, 'key'>): Promise<void> {
    startLoading()
    await api.players.signup({ ...request, key: key.value })

    showToast('Player Created!', 'success')
    stopLoading()

    isFinished.value = true
  }

  function onCaptchaVerified(response: unknown): void {
    if (typeof response === 'string') {
      captchaVerified.value = true
      verifyKeyAfterCaptcha(response)
    } else {
      onCaptchaError()
    }
  }

  function onCaptchaExpired(): void {
    captchaVerified.value = false
  }

  function onCaptchaError(): void {
    showToast('There was an error verifying that you are human. Please try again.', 'error')
    captchaVerified.value = false
  }

  function goHome(): void {
    router.push(routes.home())
  }

  async function verifyKeyAfterCaptcha(captchaResponse: string): Promise<void> {
    await api.users.verifyRecaptcha(captchaResponse, key.value)
  }
</script>

<template>
  <div class="player-sign-up">
    <BirdogeyTitle />

    <div v-if="isFinished" class="player-sign-up__finished">
      <p-message success>
        Thank you for signing up!
      </p-message>
    </div>

    <p-card v-else class="player-sign-up__card">
      <div v-if="!captchaVerified" class="player-sign-up__captcha-container">
        <p class="player-sign-up__description">
          No robots allowed
        </p>

        <div class="player-sign-up__captcha">
          <RecaptchaV2
            @load-callback="onCaptchaVerified"
            @expired-callback="onCaptchaExpired"
            @error-callback="onCaptchaError"
          />
        </div>
      </div>

      <div v-else-if="loading" class="player-sign-up__loading">
        <p-loading class="player-sign-up__loading-indicator" />
        <p>Verifying your sign-up key...</p>
      </div>

      <div v-else class="player-sign-up__form">
        <PlayerSignupForm
          :loading="loading"
          :signup-key="key"
          @submit="addPlayer"
          @cancel="goHome"
        />
      </div>
    </p-card>
  </div>
</template>

<style>
.player-sign-up {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.player-sign-up__title {
  margin-bottom: var(--space-lg);
}

.player-sign-up__card {
  width: 100%;
  max-width: 600px;
}

.player-sign-up__description {
  margin-bottom: var(--space-md);
  text-align: center;
}

.player-sign-up__captcha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-md) 0;
}

.player-sign-up__captcha {
  margin: var(--space-md) 0;
}

.player-sign-up__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) 0;
}

.player-sign-up__loading-indicator {
  font-size: 2rem;
}

.player-sign-up__error {
  margin-bottom: var(--space-md);
}

.player-sign-up__form {
  padding: var(--space-md) 0;
}
</style>

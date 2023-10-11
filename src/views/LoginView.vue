<script lang="ts" setup>
  import { ValidationRule, useValidation } from '@prefecthq/vue-compositions'
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSiteProtection } from '@/composables'
  import { routes } from '@/router/routes'

  const password = ref<string>()
  const { attempt, validated } = useSiteProtection()
  const router = useRouter()

  const isRequired: ValidationRule<string | undefined> = (value) => value !== undefined && value.trim().length > 0
  const isCorrectPassword: ValidationRule<string | undefined> = (value) => value !== undefined && attempt(value)
  const { error: passwordErrorMessage, state: passwordState } = useValidation(password, 'Password', [isRequired, isCorrectPassword])

  watch(validated, loggedIn => {
    if (loggedIn) {
      router.push(routes.home())
    }
  })
</script>

<template>
  <p-form class="login-view">
    <p-label label="Password" :message="passwordErrorMessage" :state="passwordState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="password" type="password" :state="passwordState" />
      </template>
    </p-label>
  </p-form>
</template>
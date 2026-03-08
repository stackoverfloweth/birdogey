<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { returnRoute } from '@/router/guards'
  import { routes } from '@/router/routes'
  import { clearStoredAuth } from '@/services/auth'

  returnRoute.value = undefined

  clearStoredAuth()

  const router = useRouter()

  router.push(routes.login())
</script>

<template>
  <div class="logout-view">
    Logging out...
  </div>
</template>

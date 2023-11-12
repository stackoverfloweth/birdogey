<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { returnRoute } from '@/router/guards'
  import { routes } from '@/router/routes'
  import { auth } from '@/services'

  returnRoute.value = undefined

  auth.id = undefined
  auth.isAdmin = false
  auth.isAuthorized = false
  auth.seasons = []

  const router = useRouter()

  router.push(routes.login())
</script>

<template>
  <div class="logout-view">
    Logging out...
  </div>
</template>
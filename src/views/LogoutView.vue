<script lang="ts" setup>
  import { useRouter } from '@kitbag/router'
  import { auth } from '@/services'

  auth.id = undefined
  auth.isAdmin = false
  auth.isAuthorized = false
  auth.seasons = []

  const router = useRouter()

  router.push('login')
</script>

<template>
  <div class="logout-view">
    Logging out...
  </div>
</template>
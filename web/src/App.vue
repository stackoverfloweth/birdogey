<script lang="ts" setup>
  import AppHeader from '@/components/AppHeader.vue'
  import { auth, refreshAuthToken } from '@/services'
  import { useRoute, useRouter } from 'vue-router'
  import { useQuery } from '@tanstack/vue-query'
  import { useApi } from '@/composables'
  import { MINUTE } from '@/utilities/time'
  import { routes } from './router/routes'
  import { watch } from 'vue'

  const router = useRouter()
  const route = useRoute()
  const api = useApi()

  const { error } = useQuery({
    queryKey: ['refreshLogin'],
    queryFn: () => refreshAuthToken(api),
    enabled: () => auth.isAuthorized,
    refetchInterval: MINUTE * 5,
    staleTime: MINUTE * 1,
    refetchOnWindowFocus: true,
    retry: false,
  })

  watch(error, (error) => {
    if (error) {
      router.push(routes.logout())
    }
  })
</script>

<template>
  <div class="app">
    <template v-if="auth.isAuthorized">
      <AppHeader />
    </template>
    <Suspense>
      <router-view :key="route.fullPath" />
    </Suspense>
  </div>
</template>

<style>
html,
body,
dialog {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    font-size: var(--text-base-size);
}

.app {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md);
}

.app>* {
    flex-grow: 1;
}
</style>

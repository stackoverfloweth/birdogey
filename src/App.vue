<script lang="ts" setup>
  import { provide } from 'vue'
  import AppHeader from '@/components/AppHeader.vue'
  import { ApiConfig, apiKey, createApi, auth } from '@/services'
  import { env } from '@/utilities'

  const config: ApiConfig = {
    baseUrl: env().baseApiUrl,
  }

  const api = createApi(config)
  provide(apiKey, api)
</script>

<template>
  <div class="app">
    <template v-if="auth.isAuthorized">
      <AppHeader />
    </template>
    <Suspense>
      <router-view :key="$route.fullPath" />
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

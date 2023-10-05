<script lang="ts" setup>
  import { provide } from 'vue'
  import MenuHeader from '@/components/MenuHeader.vue'
  import { ApiConfig } from '@/services/api'
  import { apiKey, createApi } from '@/services/createApi'
  import { env } from '@/utilities'

  const config: ApiConfig = {
    baseUrl: env().baseApiUrl,
  }

  const api = createApi(config)
  provide(apiKey, api)
</script>

<template>
  <div class="app">
    <MenuHeader />
    <Suspense>
      <router-view :key="$route.fullPath" />
    </Suspense>
  </div>
</template>

<style>
  html, body, dialog {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    font-size: var(--text-base-size);
  }

  .app {
    display: flex;
    flex-direction: column;
    padding: var(--space-md);
  }

  .app > * {
    flex-grow: 1;
  }
</style>

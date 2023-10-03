<script lang="ts" setup>
  import { provide } from 'vue'
  import { ApiConfig } from '@/services/api'
  import { apiKey, createApi } from '@/services/createApi'
  import { env } from '@/utilities'

  const config: ApiConfig = {
    baseUrl: env().baseApiUrl,
  }

  const api = createApi(config)
  provide(apiKey, api)

  function test(): void {
    api.example.ping()
  }
</script>

<template>
  <div class="app">
    <button @click="test">
      test
    </button>
    <router-view />
  </div>
</template>

<style>
  html, body, dialog {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
    font-size: var(--text-base-size);
    background-color: var(--contrast-gray-100);
    color: var(--contrast-foreground);
  }

  .app {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-md);
  }

  .app > * {
    flex-grow: 1;
  }

  @media(max-width: 400px){
    .app {
      padding: var(--space-xs);
    }
  }
</style>

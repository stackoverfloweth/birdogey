<script lang="ts" setup>
  import { ObjectId } from 'mongodb'
  import { provide } from 'vue'
  import MenuHeader from '@/components/MenuHeader.vue'
  import { mapper } from '@/mapper'
  import { CarResponse } from '@/mapper/models/car'
  // import { CarResponse } from '@/mapper/models/car'
  import { ApiConfig } from '@/services/api'
  import { apiKey, createApi } from '@/services/createApi'
  import { env } from '@/utilities'

  const config: ApiConfig = {
    baseUrl: env().baseApiUrl,
  }

  const api = createApi(config)
  provide(apiKey, api)

  const exCarResponse = { _id: '123' as unknown as ObjectId, make: 'honda', model: 'pilot' } as CarResponse
  const result = [
    mapper.map('number', 123, 'string'),
    mapper.map('CarResponse', exCarResponse, 'Car'),
    mapper.mapMany('number', [123, 409], 'string'),
    mapper.map('number', 123, 'Date'),
  ]

  console.log('here')

  console.log({ result })
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
    gap: var(--space-md);
    padding: var(--space-md);
  }

  .app > * {
    flex-grow: 1;
  }
</style>

<script lang="ts" setup>
  import { useRoute } from '@kitbag/router'
  import { computed } from 'vue'

  const route = useRoute()

  const seasonId = computed(() => {
    if ('seasonId' in route.params) {
      return route.params.seasonId
    }

    return undefined
  })
</script>

<template>
  <div class="app-header">
    <router-link :to="(resolve) => resolve('home', { seasonId })">
      <img class="app-header__logo" src="/birdogey-logo.png" alt="Birdogey Logo">
    </router-link>
  </div>
</template>

<style>
.app-header {
  display: flex;
  justify-content: center;
}

.app-header__logo {
  width: 100px;
}

@media (max-width: 640px) {
  .app-header {
    justify-content: center;
  }
}
</style>
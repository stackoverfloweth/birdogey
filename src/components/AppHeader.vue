<script lang="ts" setup>
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { routes } from '@/router/routes'

  const seasonId = useRouteParam('seasonId')
</script>

<template>
  <div class="app-header">
    <p-link :to="routes.home(seasonId)">
      <img class="app-header__logo" src="/birdogey-logo.png">
    </p-link>
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
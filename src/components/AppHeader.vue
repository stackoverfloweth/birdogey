<script lang="ts" setup>
  import { useRouteParam } from '@prefecthq/vue-compositions'

  const seasonId = useRouteParam('seasonId')
</script>

<template>
  <div class="app-header">
    <router-link :to="(resolve) => resolve('')">
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
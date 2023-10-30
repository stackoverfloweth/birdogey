<script lang="ts" setup>
  import AppMenu from '@/components/AppMenu.vue'
  import { routes } from '@/router/routes'

  defineProps<{
    seasonId: string,
  }>()
</script>

<template>
  <AppMenu class="players-menu" icon="Bars3Icon">
    <template #default>
      <p-overflow-menu-item icon="UserPlusIcon" label="Create New Player" :to="routes.playerCreate(seasonId)" />
    </template>
  </AppMenu>
</template>
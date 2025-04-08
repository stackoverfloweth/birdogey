<script lang="ts" setup>
  import AppMenu from '@/components/AppMenu.vue'
  import { routes } from '@/router/routes'

  defineProps<{
    seasonId: string,
  }>()
</script>

<template>
  <AppMenu class="events-list-view-menu" icon="Bars3Icon">
    <template #default>
      <template v-if="seasonId">
        <p-overflow-menu-item icon="CalendarDaysIcon" label="New Event" :to="routes.eventCreate(seasonId)" />
        <p-overflow-menu-item icon="UsersIcon" label="Manage Players" :to="routes.players(seasonId)" />
      </template>
    </template>
  </AppMenu>
</template>

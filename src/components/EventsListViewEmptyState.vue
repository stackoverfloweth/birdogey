<script lang="ts" setup>
  import { routes } from '@/router/routes'

  defineProps<{
    seasonId: string,
  }>()
</script>

<template>
  <p-empty-state class="events-list-view-empty-state">
    <template #icon>
      <p-icon icon="CalendarDaysIcon" />
    </template>
    <template #heading>
      Create your first event
    </template>
    <template #actions>
      <p-button icon="PlusIcon" :to="routes.eventCreate(seasonId)">
        Create Event
      </p-button>
    </template>
  </p-empty-state>
</template>
<script lang="ts" setup>
  import EventListItem from '@/components/EventListItem.vue'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'
  import { useRouteParam } from '@prefecthq/vue-compositions'

  defineProps<{
    events: Event[],
  }>()

  const emit = defineEmits<{
    select: [value: Event],
  }>()

  const seasonId = useRouteParam('seasonId')
</script>

<template>
  <div class="events-list">
    <div class="events-list__add-new">
      <p-button icon="PlusIcon" :to="routes.eventCreate(seasonId)">
        Add New Event
      </p-button>
    </div>
    <template v-for="event in events" :key="event.id">
      <EventListItem :event="event" @click="emit('select', event)" />
    </template>
  </div>
</template>

<style>
.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  container-type: inline-size;
}
</style>

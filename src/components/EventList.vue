<script lang="ts" setup>
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    events: Event[],
  }>()

  const selected = useRouteParam('event')
</script>

<template>
  <div class="event-list">
    <template v-for="event in events" :key="event.id">
      <p-button :selected="selected === event.id" class="event-list__item" :to="routes.event(event.id)">
        {{ event.name }}
      </p-button>
    </template>
  </div>
</template>

<style>
.event-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxs);
}

.event-list__item {
  max-width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
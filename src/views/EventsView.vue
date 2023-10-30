<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventManage from '@/components/EventManage.vue'
  import EventsViewMenu from '@/components/EventsViewMenu.vue'
  import { useApi } from '@/composables'
  import { routes } from '@/router/routes'

  const api = useApi()
  const seasonId = useRouteParam('seasonId')
  const eventId = useRouteParam('eventId')

  const eventSubscription = useSubscription(api.events.getById, [eventId])
  const event = computed(() => eventSubscription.response ?? null)
</script>

<template>
  <div class="events-view">
    <EventsViewMenu :event-id="eventId" />
    <ContextBreadCrumbs :crumbs="[{ text: 'Events', to: routes.events(seasonId) }, { text: event?.name ?? '...' }]" />

    <template v-if="event">
      <EventManage :event="event" disabled />
    </template>
  </div>
</template>

<style>
.events-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
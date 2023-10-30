<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventList from '@/components/EventList.vue'
  import EventsListViewMenu from '@/components/EventsListViewMenu.vue'
  import { useApi } from '@/composables'

  const api = useApi()
  const seasonId = useRouteParam('seasonId')

  const eventSubscription = useSubscription(api.events.getList, [seasonId])
  const events = computed(() => eventSubscription.response ?? [])
</script>

<template>
  <div class="events-list-view">
    <EventsListViewMenu :season-id="seasonId" />
    <ContextBreadCrumbs :crumbs="[{ text: 'Events' }]" />
    <EventList :events="events" />
  </div>
</template>

<style>
.events-list-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
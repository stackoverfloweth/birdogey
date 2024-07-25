<script lang="ts" setup>
  import { useRoute, useRouter } from '@kitbag/router'
  import { useSubscription } from '@stackoverfloweth/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventsList from '@/components/EventsList.vue'
  import EventsListViewEmptyState from '@/components/EventsListViewEmptyState.vue'
  import EventsListViewMenu from '@/components/EventsListViewMenu.vue'
  import { useApi } from '@/composables'
  import { Event } from '@/models'

  const api = useApi()
  const router = useRouter()
  const route = useRoute('events.list')

  const eventSubscription = useSubscription(api.events.getList, [route.params.seasonId])
  const events = computed(() => eventSubscription.response ?? [])

  function openEvent(event: Event): void {
    router.push('events.view', { ...route.params, eventId: event.id })
  }
</script>

<template>
  <div class="events-list-view">
    <EventsListViewMenu :season-id="route.params.seasonId" />
    <ContextBreadCrumbs :crumbs="[{ text: 'Events' }]" />

    <template v-if="eventSubscription.loading">
      <p-loading-icon />
    </template>
    <template v-else-if="events.length === 0">
      <EventsListViewEmptyState :season-id="route.params.seasonId" />
    </template>
    <template v-else>
      <EventsList :events="events" @select="openEvent" />
    </template>
  </div>
</template>

<style>
.events-list-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
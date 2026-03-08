<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventManage from '@/components/EventManage.vue'
  import { useApi } from '@/composables'
  import { EventRequest } from '@/models'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const seasonId = useRouteParam('seasonId')
  const eventId = useRouteParam('eventId')

  const eventSubscription = useSubscription(api.events.getById, [eventId])
  const event = computed(() => eventSubscription.response ?? null)

  async function saveEvent(request: Partial<EventRequest>): Promise<void> {
    await api.events.update(eventId.value, request)

    showToast('Event Updated!', 'success')
  }

  async function completeEvent(request: Partial<EventRequest>): Promise<void> {
    await api.events.complete(eventId.value, request)

    router.push(routes.event(eventId.value))

    showToast('Event Completed!', 'success')

    eventSubscription.refresh()
  }

  function cancel(): void {
    eventSubscription.refresh()

    router.push(routes.event(eventId.value))
  }
</script>

<template>
  <div class="events-edit-view">
    <ContextBreadCrumbs :crumbs="[{ text: 'Events', to: routes.events(seasonId) }, { text: event?.name ?? '...' }]" />

    <template v-if="event">
      <EventManage :event="event" @save="saveEvent" @complete="completeEvent" @cancel="cancel" />
    </template>
  </div>
</template>

<style>
.events-edit-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
</style>

<script lang="ts" setup>
  import { useRoute, useRouter } from '@kitbag/router'
  import { showToast } from '@stackoverfloweth/prefect-design'
  import { useSubscription } from '@stackoverfloweth/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventManage from '@/components/EventManage.vue'
  import { useApi } from '@/composables'
  import { EventRequest } from '@/models'

  const api = useApi()
  const router = useRouter()
  const route = useRoute('events.edit')

  const eventSubscription = useSubscription(api.events.getById, [route.params.eventId])
  const event = computed(() => eventSubscription.response ?? null)

  async function saveEvent(request: Partial<EventRequest>): Promise<void> {
    await api.events.update(route.params.eventId, request)

    showToast('Event Updated!', 'success')
  }

  async function completeEvent(request: Partial<EventRequest>): Promise<void> {
    await api.events.complete(route.params.eventId, request)

    // router.push('')

    showToast('Event Completed!', 'success')

    eventSubscription.refresh()
  }
</script>

<template>
  <div class="events-edit-view">
    <ContextBreadCrumbs :crumbs="[{ text: 'Events', to: '' }, { text: event?.name ?? '...' }]" />

    <template v-if="event">
      <EventManage :event="event" @save="saveEvent" @complete="completeEvent" @cancel="router.back" />
    </template>
  </div>
</template>

<style>
.events-edit-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
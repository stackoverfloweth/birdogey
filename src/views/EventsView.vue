<script lang="ts" setup>
  import { useBoolean, useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventManage from '@/components/EventManage.vue'
  import EventsViewMenu from '@/components/EventsViewMenu.vue'
  import PlayerCheckinModal from '@/components/PlayerCheckinModal.vue'
  import { useApi } from '@/composables'
  import { routes } from '@/router/routes'
  import { auth } from '@/services'

  const api = useApi()
  const seasonId = useRouteParam('seasonId')
  const eventId = useRouteParam('eventId')

  const eventSubscription = useSubscription(api.events.getById, [eventId])
  const event = computed(() => eventSubscription.response ?? null)

  const { value: checkinModalVisible, setTrue: showCheckinModal } = useBoolean()
</script>

<template>
  <div class="events-view">
    <EventsViewMenu :event-id="eventId" />
    <ContextBreadCrumbs :crumbs="[{ text: 'Events', to: routes.events(seasonId) }, { text: event?.name ?? '...' }]" />

    <template v-if="event">
      <div class="events-view__quick-actions">
        <template v-if="!event.completed">
          <p-button icon="CheckCircleIcon" @click="showCheckinModal">
            Check in
          </p-button>
        </template>

        <template v-if="!auth.isReadonly">
          <p-button icon="PencilSquareIcon" :to="routes.eventEdit(eventId)">
            Edit
          </p-button>
        </template>
      </div>

      <EventManage :event="event" disabled />
    </template>

    <PlayerCheckinModal v-model:is-open="checkinModalVisible" :season-id="seasonId" :event-id="eventId" @update:is-open="() => eventSubscription.refresh()" />
  </div>
</template>

<style>
.events-view {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--space-md);
}

.events-view__quick-actions {
  display: flex;
  gap: var(--space-sm);
  align-items: center
}
</style>

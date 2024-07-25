<script lang="ts" setup>
  import { useRoute, useRouter } from '@kitbag/router'
  import { useBoolean, useSubscription } from '@stackoverfloweth/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventManage from '@/components/EventManage.vue'
  import EventsViewMenu from '@/components/EventsViewMenu.vue'
  import PlayerCheckinModal from '@/components/PlayerCheckinModal.vue'
  import { useApi } from '@/composables'
  import { auth } from '@/services'

  const api = useApi()
  const route = useRoute('events.view')
  const router = useRouter()

  const eventSubscription = useSubscription(api.events.getById, [route.params.eventId])
  const event = computed(() => eventSubscription.response ?? null)

  const { value: checkinModalVisible, setTrue: showCheckinModal } = useBoolean()

  function editEvent(): void {
    router.push('events.edit', route.params)
  }
</script>

<template>
  <div class="events-view">
    <EventsViewMenu :event-id="route.params.eventId" />
    <ContextBreadCrumbs :crumbs="[{ text: 'Events', to: '' }, { text: event?.name ?? '...' }]" />

    <template v-if="event">
      <div class="events-view__quick-actions">
        <template v-if="!event.completed">
          <p-button icon="CheckCircleIcon" @click="showCheckinModal">
            Check in
          </p-button>
        </template>

        <template v-if="auth.isAdmin">
          <p-button icon="PencilSquareIcon" @click="editEvent">
            Edit
          </p-button>
        </template>
      </div>

      <EventManage :event="event" disabled />
    </template>

    <PlayerCheckinModal v-model:isOpen="checkinModalVisible" :season-id="route.params.seasonId" :event-id="route.params.eventId" @update:is-open="eventSubscription.refresh" />
  </div>
</template>

<style>
.events-view {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: var(--space-lg);
}

.events-view__quick-actions {
  display: flex;
  gap: var(--space-sm);
  align-items: center
}
</style>
<script lang="ts" setup>
  import { useBoolean, useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { format } from 'date-fns'
  import { computed, watch } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventManage from '@/components/EventManage.vue'
  import EventsViewMenu from '@/components/EventsViewMenu.vue'
  import UserCheckinModal from '@/components/UserCheckinModal.vue'
  import { useApi } from '@/composables'
  import { routes } from '@/router/routes'
  import { auth } from '@/services'
  import { useRouter } from 'vue-router'
  import { showToast } from '@prefecthq/prefect-design'

  const api = useApi()
  const seasonId = useRouteParam('seasonId')
  const eventId = useRouteParam('eventId')
  const router = useRouter()

  const eventSubscription = useSubscription(api.events.getById, [eventId])
  const event = computed(() => eventSubscription.response ?? null)
  const eventLabel = computed(() => {
    return event.value ? format(event.value.start, 'MMMM do') : '...'
  })

  const { value: checkinModalVisible, setTrue: showCheckinModal } = useBoolean()

  async function uncompleteEvent(): Promise<void> {
    await api.events.uncomplete(eventId.value)

    showToast('Event Uncompleted!', 'success')

    eventSubscription.refresh()
  }

  watch(event, (event) => {
    if (!event?.completed && !auth.isReadonly) {
      router.replace(routes.eventEdit(eventId.value))
    }
  })
</script>

<template>
  <div class="events-view">
    <EventsViewMenu :season-id="seasonId" :event-id="eventId" />
    <ContextBreadCrumbs :crumbs="[{ text: 'Events', to: routes.events(seasonId) }, { text: eventLabel }]" />

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

          <p-button v-if="event.completed" icon="LockOpenIcon" @click="uncompleteEvent">
            Uncomplete Event
          </p-button>
        </template>
      </div>

      <EventManage :event="event" disabled />
    </template>

    <UserCheckinModal v-model:is-open="checkinModalVisible" :season-id="seasonId" :event-id="eventId" @update:is-open="() => eventSubscription.refresh()" />
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

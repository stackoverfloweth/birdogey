<script lang="ts" setup>
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventCreateForm from '@/components/EventCreateForm.vue'
  import EventManage from '@/components/EventManage.vue'
  import { useApi, useSavedContext } from '@/composables'
  import { Event } from '@/models'

  const { seasonId } = useSavedContext()

  const api = useApi()
  const subscriptionArgs = computed<Parameters<typeof api.events.getList> | null>(() => seasonId.value ? [seasonId.value] : null)
  const eventSubscription = useSubscriptionWithDependencies(api.events.getList, subscriptionArgs)
  const events = computed(() => eventSubscription.response ?? [])
  const latestEvent = computed<Event | undefined>(() => {
    const [first] = events.value

    return first
  })

  const canCreateEvent = computed(() => events.value.every(event => !!event.completed))

  const tabs = computed(() => [
    { label: 'Add Event', event: null },
    ...events.value.map(event => ({
      event,
      label: event.name,
    })),
  ])
</script>

<template>
  <div class="home-view">
    <template v-if="!eventSubscription.executed && eventSubscription.loading">
      <p-loading-icon />
    </template>
    <p-tabs v-else-if="seasonId" :tabs="tabs" class="home-view__tabs">
      <template #add-event-heading>
        <p-icon icon="PlusIcon" />
      </template>
      <template #add-event>
        <EventCreateForm :disabled="!canCreateEvent" :previous-event="latestEvent" :season-id="seasonId" @submit="eventSubscription.refresh" />
      </template>
      <template #content="{ index }">
        <EventManage :event="tabs[index].event!" />
      </template>
    </p-tabs>
  </div>
</template>
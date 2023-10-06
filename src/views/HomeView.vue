<script lang="ts" setup>
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventCreateForm from '@/components/EventCreateForm.vue'
  import EventOverview from '@/components/EventOverview.vue'
  import { useApi, useSavedContext } from '@/composables'

  const { seasonId } = useSavedContext()

  const api = useApi()
  const subscriptionArgs = computed<Parameters<typeof api.events.getList> | null>(() => seasonId.value ? [seasonId.value] : null)
  const eventSubscription = useSubscriptionWithDependencies(api.events.getList, subscriptionArgs)
  const events = computed(() => eventSubscription.response ?? [])

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
    <p-tabs v-if="seasonId" :tabs="tabs" class="home-view__tabs">
      <template #add-event-heading>
        <p-icon icon="PlusIcon" />
      </template>
      <template #add-event>
        <EventCreateForm :season-id="seasonId" @submit="eventSubscription.refresh" />
      </template>
      <template #content="{ index }">
        <EventOverview :event="tabs[index].event!" />
      </template>
    </p-tabs>
  </div>
</template>
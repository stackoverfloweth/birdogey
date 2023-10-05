<script lang="ts" setup>
  import { Tab } from '@prefecthq/prefect-design'
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventForm from '@/components/EventForm.vue'
  import EventsTable from '@/components/EventsTable.vue'
  import { useApi, useSavedContext } from '@/composables'

  const { seasonId } = useSavedContext()

  const api = useApi()
  const subscriptionArgs = computed<Parameters<typeof api.events.getList> | null>(() => seasonId.value ? [seasonId.value] : null)
  const eventSubscription = useSubscriptionWithDependencies(api.events.getList, subscriptionArgs)
  const events = computed(() => eventSubscription.response ?? [])

  const tabs = computed<Tab[]>(() => [
    { label: 'Add Event' },
    ...events.value.map(event => ({
      label: event.name,
    })),
  ])
</script>

<template>
  <div class="home-view">
    <!-- v-if="seasonId" -->
    <p-tabs v-if="seasonId" :tabs="tabs" class="home-view__tabs">
      <template #add-event-heading>
        <p-icon icon="PlusIcon" />
      </template>
      <template #add-event>
        <EventForm :season-id="seasonId" @submit="eventSubscription.refresh" />
      </template>
    </p-tabs>
    <!-- tab set, each week is a tab, first tab is always a button to create new event -->
    <!-- new event modal -->
    <!-- within each tab, EventsTable, last row has button to add row -->
    <EventsTable />
  </div>
</template>

<style>
.home-view__tabs .p-tab:first-of-type {
  color: white;
  background-color: var(--contrast-gray-300);
}
</style>
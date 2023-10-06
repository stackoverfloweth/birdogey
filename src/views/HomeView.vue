<script lang="ts" setup>
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import EventForm from '@/components/EventForm.vue'
  import EventPlayersList from '@/components/EventPlayersList.vue'
  import { useApi, useSavedContext } from '@/composables'

  const { seasonId } = useSavedContext()

  const api = useApi()
  const subscriptionArgs = computed<Parameters<typeof api.events.getList> | null>(() => seasonId.value ? [seasonId.value] : null)
  const eventSubscription = useSubscriptionWithDependencies(api.events.getList, subscriptionArgs)
  const events = computed(() => eventSubscription.response ?? [])

  const tabs = computed(() => [
    { label: 'Add Event', id: null },
    ...events.value.map(event => ({
      ...event,
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
        <EventForm :season-id="seasonId" @submit="eventSubscription.refresh" />
      </template>
      <template #content="{ index }">
        <EventPlayersList :season-id="seasonId" :event-id="tabs[index].id!" />
      </template>
    </p-tabs>
  </div>
</template>

<style>
.home-view__tabs .p-tab:first-of-type {
  color: white;
  background-color: var(--p-color-bg-1);
}
</style>
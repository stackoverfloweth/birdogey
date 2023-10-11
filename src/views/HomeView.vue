<script lang="ts" setup>
  import { kebabCase } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import EventCreateForm from '@/components/EventCreateForm.vue'
  import EventManage from '@/components/EventManage.vue'
  import { useApi, useSavedContext } from '@/composables'
  import { Event } from '@/models'
  import { routes } from '@/router/routes'

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

  const router = useRouter()
  const selectedTab = useRouteParam('tab')

  function updateTab(tab: string): void {
    router.push(routes.home(kebabCase(tab)))
  }

  const tabs = computed(() => [
    { label: 'add-event', event: null },
    ...events.value.map(event => ({
      event,
      label: kebabCase(event.name),
    })),
  ])

  function fromKebabCase(value?: string): string | undefined {
    return value?.replace(/-/g, ' ')
  }

  function eventCreated(name: string): void {
    eventSubscription.refresh()
    updateTab(name)
  }
</script>

<template>
  <div class="home-view">
    <template v-if="!eventSubscription.executed && eventSubscription.loading">
      <p-loading-icon />
    </template>
    <p-tabs v-else-if="seasonId" :selected="selectedTab" :tabs="tabs" class="home-view__tabs" @update:selected="updateTab">
      <template #heading="{ tab }">
        <p-icon v-if="tab?.label === 'add-event'" icon="PlusIcon" />
        <template v-else>
          <span class="home-view__tab-heading">
            {{ fromKebabCase(tab?.label) }}
          </span>
        </template>
      </template>
      <template #add-event>
        <EventCreateForm :disabled="!canCreateEvent" :previous-event="latestEvent" :season-id="seasonId" @submit="eventCreated" />
      </template>
      <template #content="{ index }">
        <EventManage :event="tabs[index].event!" />
      </template>
    </p-tabs>
  </div>
</template>

<style>
.home-view__tab-heading {
  text-transform: capitalize;
}
</style>
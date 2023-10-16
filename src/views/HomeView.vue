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
  import { capitalize, fromKebabCase } from '@/utilities'

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
  const routeTab = useRouteParam('tab')
  const selectedTab = computed({
    get() {
      if (!routeTab.value) {
        return routeTab.value
      }

      return capitalize(fromKebabCase(routeTab.value))
    },
    set(value) {
      routeTab.value = kebabCase(value)
    },
  })

  function updateTab(tab: string): void {
    router.push(routes.home(kebabCase(tab)))
  }

  const tabs = computed(() => [
    { label: 'Add Event', event: null },
    ...events.value.map(event => ({
      event,
      label: event.name,
    })),
  ])

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
        <p-icon v-if="tab?.label === 'Add Event'" icon="PlusIcon" />
        <template v-else>
          <span class="home-view__tab-heading">
            {{ tab?.label ?? tab }}
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

.home-view__tabs .p-tab {
  white-space: nowrap;
}

.home-view__tabs .p-tab-navigation.p-tabs--not-mobile {
  max-width: 100%;
  overflow-x: auto;
}
</style>
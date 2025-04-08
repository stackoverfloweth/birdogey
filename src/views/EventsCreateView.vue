<script lang="ts" setup>
  import { Crumb, showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventCreateForm from '@/components/EventCreateForm.vue'
  import { useApi } from '@/composables'
  import { Event, EventRequest } from '@/models'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const seasonId = useRouteParam('seasonId')

  const crumbs = computed<Crumb[]>(() => [
    { text: 'Events', to: routes.events(seasonId.value) },
    { text: 'Create' },
  ])

  const eventSubscription = useSubscription(api.events.getList, [seasonId])
  const events = computed(() => eventSubscription.response ?? [])
  const latestEvent = computed<Event | undefined>(() => {
    const [first] = events.value

    return first
  })

  async function submit(request: EventRequest): Promise<void> {
    const eventId = await api.events.create(request)

    router.push(routes.event(eventId))

    showToast('Event Created!', 'success')
  }
</script>

<template>
  <div class="events-create-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

    <p-card>
      <EventCreateForm :season-id="seasonId" :previous-event="latestEvent" @submit="submit" @cancel="router.back" />
    </p-card>
  </div>
</template>

<style>
.events-create-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>

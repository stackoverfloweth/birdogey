<script lang="ts" setup>
  import { useRoute, useRouter } from '@kitbag/router'
  import { Crumb, showToast } from '@stackoverfloweth/prefect-design'
  import { useSubscription } from '@stackoverfloweth/vue-compositions'
  import { computed } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import EventCreateForm from '@/components/EventCreateForm.vue'
  import { useApi } from '@/composables'
  import { Event, EventRequest } from '@/models'

  const api = useApi()
  const router = useRouter()
  const route = useRoute('events.create')

  const crumbs = computed<Crumb[]>(() => [
    { text: 'Events', to: '' },
    { text: 'Create' },
  ])

  const eventSubscription = useSubscription(api.events.getList, [route.params.seasonId])
  const events = computed(() => eventSubscription.response ?? [])
  const latestEvent = computed<Event | undefined>(() => {
    const [first] = events.value

    return first
  })

  async function submit(request: EventRequest): Promise<void> {
    const eventId = await api.events.create(request)

    // router.push('')

    showToast('Event Created!', 'success')
  }
</script>

<template>
  <div class="events-create-view">
    <ContextBreadCrumbs :crumbs="crumbs" />

    <p-card>
      <EventCreateForm :season-id="route.params.seasonId" :previous-event="latestEvent" @submit="submit" @cancel="router.back" />
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
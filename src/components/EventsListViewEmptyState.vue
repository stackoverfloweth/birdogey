<script lang="ts" setup>
  import { useRouter } from '@kitbag/router'

  const props = defineProps<{
    seasonId: string,
  }>()

  const router = useRouter()

  function createEvent(): void {
    router.push('events.create', { seasonId: props.seasonId })
  }
</script>

<template>
  <p-empty-state class="events-list-view-empty-state">
    <template #icon>
      <p-icon icon="CalendarDaysIcon" />
    </template>
    <template #heading>
      Create your first event
    </template>
    <template #actions>
      <p-button icon="PlusIcon" @click="createEvent">
        Create Event
      </p-button>
    </template>
  </p-empty-state>
</template>
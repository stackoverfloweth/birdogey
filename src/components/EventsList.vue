<script lang="ts" setup>
  import EventListItem from '@/components/EventListItem.vue'
  import { Event } from '@/models'

  defineProps<{
    events: Event[],
  }>()

  const emit = defineEmits<{
    select: [value: Event],
  }>()
</script>

<template>
  <div class="events-list">
    <template v-for="event in events" :key="event.id">
      <EventListItem :event="event" @click="emit('select', event)" />
    </template>
  </div>
</template>

<style>
.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  container-type: inline-size;
}
</style>
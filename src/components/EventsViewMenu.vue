<script lang="ts" setup>
  import { useRoute, useRouter } from '@kitbag/router'
  import AppMenu from '@/components/AppMenu.vue'
  import { auth } from '@/services'

  const props = defineProps<{
    eventId: string,
  }>()

  const router = useRouter()
  const route = useRoute('events')

  function editEvent(): void {
    router.push('events.edit', { ...route.params, eventId: props.eventId })
  }
</script>

<template>
  <AppMenu class="events-view-menu" icon="Bars3Icon">
    <template #default>
      <template v-if="eventId && auth.isAdmin">
        <p-overflow-menu-item icon="PencilSquareIcon" label="Edit Event" @click="editEvent" />
      </template>
    </template>
  </AppMenu>
</template>
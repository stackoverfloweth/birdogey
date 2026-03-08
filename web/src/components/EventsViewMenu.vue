<script lang="ts" setup>
  import AppMenu from '@/components/AppMenu.vue'
  import { routes } from '@/router/routes'
  import { auth } from '@/services'
  import { useRouteParam } from '@prefecthq/vue-compositions'

  const eventId = useRouteParam('eventId')
</script>

<template>
  <AppMenu class="events-view-menu" icon="Bars3Icon">
    <template #default>
      <template v-if="eventId && !auth.isReadonly">
        <p-overflow-menu-item icon="PencilSquareIcon" label="Edit Event" :to="routes.eventEdit(eventId)" />
      </template>
    </template>
  </AppMenu>
</template>

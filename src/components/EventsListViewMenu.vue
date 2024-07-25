<script lang="ts" setup>
  import { useRouter } from '@kitbag/router'
  import AppMenu from '@/components/AppMenu.vue'

  const props = defineProps<{
    seasonId: string,
  }>()

  const router = useRouter()

  function newEvent(): void {
    router.push('events.create', { seasonId: props.seasonId })
  }

  function managePlayers(): void {
    router.push('players.list', { seasonId: props.seasonId })
  }
</script>

<template>
  <AppMenu class="events-list-view-menu" icon="Bars3Icon">
    <template #default>
      <template v-if="seasonId">
        <p-overflow-menu-item icon="CalendarDaysIcon" label="New Event" @click="newEvent" />
        <p-overflow-menu-item icon="UsersIcon" label="Manage Players" @click="managePlayers" />
      </template>
    </template>
  </AppMenu>
</template>
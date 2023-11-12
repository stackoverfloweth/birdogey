<script lang="ts" setup>
  import { routes } from '@/router/routes'

  defineProps<{
    seasonId: string,
  }>()
</script>

<template>
  <p-empty-state class="players-list-view-empty-state">
    <template #icon>
      <p-icon icon="UserGroupIcon" />
    </template>
    <template #heading>
      Add players to this season
    </template>
    <template #actions>
      <p-button icon="PlusIcon" :to="routes.playerCreate(seasonId)">
        Add Player
      </p-button>
    </template>
  </p-empty-state>
</template>
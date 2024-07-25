<script lang="ts" setup>
  import { useRouter } from '@kitbag/router'

  const props = defineProps<{
    seasonId: string,
  }>()

  const router = useRouter()

  function createPlayer(): void {
    router.push('players.create', { seasonId: props.seasonId })
  }
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
      <p-button icon="PlusIcon" @click="createPlayer">
        Add Player
      </p-button>
    </template>
  </p-empty-state>
</template>
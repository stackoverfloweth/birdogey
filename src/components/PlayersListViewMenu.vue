<script lang="ts" setup>
  import { useRouter } from '@kitbag/router'
  import AppMenu from '@/components/AppMenu.vue'

  const props = defineProps<{
    seasonId: string,
  }>()

  const router = useRouter()

  function createPlayer(): void {
    router.push('players.create', { seasonId: props.seasonId })
  }
</script>

<template>
  <AppMenu class="players-list-view-menu" icon="Bars3Icon">
    <template #default>
      <p-overflow-menu-item icon="UserPlusIcon" label="Create New Player" @click="createPlayer" />
    </template>
  </AppMenu>
</template>
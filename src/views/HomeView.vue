<script lang="ts" setup>
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { watch } from 'vue'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
import { useRouter } from '@kitbag/router';

  const router = useRouter()
  const seasonId = useRouteParam('seasonId')

  watch(seasonId, value => {
    if (value) {
      router.push('events', {seasonId: seasonId.value})
    }
  }, { immediate: true })
</script>

<template>
  <div class="home-view">
    <ContextBreadCrumbs class="home-view__breadcrumbs" :crumbs="[]" />
  </div>
</template>

<style>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}
</style>
<script lang="ts" setup>
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { watch } from 'vue'
  import { useRouter } from 'vue-router'
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
  import BirdogeyTitle from '@/components/BirdogeyTitle.vue'
  import AppMenu from '@/components/AppMenu.vue'
  import { routes } from '@/router/routes'

  const router = useRouter()
  const seasonId = useRouteParam('seasonId')

  watch(seasonId, (value) => {
    if (value) {
      router.push(routes.events(seasonId.value))
    }
  }, { immediate: true })
</script>

<template>
  <div class="home-view">
    <BirdogeyTitle />

    <ContextBreadCrumbs class="home-view__breadcrumbs" :crumbs="[]" />

    <AppMenu icon="Bars3Icon" />
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

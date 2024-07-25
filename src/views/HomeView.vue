<script lang="ts" setup>
  import ContextBreadCrumbs from '@/components/ContextBreadCrumbs.vue'
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
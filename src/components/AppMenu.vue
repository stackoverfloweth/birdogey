<script lang="ts" setup>
  import { routes } from '@/router/routes'
  import { computed } from 'vue'

  const { position = 'left' } = defineProps<{
    position?: 'left' | 'right',
  }>()

  const classes = computed(() => [
    `app-menu--${position}`,
  ])
</script>

<template>
  <p-icon-button-menu class="app-menu" :class="classes">
    <template #default="{ close }">
      <slot name="default" :close="close" />

      <p-overflow-menu-item icon="ArrowRightOnRectangleIcon" label="Logout" :to="routes.logout()" />
    </template>
  </p-icon-button-menu>
</template>

<style>
.app-menu {
  position: absolute;
  top: var(--space-md);
}

.app-menu--left {
  left: var(--space-md);
}

.app-menu--right {
  right: var(--space-md);
}

.app-menu__submenu {
  margin-left: 1px;
}
</style>

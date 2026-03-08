<script lang="ts" setup>
  import { routes } from '@/router/routes'
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'

  const { position = 'left' } = defineProps<{
    position?: 'left' | 'right',
  }>()

  const seasonId = useRouteParam('seasonId')

  const classes = computed(() => [
    `app-menu--${position}`,
  ])
</script>

<template>
  <p-icon-button-menu class="app-menu" :class="classes" icon="Bars3Icon">
    <template #default="{ close }">
      <slot name="default" :close="close" />

      <template v-if="seasonId">
        <p-overflow-menu-item icon="UsersIcon" label="Manage Players" :to="routes.players(seasonId)" />
      </template>

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

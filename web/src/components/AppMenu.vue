<script lang="ts" setup>
  import { routes } from '@/router/routes'
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { format } from 'date-fns'

  const { position = 'left' } = defineProps<{
    position?: 'left' | 'right',
  }>()

  const seasonId = useRouteParam('seasonId')

  const classes = computed(() => [
    `app-menu--${position}`,
  ])

  const buildTime = new Date(__BUILD_TIME__)
</script>

<template>
  <p-icon-button-menu class="app-menu" :class="classes" icon="Bars3Icon">
    <template #default="{ close }">
      <slot name="default" :close="close" />

      <template v-if="seasonId">
        <p-overflow-menu-item icon="UsersIcon" label="Manage Players" :to="routes.users(seasonId)" />
      </template>

      <p-overflow-menu-item icon="ArrowRightOnRectangleIcon" label="Logout" :to="routes.logout()" />

      <p class="app-menu__build-time">
        {{ format(buildTime, 'yy.MM.dd.HH.mm.ss') }}
      </p>
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

.app-menu__build-time {
  font-size: 0.7rem;
  margin-top: var(--space-sm);
  align-self: center;
  color: var(--color-fg-subtle, #888);
  user-select: none;
}
</style>

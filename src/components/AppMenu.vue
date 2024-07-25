<script lang="ts" setup>
  import { useRouter } from '@kitbag/router'

  const router = useRouter()

  function logout(): void {
    router.push('logout')
  }
</script>

<template>
  <p-icon-button-menu class="app-menu" icon="Bars3Icon">
    <template #default="{ close }">
      <slot name="default" :close="close" />

      <p-overflow-menu-item icon="ArrowRightOnRectangleIcon" label="Logout" @click="logout" />
    </template>
  </p-icon-button-menu>
</template>

<style>
.app-menu {
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
}

.app-menu__submenu {
  margin-left: 1px;
}
</style>
<script lang="ts" setup>
  import { useBoolean } from '@prefecthq/vue-compositions'
  import SeasonSelectionModal from '@/components/SeasonSelectionModal.vue'

  const { value, toggle } = useBoolean()
</script>

<template>
  <div class="menu-header">
    <p-icon class="menu-header__icon" icon="LifebuoyIcon" />
    <p-button primary small @click.stop="toggle">
      Select Season
    </p-button>
    <SeasonSelectionModal v-model:isOpen="value" />
  </div>
</template>

<style>
.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-header__icon {
  height: 50px;
  width: 50px;
}
</style>
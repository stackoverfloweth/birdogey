<script lang="ts" setup>
  import AppMenu from '@/components/AppMenu.vue'
  import { auth } from '@/services'

  const emit = defineEmits<{
    'save': [],
    'cancel': [],
  }>()
</script>

<template>
  <AppMenu class="players-edit-view-menu" icon="Bars3Icon">
    <template #default>
      <template v-if="auth.isAdmin">
        <p-overflow-menu-item icon="ArrowLeftIcon" label="Cancel" @click="emit('cancel')" />
        <p-overflow-menu-item icon="CloudArrowDownIcon" label="Save" @click="emit('save')" />
        <p-overflow-menu-item icon="CheckCircleIcon" label="Complete" @click="emit('save')" />
      </template>
    </template>
  </AppMenu>
</template>
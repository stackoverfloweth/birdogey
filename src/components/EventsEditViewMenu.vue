<script lang="ts" setup>
  import { useBoolean } from '@stackoverfloweth/vue-compositions'
  import AppMenu from '@/components/AppMenu.vue'
  import CardSuggestionModal from '@/components/CardSuggestionModal.vue'
  import PlayerCreateModal from '@/components/PlayerCreateModal.vue'
  import { Player } from '@/models'
  import { auth } from '@/services'

  defineProps<{
    seasonId: string,
    players: Player[],
  }>()

  const emit = defineEmits<{
    'complete': [],
    'save': [],
    'cancel': [],
  }>()

  const { value: showingAddPlayer, setTrue: showAddPlayer } = useBoolean()
  const { value: showingCardSuggestions, setTrue: showCardSuggestions } = useBoolean()
</script>

<template>
  <AppMenu class="events-edit-view-menu" icon="Bars3Icon">
    <template #default>
      <template v-if="auth.isAdmin">
        <p-overflow-menu-item icon="ArrowLeftIcon" label="Cancel" @click="emit('cancel')" />
        <p-overflow-menu-item icon="UserPlusIcon" label="Create New Player" @click="showAddPlayer" />
        <p-overflow-menu-item icon="RectangleStackIcon" label="Suggest Cards" @click="showCardSuggestions" />
        <p-overflow-menu-item icon="CloudArrowDownIcon" label="Save" @click="emit('save')" />
        <p-overflow-menu-item icon="CheckCircleIcon" label="Complete" @click="emit('save')" />
      </template>
    </template>
  </AppMenu>
  <PlayerCreateModal v-model:isOpen="showingAddPlayer" :season-id="seasonId" />
  <CardSuggestionModal v-model:isOpen="showingCardSuggestions" :players="players" />
</template>
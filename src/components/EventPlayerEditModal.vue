<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { EventPlayerRequest } from '@/models'

  const props = defineProps<{
    isOpen: boolean,
    eventPlayer: EventPlayerRequest,
  }>()

  const emit = defineEmits<{
    'update:isOpen': [value: boolean],
    'update:eventPlayer': [value: EventPlayerRequest],
  }>()

  const isOpen = computed({
    get() {
      return props.isOpen
    },
    set(value) {
      emit('update:isOpen', value)
    },
  })

  const eventPlayer = computed({
    get() {
      return props.eventPlayer
    },
    set(value) {
      emit('update:eventPlayer', value)
    },
  })

  const incomingTagId = ref(eventPlayer.value.incomingTagId)
  const outgoingTagId = ref(eventPlayer.value.outgoingTagId)

  function close(): void {
    isOpen.value = false
  }

  function submit(): void {
    eventPlayer.value = {
      ...eventPlayer.value,
      incomingTagId: incomingTagId.value,
      outgoingTagId: outgoingTagId.value,
    }
    close()
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" title="Set Tag #" class="event-player-edit-modal" auto-close>
    <p-form @submit="submit">
      <div class="event-player-edit-modal__form">
        <p-label class="event-player-edit-modal__form-outgoing-tag-id" label="Outgoing Tag #">
          <template #default="{ id }">
            <p-number-input :id="id" v-model="outgoingTagId" :min="0" />
          </template>
        </p-label>

        <p-label class="event-player-edit-modal__form-incoming-tag-id" label="Incoming Tag #">
          <template #default="{ id }">
            <p-number-input :id="id" v-model="incomingTagId" :min="0" />
          </template>
        </p-label>
      </div>

      <template #footer>
        <p-button @click="close">
          Cancel
        </p-button>

        <p-button type="submit" primary>
          Save
        </p-button>
      </template>
    </p-form>
  </p-modal>
</template>

<style>
.event-player-edit-modal__form {
  display: grid;
  column-gap: var(--space-sm);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>

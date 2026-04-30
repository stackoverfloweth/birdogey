<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { useUDiscImport } from '@/composables/useUDiscImport'
  import { pluralize, UserRequest, type EventPlayerRequest, type UserSeason } from '@birdogey/shared'
  import { showToast } from '@prefecthq/prefect-design'
  import { useApi } from '@/composables/useApi'
  import { auth } from '@/services'
  import { useRouteParam } from '@prefecthq/vue-compositions'

  const props = defineProps<{
    players: UserSeason[],
    eventPlayers: EventPlayerRequest[],
  }>()

  const isOpen = defineModel<boolean>('isOpen')
  const { scores, notInBirdogey, unmatchedInEvent, missingMetadata, parseFile, reset: resetImport } = useUDiscImport(props.players, props.eventPlayers)
  const api = useApi()

  const emit = defineEmits<{
    import: [scores: Map<string, number>],
  }>()

  const processing = ref(false)
  const selectedFile = ref<File>()

  const seasonId = useRouteParam('seasonId')
  const course = computed(() => {
    return auth.seasons.find(({ id }) => id === seasonId.value)?.course
  })

  watch(isOpen, (value) => {
    if (!value) {
      reset()
    }
  })

  function handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement
    const [file] = input.files ?? []
    selectedFile.value = file
    processFile(file)
  }

  async function processFile(file: File): Promise<void> {
    processing.value = true

    try {
      const data = await file.arrayBuffer()
      await parseFile(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse file'
      showToast(message, 'error')
    } finally {
      processing.value = false
    }
  }

  async function saveUserMetadata(userId: string, meta: Partial<UserRequest>): Promise<void> {
    await api.users.update(userId, meta)
    missingMetadata.delete(userId)
    showToast('User metadata updated!', 'success')
  }

  function applyScores(): void {
    emit('import', scores)
    isOpen.value = false
  }

  function reset(): void {
    selectedFile.value = undefined
    processing.value = false
    resetImport()
  }
</script>

<template>
  <p-modal
    v-model:show-modal="isOpen"
    title="Import UDisc Scores"
    class="udisc-import-modal"
    auto-close
  >
    <template v-if="selectedFile === undefined">
      <div class="udisc-import-modal__pick">
        <p-link v-if="course?.udiscId" :to="`https://udisc.com/leagues/${course.udiscId}`" target="_blank">
          Open in UDisc
        </p-link>

        <input
          type="file"
          accept=".xlsx"
          class="udisc-import-modal__file-input"
          @change="handleFileChange"
        >
      </div>
    </template>

    <template v-else>
      <div class="udisc-import-modal__review">
        <p class="udisc-import-modal__summary">
          <strong>{{ scores.size }}</strong> {{ pluralize(scores.size, 'score') }} ready to apply.
        </p>

        <template v-if="notInBirdogey.length">
          <p-accordion :sections="['missing', 'unmatched']">
            <template #heading="{ section }">
              <template v-if="section === 'missing'">
                Not found in Birdogey ({{ notInBirdogey.length }})
              </template>
              <template v-else>
                Not found in UDisc import ({{ unmatchedInEvent.length }})
              </template>
            </template>
            <template #content="{ section }">
              <template v-if="section === 'missing'">
                <ul class="udisc-import-modal__list">
                  <li v-for="row in notInBirdogey" :key="row.username || row.name">
                    {{ row.name }}
                  </li>
                </ul>
              </template>
              <template v-else>
                <ul class="udisc-import-modal__list">
                  <li v-for="player in unmatchedInEvent" :key="player.userId">
                    {{ player.userName }}
                  </li>
                </ul>
              </template>
            </template>
          </p-accordion>
        </template>

        <template v-if="missingMetadata.size > 0">
          <div class="udisc-import-modal__section">
            <p class="udisc-import-modal__section-title">
              Set missing profile data (opt in)
            </p>

            <div
              v-for="[userId, meta] in missingMetadata"
              :key="userId"
              class="udisc-import-modal__metadata-row"
            >
              <div class="udisc-import-modal__metadata-info">
                <span class="udisc-import-modal__metadata-name">{{ meta.name }}</span>
                <span class="udisc-import-modal__metadata-detail">
                  <template v-if="meta.udiscId">
                    UDisc ID: <span class="udisc-import-modal__metadata-value"> {{ meta.udiscId }} </span>
                  </template>
                  <template v-if="meta.pdgaNumber">
                    PDGA #: <span class="udisc-import-modal__metadata-value"> {{ meta.pdgaNumber }} </span>
                  </template>
                </span>
              </div>

              <p-button variant="secondary" @click="saveUserMetadata(userId, meta)">
                Update
              </p-button>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #cancel>
      <p-button v-if="selectedFile === undefined" @click="isOpen = false">
        Cancel
      </p-button>

      <p-button v-else @click="reset">
        Back
      </p-button>
    </template>

    <template #actions>
      <template v-if="selectedFile !== undefined">
        <p-button primary :disabled="scores.size === 0" @click="applyScores">
          Apply Scores
        </p-button>
      </template>
    </template>
  </p-modal>
</template>

<style>
.udisc-import-modal__pick {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.udisc-import-modal__error {
  color: var(--p-color-sentiment-negative);
  font-size: var(--p-font-size-sm);
}

.udisc-import-modal__review {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.udisc-import-modal__summary {
  font-size: var(--p-font-size-sm);
}

.udisc-import-modal__section {
  border: 1px solid var(--p-color-divider);
  border-radius: var(--p-radius-default);
  padding: var(--space-sm);
}

.udisc-import-modal__section-summary {
  cursor: pointer;
  font-size: var(--p-font-size-sm);
  font-weight: var(--p-font-weight-medium);
  user-select: none;
}

.udisc-import-modal__section-title {
  font-size: var(--p-font-size-sm);
  font-weight: var(--p-font-weight-medium);
  margin-bottom: var(--space-xs);
}

.udisc-import-modal__list {
  margin: var(--space-xs) 0 0 var(--space-md);
  font-size: var(--p-font-size-sm);
  display: flex;
  flex-direction: column;
  list-style: disc;
  gap: var(--space-xxxs);
}

.udisc-import-modal__metadata-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding: var(--space-xs) 0;
  border-bottom: 1px solid var(--p-color-divider);
}

.udisc-import-modal__metadata-row:last-child {
  border-bottom: none;
}

.udisc-import-modal__metadata-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxxs);
}

.udisc-import-modal__metadata-name {
  font-size: var(--p-font-size-sm);
  font-weight: var(--p-font-weight-medium);
}

.udisc-import-modal__metadata-detail {
  font-size: var(--p-font-size-xs);
  color: var(--p-color-text-subdued);
}

.udisc-import-modal__metadata-value {
  color: var(--p-color-text-link);
}
</style>

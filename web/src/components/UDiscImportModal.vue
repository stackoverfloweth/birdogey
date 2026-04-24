<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { parseUDiscFile, processUDiscImport, type UDiscImportResult, type UDiscMissingMetadata, type UDiscScorePatch } from '@/composables/useUDiscImport'
  import type { EventPlayerRequest, UserSeason } from '@birdogey/shared'

  const props = defineProps<{
    players: UserSeason[],
    eventPlayers: EventPlayerRequest[],
  }>()

  const isOpen = defineModel<boolean>('isOpen')

  const emit = defineEmits<{
    import: [payload: {
      scorePatches: UDiscScorePatch[],
      metadataUpdates: { userId: string, udiscId?: string, pdgaNumber?: string }[],
    }],
  }>()

  type Step = 'pick' | 'review'

  const step = ref<Step>('pick')
  const processing = ref(false)
  const parseError = ref<string>()
  const result = ref<UDiscImportResult>()
  const selectedFile = ref<File>()
  const metadataToApply = ref<string[]>([])

  watch(isOpen, (value) => {
    if (!value) {
      reset()
    }
  })

  function handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement
    selectedFile.value = input.files?.[0]
    parseError.value = undefined
  }

  async function processFile(): Promise<void> {
    if (!selectedFile.value) {
      return
    }

    processing.value = true
    parseError.value = undefined

    try {
      const rows = await parseUDiscFile(selectedFile.value)
      result.value = processUDiscImport(rows, props.players, props.eventPlayers)
      step.value = 'review'
    } catch (err) {
      parseError.value = err instanceof Error ? err.message : 'Failed to parse file'
    } finally {
      processing.value = false
    }
  }

  function toggleMetadata(userId: string): void {
    if (metadataToApply.value.includes(userId)) {
      metadataToApply.value = metadataToApply.value.filter((id) => id !== userId)
    } else {
      metadataToApply.value = [...metadataToApply.value, userId]
    }
  }

  function metadataLabel(meta: UDiscMissingMetadata): string {
    const parts: string[] = []
    if (meta.suggestedUdiscId) {
      parts.push(`UDisc ID: ${meta.suggestedUdiscId}`)
    }
    if (meta.suggestedPdgaNumber) {
      parts.push(`PDGA #: ${meta.suggestedPdgaNumber}`)
    }
    return parts.join(' · ')
  }

  function applyScores(): void {
    if (!result.value) {
      return
    }

    const metadataUpdates = result.value.missingMetadata
      .filter((meta) => metadataToApply.value.includes(meta.userId))
      .map((meta) => ({
        userId: meta.userId,
        ...(meta.suggestedUdiscId !== undefined ? { udiscId: meta.suggestedUdiscId } : {}),
        ...(meta.suggestedPdgaNumber !== undefined ? { pdgaNumber: meta.suggestedPdgaNumber } : {}),
      }))

    emit('import', { scorePatches: result.value.scorePatches, metadataUpdates })
    isOpen.value = false
  }

  function reset(): void {
    step.value = 'pick'
    selectedFile.value = undefined
    result.value = undefined
    parseError.value = undefined
    metadataToApply.value = []
    processing.value = false
  }
</script>

<template>
  <p-modal
    v-model:show-modal="isOpen"
    title="Import UDisc Scores"
    class="udisc-import-modal"
    auto-close
  >
    <template v-if="step === 'pick'">
      <div class="udisc-import-modal__pick">
        <p class="udisc-import-modal__hint">
          Upload the UDisc "Event Results" export (.xlsx) to apply scores.
        </p>

        <input
          type="file"
          accept=".xlsx"
          class="udisc-import-modal__file-input"
          @change="handleFileChange"
        >

        <p v-if="parseError" class="udisc-import-modal__error">
          {{ parseError }}
        </p>
      </div>
    </template>

    <template v-else-if="step === 'review' && result">
      <div class="udisc-import-modal__review">
        <p class="udisc-import-modal__summary">
          <strong>{{ result.scorePatches.length }}</strong> score{{ result.scorePatches.length === 1 ? '' : 's' }} ready to apply.
        </p>

        <template v-if="result.notInBirdogey.length">
          <details class="udisc-import-modal__section">
            <summary class="udisc-import-modal__section-summary">
              Not found in Birdogey ({{ result.notInBirdogey.length }})
            </summary>

            <ul class="udisc-import-modal__list">
              <li v-for="row in result.notInBirdogey" :key="row.username || row.name">
                {{ row.name }}
                <template v-if="row.username">
                  · {{ row.username }}
                </template>
              </li>
            </ul>
          </details>
        </template>

        <template v-if="result.unmatchedInEvent.length">
          <details class="udisc-import-modal__section">
            <summary class="udisc-import-modal__section-summary">
              No export row found ({{ result.unmatchedInEvent.length }})
            </summary>

            <ul class="udisc-import-modal__list">
              <li v-for="player in result.unmatchedInEvent" :key="player.userId">
                {{ player.userName }}
              </li>
            </ul>
          </details>
        </template>

        <template v-if="result.missingMetadata.length">
          <div class="udisc-import-modal__section">
            <p class="udisc-import-modal__section-title">
              Set missing profile data (opt in)
            </p>

            <div
              v-for="meta in result.missingMetadata"
              :key="meta.userId"
              class="udisc-import-modal__metadata-row"
            >
              <div class="udisc-import-modal__metadata-info">
                <span class="udisc-import-modal__metadata-name">{{ meta.userName }}</span>
                <span class="udisc-import-modal__metadata-detail">{{ metadataLabel(meta) }}</span>
              </div>

              <p-toggle
                :model-value="metadataToApply.includes(meta.userId)"
                @update:model-value="toggleMetadata(meta.userId)"
              />
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #cancel>
      <p-button v-if="step === 'pick'" @click="isOpen = false">
        Cancel
      </p-button>

      <p-button v-else @click="reset">
        Back
      </p-button>
    </template>

    <template #actions>
      <template v-if="step === 'pick'">
        <p-button primary :loading="processing" :disabled="!selectedFile" @click="processFile">
          Process
        </p-button>
      </template>

      <template v-else>
        <p-button primary :disabled="result?.scorePatches.length === 0" @click="applyScores">
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

.udisc-import-modal__hint {
  color: var(--p-color-text-subdued);
  font-size: var(--p-font-size-sm);
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
</style>

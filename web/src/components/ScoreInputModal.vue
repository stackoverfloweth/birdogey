<script lang="ts" setup>
  const modelValue = defineModel<number | null>({ required: true })
  const isOpen = defineModel<boolean>('isOpen', { required: true })

  const count = 15
  const negativeValues = new Array(count).fill(null)
    .map((_, index) => -count + index)
  const positiveValues = new Array(count).fill(null)
    .map((_, index) => index + 1)

  function setScore(value: number): void {
    modelValue.value = value
    isOpen.value = false
  }
</script>

<template>
  <p-modal v-model:show-modal="isOpen" title="Set Score" class="score-input-modal" auto-close>
    <div class="score-input-modal__options">
      <template v-for="value in negativeValues" :key="value">
        <p-button class="score-input-modal__option score-input-modal__option--negative" @click="setScore(value)">
          {{ value }}
        </p-button>
      </template>

      <p-button class="score-input-modal__option score-input-modal__option--zero" @click="setScore(0)">
        E
      </p-button>

      <template v-for="value in positiveValues" :key="value">
        <p-button class="score-input-modal__option score-input-modal__option--positive" @click="setScore(value)">
          +{{ value }}
        </p-button>
      </template>
    </div>
  </p-modal>
</template>

<style>
.score-input-modal__options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-sm);
  width: 100%;
}

.score-input-modal__option--positive {
  color: var(--p-color-message-warning-text);
  background-color: var(--p-color-message-warning-bg);
  border-radius: 4px;
}

.score-input-modal__option--zero {
  justify-self: stretch;
  grid-column: 1 / -1;
}

.score-input-modal__option--negative {
  color: var(--p-color-bg-1);
  background-color: var(--p-color-button-primary-bg);
  border-radius: 4px;
}
</style>

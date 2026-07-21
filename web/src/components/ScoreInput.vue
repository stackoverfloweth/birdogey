<script lang="ts" setup>
  import { computed, useAttrs } from 'vue'
  import ScoreInputModal from '@/components/ScoreInputModal.vue'
  import { useBoolean } from '@prefecthq/vue-compositions'

  const props = defineProps<{
    disabled?: boolean,
    modelValue: number | null | undefined,
    dnf?: boolean,
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: number | null],
    'update:dnf': [value: boolean],
  }>()

  defineOptions({
    inheritAttrs: false,
  })

  const modelValue = computed({
    get() {
      return props.modelValue ?? null
    },
    set(value) {
      emit('update:modelValue', value)
      if (props.dnf && value !== null) {
        emit('update:dnf', false)
      }
    },
  })

  const attrs = useAttrs()
  const { value: scoringModalIsOpen, setTrue: openScoringModal } = useBoolean()

  const classes = computed(() => ({
    'score-input__formatted--disabled': props.disabled,
    'score-input__formatted--positive': !props.dnf && modelValue.value && modelValue.value > 0,
    'score-input__formatted--negative': !props.dnf && modelValue.value && modelValue.value < 0,
    'score-input__formatted--dnf': props.dnf,
  }))

  const formattedValue = computed(() => {
    if (props.dnf) {
      return 'DNF'
    }

    if (modelValue.value === 0) {
      return 'E'
    }

    if (modelValue.value && modelValue.value > 0) {
      return `+${modelValue.value}`
    }

    return modelValue.value?.toLocaleString()
  })

  function handleDnf(): void {
    emit('update:modelValue', null)
    emit('update:dnf', true)
  }
</script>

<template>
  <div class="score-input">
    <p-stepper v-bind="attrs" v-model="modelValue" :disabled="disabled" />
    <div class="score-input__formatted" :class="classes" @click="openScoringModal">
      <span class="score-input__formatted-text">{{ formattedValue }}</span>
    </div>

    <ScoreInputModal v-model="modelValue" v-model:is-open="scoringModalIsOpen" @dnf="handleDnf" />
  </div>
</template>

<style>
.score-input {
  position: relative;
  min-width: 116px;
  touch-action: manipulation;
}

.score-input__formatted {
  position: absolute;
  left: calc(50% - 17px);
  top: calc(50% - 17px);
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.score-input__formatted--positive {
  color: var(--p-color-message-warning-text);
  background-color: var(--p-color-message-warning-bg);
  border-radius: 4px;
}

.score-input__formatted--negative {
  color: var(--p-color-bg-1);
  background-color: var(--p-color-button-primary-bg);
  border-radius: 100%;
}

.score-input__formatted--dnf {
  color: var(--p-color-bg-1);
  background-color: var(--p-color-sentiment-negative);
  transform: rotate(45deg);
  font-size: 11px;
  font-weight: bold;
}

.score-input__formatted--dnf .score-input__formatted-text {
  transform: rotate(-45deg);
}

.score-input__formatted--disabled {
  cursor: not-allowed;
  opacity: .5;
}

.score-input .p-number-input__control {
  opacity: 0;
}
</style>

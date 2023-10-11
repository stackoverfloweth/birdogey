<script lang="ts" setup>
  import { computed, useAttrs } from 'vue'

  const props = defineProps<{
    modelValue: number | null | undefined,
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: number | null],
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
    },
  })

  const attrs = useAttrs()

  const classes = computed(() => ({
    'score-input__formatted--positive': modelValue.value && modelValue.value > 0,
    'score-input__formatted--negative': modelValue.value && modelValue.value < 0,
  }))

  const formattedValue = computed(() => {
    if (modelValue.value === 0) {
      return 'E'
    }

    if (modelValue.value && modelValue.value > 0) {
      return `+${modelValue.value}`
    }

    return modelValue.value?.toLocaleString()
  })
</script>

<template>
  <div class="score-input">
    <p-stepper v-bind="attrs" v-model="modelValue" />
    <div class="score-input__formatted" :class="classes">
      {{ formattedValue }}
    </div>
  </div>
</template>

<style>
.score-input {
  position: relative;
  min-width: 116px;
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
}

.score-input__formatted--positive {
  background-color:chocolate;
  border-radius: 4px;
}

.score-input__formatted--negative {
  background-color: var(--p-color-button-primary-bg);
  border-radius: 100%;
}

.score-input .p-number-input__control {
  opacity: 0;
}
</style>
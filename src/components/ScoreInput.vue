<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    modelValue: number | null | undefined,
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: number | null],
  }>()

  const modelValue = computed({
    get() {
      return props.modelValue ?? null
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })

  const classes = computed(() => ({
    'score-input__control--positive': modelValue.value && modelValue.value > 0,
    'score-input__control--negative': modelValue.value && modelValue.value < 0,
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

  function decrement(): void {
    if (modelValue.value === null) {
      modelValue.value = 0
    } else {
      modelValue.value -= 1
    }
  }

  function increment(): void {
    if (modelValue.value === null) {
      modelValue.value = 0
    } else {
      modelValue.value += 1
    }
  }
</script>

<template>
  <p-base-input class="score-input">
    <template v-for="(index, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope" />
    </template>
    <template #prepend>
      <p-button icon="MinusIcon" @click="decrement" />
    </template>
    <template #control>
      <div :class="classes" class="score-input__control">
        {{ formattedValue }}
      </div>
    </template>
    <template #append>
      <p-button icon="PlusIcon" @click="increment" />
    </template>
  </p-base-input>
</template>

<style>
.score-input {
  width: max-content;
  display: flex;
  border: 0;
  background: unset;
  justify-content: space-between;
  gap: var(--space-md);
}

.score-input__control {
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.score-input__control--positive {
  background-color:chocolate;
  border-radius: 4px;
}

.score-input__control--negative {
  background-color: var(--p-color-button-primary-bg);
  border-radius: 100%;
}

.score-input.p-base-input--failed .p-button {
  border-color: var(--p-color-input-border-invalid);
}
</style>
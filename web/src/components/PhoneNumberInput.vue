<script lang="ts" setup>
  import { isNumber, normalizePhoneNumber } from '@birdogey/shared'
  import { useBoolean } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'

  const modelValue = defineModel<string | null | undefined>({ required: true })

  const { value: hasFocus, setFalse: handleBlur, setTrue: handleFocus } = useBoolean()
  const displayValue = computed(() => (hasFocus.value ? modelValue.value : formattedValue.value))

  const formattedValue = computed(() => {
    if (parsedValue.value === null) {
      return modelValue.value
    }

    return normalizePhoneNumber(parsedValue.value.toString())
  })

  const parsedValue = computed({
    get() {
      if (typeof modelValue.value !== 'string') {
        return null
      }

      const valueWithoutGrouping = modelValue.value.replace(/,/g, '')
      if (!isNumber(valueWithoutGrouping)) {
        return null
      }

      return parseFloat(modelValue.value)
    },
    set(value) {
      if (typeof value !== 'number') {
        return null
      }

      modelValue.value = value.toString()
    },
  })

  function handleInput(value: string | null): void {
    modelValue.value = value
  }
  </script>

<template>
  <p-text-input
    :model-value="displayValue"
    type="tel"
    placeholder="(555) 555-5555"
    @update:model-value="handleInput"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

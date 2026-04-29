import { ComponentProps, ReactNode, useMemo } from 'react'
import { TextInput } from '@/components/TextInput'

type NumericInputProps = Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText' | 'keyboardType'> & {
  value: number | undefined,
  onChangeText: (value: number | undefined) => void,
  keyboardType?: 'number-pad' | 'decimal-pad',
}

export function NumericInput({ value, onChangeText, keyboardType = 'decimal-pad', ...props }: NumericInputProps): ReactNode {
  const textValue = useMemo(() => {
    return value?.toString() ?? ''
  }, [value])

  function handleChange(next: string): void {
    const parsed = next === '' ? undefined : Number(next)
    const current = parsed === undefined || Number.isNaN(parsed) ? undefined : parsed
    if (value !== current) {
      onChangeText(current)
    }
  }

  return (
    <TextInput
      {...props}
      keyboardType={keyboardType}
      value={textValue}
      onChangeText={handleChange}
    />
  )
}

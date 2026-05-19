import { ComponentProps, ReactNode, useState } from 'react'
import { TextInput } from '@/components/TextInput'

type NumericInputProps = Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText' | 'keyboardType'> & {
  value: number | undefined,
  onChangeText: (value: number | undefined) => void,
  keyboardType?: 'number-pad' | 'decimal-pad',
}

function parseNumeric(text: string): number | undefined {
  if (text === '') return undefined
  const parsed = Number(text)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function NumericInput({ value, onChangeText, keyboardType = 'decimal-pad', ...props }: NumericInputProps): ReactNode {
  // Local text is the source of truth so we can hold "" while the user clears the field.
  // react-hook-form's Controller bounces undefined values back to the defaultValue, which
  // would otherwise re-fill the input the instant the user backspaces it empty.
  const [text, setText] = useState(value?.toString() ?? '')

  function handleChange(next: string): void {
    setText(next)
    onChangeText(parseNumeric(next))
  }

  return (
    <TextInput
      {...props}
      keyboardType={keyboardType}
      value={text}
      onChangeText={handleChange}
    />
  )
}

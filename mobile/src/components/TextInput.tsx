import { useState } from 'react'
import { StyleSheet, TextInput as RNTextInput, View, TextInputProps as RNTextInputProps } from 'react-native'
import type { ReactNode } from 'react'
import { colors } from '@/theme/colors'

type TextInputProps = RNTextInputProps & {
  icon?: ReactNode,
}

export function TextInput({ icon, style, onFocus, onBlur, ...props }: TextInputProps): ReactNode {
  const [focused, setFocused] = useState(false)

  return (
    <View style={[styles.container, focused && styles.containerFocused, style]}>
      {icon}
      <RNTextInput
        {...props}
        placeholderTextColor={colors.on_surface_variant}
        style={styles.input}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface_container,
    borderRadius: 32,
    paddingHorizontal: 20,
    gap: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerFocused: {
    backgroundColor: colors.surface_container_lowest,
    borderColor: `${colors.primary_500}33`,
  },
  input: {
    flex: 1,
    paddingVertical: 20,
    color: colors.on_surface,
    fontSize: 16,
  },
})

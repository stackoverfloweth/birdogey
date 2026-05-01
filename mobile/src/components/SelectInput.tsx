import { ReactNode, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '@/theme/colors'
import { Picker, PickerProps } from '@react-native-picker/picker'
import { ItemValue } from '@react-native-picker/picker/typings/Picker'

export type SelectInputProps<T extends ItemValue> = PickerProps<T> & {
  icon?: ReactNode,
  options: { label: string, value: T }[],
  focused?: boolean,
}

export function SelectInput<T extends ItemValue>({ icon, style, focused = false, onFocus, onBlur, ...props }: SelectInputProps<T>): ReactNode {
  return (
    <View style={[styles.container, focused && styles.containerFocused, style]}>
      {icon}
      <Picker
        {...props}
        style={styles.input}
      >
        {props.options.map((option) => (
          <Picker.Item key={option.label} label={option.label} value={option.value} />
        ))}
      </Picker>
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

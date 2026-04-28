import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '@/theme/colors'
import { Picker, PickerProps } from '@react-native-picker/picker'

type SelectInputProps = PickerProps & {
  icon?: ReactNode,
  options: { label: string, value: string }[],
}

export function SelectInput({ icon, style, onFocus, onBlur, ...props }: SelectInputProps): ReactNode {
  return (
    <View style={[styles.container, style]}>
      {icon}
      <Picker
        {...props}
        style={styles.input}
      >
        {props.options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface_container_lowest,
    borderColor: `${colors.primary_500}33`,
    borderRadius: 32,
    paddingHorizontal: 20,
    gap: 10,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 20,
    color: colors.on_surface,
    fontSize: 16,
  },
})

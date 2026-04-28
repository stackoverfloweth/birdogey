import { formStyles } from '@/theme/forms'
import { View, Text } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo } from 'react'
import { SelectInput, SelectInputProps } from '@/components/SelectInput'

type EventSeasonSelectProps = Omit<SelectInputProps<string>, 'options' | 'selectedValue' | 'onValueChange'> & {
  value: string,
  onChange: (value: string) => void,
}

export function EventSeasonSelect({ value, onChange, ...props }: EventSeasonSelectProps): React.ReactNode {
  const auth = useAuth()

  const seasonOptions = useMemo(() => {
    const seasons = auth.user?.seasons.map((season) => ({ label: `${season.course.name} - ${season.name}`, value: season.id })) ?? []
    return [{ label: 'Select a season…', value: '' }, ...seasons]
  }, [auth.user])

  return (
    <View style={formStyles.formGroup}>
      <Text style={formStyles.label}>Season</Text>
      <SelectInput
        {...props}
        options={seasonOptions}
        onValueChange={(itemValue) => onChange(itemValue)}
        selectedValue={value}
      />
    </View>
  )
}

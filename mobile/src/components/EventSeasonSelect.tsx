import { formStyles } from '@/theme/forms'
import { View, Text } from 'react-native'
import { useMemo } from 'react'
import { SelectInput, SelectInputProps } from '@/components/SelectInput'
import { useAuthSeasons } from '@/hooks/useAuthSeasons'

type EventSeasonSelectProps = Omit<SelectInputProps<string>, 'options' | 'selectedValue' | 'onValueChange'> & {
  value: string,
  onChange: (value: string) => void,
}

export function EventSeasonSelect({ value, onChange, ...props }: EventSeasonSelectProps): React.ReactNode {
  const seasons = useAuthSeasons()

  const seasonOptions = useMemo(() => {
    const options = seasons.map((season) => ({ label: `${season.course.name} - ${season.name}`, value: season.id }))
    return [{ label: 'Select a season…', value: '' }, ...options]
  }, [seasons])

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

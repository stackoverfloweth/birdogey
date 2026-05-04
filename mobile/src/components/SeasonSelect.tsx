import { useMemo } from 'react'
import { SelectInput, SelectInputProps } from '@/components/SelectInput'
import { Season } from '@birdogey/shared'

type SeasonSelectProps = Omit<SelectInputProps<string>, 'options' | 'selectedValue' | 'onValueChange'> & {
  seasons: Season[],
  value: string,
  onChange: (value: string) => void,
}

export function SeasonSelect({ seasons, value, onChange, ...props }: SeasonSelectProps): React.ReactNode {
  const seasonOptions = useMemo(() => {
    const options = seasons.map((season) => ({ label: `${season.course.name} - ${season.name}`, value: season.id }))
    return [{ label: 'Select a season…', value: '' }, ...options]
  }, [seasons])

  return (
    <SelectInput
      {...props}
      options={seasonOptions}
      focused={value === ''}
      onValueChange={(itemValue) => onChange(itemValue)}
      selectedValue={value}
    />
  )
}

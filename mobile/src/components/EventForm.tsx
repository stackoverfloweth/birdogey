import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View, Text, Pressable } from 'react-native'
import { TextInput } from '@/components/TextInput'
import { eventSchema, EventSchema } from '@/schemas/eventSchema'
import { SymbolView } from 'expo-symbols'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo } from 'react'
import { SelectInput } from '@/components/SelectInput'

export function EventForm(): React.ReactNode {
  const auth = useAuth()
  const today = format(new Date(), 'MMMM do')

  const { control, handleSubmit, formState: { errors, isValid, isLoading, isSubmitted } } = useForm<EventSchema>({
    mode: 'onChange',
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: today,
    },
  })

  const seasonOptions = useMemo(() => {
    return auth.user?.seasons.map((season) => ({ label: `${season.course.name} - ${season.name}`, value: season.id })) ?? []
  }, [auth.user])

  async function onSubmit(data: EventSchema): Promise<void> {
    console.log(data)
  }

  return (
    <View style={formStyles.form}>
      {seasonOptions.length > 1 && (
        <View style={formStyles.formGroup}>
          <Text style={formStyles.label}>Season</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <SelectInput
                onValueChange={onChange}
                onBlur={onBlur}
                options={seasonOptions}
                selectedValue={value}
                style={formStyles.input}
              />
            )}
            name="seasonId"
          />
          {isSubmitted && errors.seasonId && <Text style={formStyles.errorText}>{errors.seasonId.message}</Text>}
        </View>
      )}

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Event Name</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={formStyles.input}
            />
          )}
          name="name"
        />
        {isSubmitted && errors.name && <Text style={formStyles.errorText}>{errors.name.message}</Text>}
      </View>

      <Pressable
        disabled={isLoading}
        style={[formStyles.button, !isValid && formStyles.buttonDisabled]}
        onPress={() => void handleSubmit(onSubmit)()}
      >
        <Text style={formStyles.buttonText}>Create Event</Text>
        <SymbolView name="arrow.right" size={20} tintColor="#fff" weight="bold" />
      </Pressable>
    </View>
  )
}

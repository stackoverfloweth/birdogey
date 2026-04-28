import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View, Text, Pressable } from 'react-native'
import { TextInput } from '@/components/TextInput'
import { SymbolView } from 'expo-symbols'
import { format } from 'date-fns'
import { useMemo } from 'react'
import { router } from 'expo-router'
import { calculateEventAcePotIfNoWinners, calculateEventCtpPotIfNoWinners, Event, eventSchema, EventSchema, EventSchemaInput } from '@birdogey/shared'
import { colors } from '@/theme/colors'

export type EventFormProps = {
  lastEvent: Event | undefined,
  onSubmit: (data: EventSchema) => void,
}

export function EventForm({ lastEvent, onSubmit }: EventFormProps): React.ReactNode {
  const today = format(new Date(), 'MMMM do')

  const previousEventBalance = useMemo(() => {
    return {
      ctpPerPlayer: lastEvent?.ctpPerPlayer ? lastEvent.ctpPerPlayer / 100 : undefined,
      acePerPlayer: lastEvent?.acePerPlayer ? lastEvent.acePerPlayer / 100 : undefined,
      ctpStartingBalance: lastEvent ? calculateEventCtpPotIfNoWinners(lastEvent) / 100 : undefined,
      aceStartingBalance: lastEvent ? calculateEventAcePotIfNoWinners(lastEvent) / 100 : undefined,
      ctpHole: lastEvent?.ctpHole,
    }
  }, [lastEvent])

  const { control, handleSubmit, formState: { errors, isLoading, isSubmitted } } = useForm<EventSchemaInput, any, EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: today,
      ctpStartingBalance: previousEventBalance.ctpStartingBalance?.toString(),
      aceStartingBalance: previousEventBalance.aceStartingBalance?.toString(),
      ctpPerPlayer: previousEventBalance.ctpPerPlayer?.toString(),
      acePerPlayer: previousEventBalance.acePerPlayer?.toString(),
      ctpHole: previousEventBalance.ctpHole?.toString(),
    },
  })

  console.log({ errors })

  return (
    <>
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

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Notes</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={formStyles.input}
              multiline
              numberOfLines={4}
            />
          )}
          name="notes"
        />
        {isSubmitted && errors.notes && <Text style={formStyles.errorText}>{errors.notes.message}</Text>}
      </View>

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>CTP Per Player</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={formStyles.input}
              keyboardType="number-pad"
              icon={<SymbolView name="dollarsign" size={20} tintColor={colors.primary} />}
            />
          )}
          name="ctpPerPlayer"
        />
        {isSubmitted && errors.ctpPerPlayer && <Text style={formStyles.errorText}>{errors.ctpPerPlayer.message}</Text>}
      </View>

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>CTP Starting Balance</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={formStyles.input}
              keyboardType="number-pad"
              icon={<SymbolView name="dollarsign" size={20} tintColor={colors.primary} />}
            />
          )}
          name="ctpStartingBalance"
        />
        {isSubmitted && errors.ctpStartingBalance && <Text style={formStyles.errorText}>{errors.ctpStartingBalance.message}</Text>}
      </View>

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>CTP Hole</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={formStyles.input}
              keyboardType="number-pad"
            />
          )}
          name="ctpHole"
        />
        {isSubmitted && errors.ctpHole && <Text style={formStyles.errorText}>{errors.ctpHole.message}</Text>}
      </View>

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>ACE Per Player</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={formStyles.input}
              keyboardType="number-pad"
              icon={<SymbolView name="dollarsign" size={20} tintColor={colors.primary} />}
            />
          )}
          name="acePerPlayer"
        />
        {isSubmitted && errors.acePerPlayer && <Text style={formStyles.errorText}>{errors.acePerPlayer.message}</Text>}
      </View>

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>ACE Starting Balance</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={formStyles.input}
              keyboardType="number-pad"
              icon={<SymbolView name="dollarsign" size={20} tintColor={colors.primary} />}
            />
          )}
          name="aceStartingBalance"
        />
        {isSubmitted && errors.aceStartingBalance && <Text style={formStyles.errorText}>{errors.aceStartingBalance.message}</Text>}
      </View>

      <Pressable
        disabled={isLoading}
        style={formStyles.button}
        onPress={() => void handleSubmit(onSubmit)()}
      >
        <Text style={formStyles.buttonText}>Create Event</Text>
        <SymbolView name="arrow.right" size={20} tintColor="#fff" weight="bold" />
      </Pressable>

      <Pressable
        style={formStyles.secondaryButton}
        onPress={() => router.back()}
      >
        <Text style={formStyles.secondaryButtonText}>Cancel</Text>
      </Pressable>
    </>
  )
}

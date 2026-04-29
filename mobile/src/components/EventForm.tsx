import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View, Text, Pressable } from 'react-native'
import { TextInput } from '@/components/TextInput'
import { NumericInput } from '@/components/NumericInput'
import { SymbolView } from 'expo-symbols'
import { eventSchema, EventSchema, EventSchemaInput } from '@birdogey/shared'
import { colors } from '@/theme/colors'

export type EventFormProps = {
  submitText?: string,
  submitIcon?: React.ReactNode,
  initialValues: EventSchemaInput | undefined,
  onSubmit: (data: EventSchema) => void,
  onCancel?: () => void,
}

export function EventForm({ submitText, submitIcon, initialValues, onSubmit, onCancel }: EventFormProps): React.ReactNode {
  const { control, handleSubmit, formState: { errors, isLoading, isSubmitted } } = useForm<EventSchemaInput, any, EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialValues,
  })

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
            <NumericInput
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
            <NumericInput
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
            <NumericInput
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
            <NumericInput
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
            <NumericInput
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
        <Text style={formStyles.buttonText}>{submitText}</Text>
        {submitIcon}
      </Pressable>

      {onCancel && (
        <Pressable
          style={formStyles.secondaryButton}
          onPress={onCancel}
        >
          <Text style={formStyles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      )}
    </>
  )
}

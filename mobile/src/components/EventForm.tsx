import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormState, useForm } from 'react-hook-form'
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
  renderActions?: (formState: FormState<EventSchemaInput>, handleSubmit: () => Promise<void>) => React.ReactNode,
  onSubmit: (data: EventSchema) => void,
  onCancel?: () => void,
}

export function EventForm({ submitText, submitIcon, initialValues, renderActions, onSubmit, onCancel }: EventFormProps): React.ReactNode {
  const { control, handleSubmit, formState } = useForm<EventSchemaInput, any, EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialValues,
  })

  function actions(): React.ReactNode {
    if (renderActions) {
      return renderActions(formState, () => handleSubmit(onSubmit)())
    }

    return (
      <Pressable
        disabled={formState.isLoading}
        style={formStyles.button}
        onPress={() => void handleSubmit(onSubmit)()}
      >
        <Text style={formStyles.buttonText}>{submitText}</Text>
        {submitIcon}
      </Pressable>
    )
  }

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
        {formState.errors.name && <Text style={formStyles.errorText}>{formState.errors.name.message}</Text>}
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
        {formState.errors.notes && <Text style={formStyles.errorText}>{formState.errors.notes.message}</Text>}
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
        {formState.errors.ctpPerPlayer && <Text style={formStyles.errorText}>{formState.errors.ctpPerPlayer.message}</Text>}
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
        {formState.errors.ctpStartingBalance && <Text style={formStyles.errorText}>{formState.errors.ctpStartingBalance.message}</Text>}
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
        {formState.errors.ctpHole && <Text style={formStyles.errorText}>{formState.errors.ctpHole.message}</Text>}
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
        {formState.errors.acePerPlayer && <Text style={formStyles.errorText}>{formState.errors.acePerPlayer.message}</Text>}
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
        {formState.errors.aceStartingBalance && <Text style={formStyles.errorText}>{formState.errors.aceStartingBalance.message}</Text>}
      </View>

      {actions()}

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

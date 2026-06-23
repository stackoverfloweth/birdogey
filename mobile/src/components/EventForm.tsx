import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { TextInput } from '@/components/TextInput'
import { NumericInput } from '@/components/NumericInput'
import { SymbolView } from 'expo-symbols'
import { eventSchema, EventSchema, EventSchemaInput } from '@birdogey/shared'
import { colors } from '@/theme/colors'
import DateTimePicker from '@react-native-community/datetimepicker'

export type EventFormProps = {
  submitText?: string,
  submitIcon?: React.ReactNode,
  initialValues?: EventSchemaInput | undefined,
  readOnly?: boolean,
  onSubmit: (data: EventSchema) => void,
  onCancel?: () => void,
  onDelete?: () => void,
}

export function EventForm({ submitText, submitIcon, initialValues, readOnly, onSubmit, onCancel, onDelete }: EventFormProps): React.ReactNode {
  const { control, handleSubmit, formState: { errors, isLoading } } = useForm<EventSchemaInput, any, EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialValues,
  })

  return (
    <View style={formStyles.form}>
      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Date</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              value={value}
              mode="datetime"
              display="default"
              minuteInterval={5}
              disabled={readOnly}
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  onChange(selectedDate)
                }
              }}
              accentColor={colors.primary_500}
            />
          )}
          name="start"
        />
        {errors.start && <Text style={formStyles.errorText}>{errors.start.message}</Text>}
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
              multiline
              numberOfLines={4}
              editable={!readOnly}
            />
          )}
          name="notes"
        />
        {errors.notes && <Text style={formStyles.errorText}>{errors.notes.message}</Text>}
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
              keyboardType="number-pad"
              editable={!readOnly}
              icon={<SymbolView name="dollarsign" size={20} tintColor={colors.primary} />}
            />
          )}
          name="ctpPerPlayer"
        />
        {errors.ctpPerPlayer && <Text style={formStyles.errorText}>{errors.ctpPerPlayer.message}</Text>}
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
              keyboardType="number-pad"
              editable={!readOnly}
              icon={<SymbolView name="dollarsign" size={20} tintColor={colors.primary} />}
            />
          )}
          name="ctpStartingBalance"
        />
        {errors.ctpStartingBalance && <Text style={formStyles.errorText}>{errors.ctpStartingBalance.message}</Text>}
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
              keyboardType="number-pad"
              editable={!readOnly}
            />
          )}
          name="ctpHole"
        />
        {errors.ctpHole && <Text style={formStyles.errorText}>{errors.ctpHole.message}</Text>}
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
              keyboardType="number-pad"
              editable={!readOnly}
              icon={<SymbolView name="dollarsign" size={20} tintColor={colors.primary} />}
            />
          )}
          name="acePerPlayer"
        />
        {errors.acePerPlayer && <Text style={formStyles.errorText}>{errors.acePerPlayer.message}</Text>}
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
              keyboardType="number-pad"
              editable={!readOnly}
              icon={<SymbolView name="dollarsign" size={20} tintColor={colors.primary} />}
            />
          )}
          name="aceStartingBalance"
        />
        {errors.aceStartingBalance && <Text style={formStyles.errorText}>{errors.aceStartingBalance.message}</Text>}
      </View>

      {!readOnly && (
        <View style={formStyles.actions}>
          <Pressable
            disabled={isLoading}
            style={formStyles.button}
            onPress={() => void handleSubmit(onSubmit)()}
          >
            {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : submitIcon}
            <Text style={formStyles.buttonText}>{submitText}</Text>
          </Pressable>

          {onCancel && (
            <Pressable
              style={formStyles.secondaryButton}
              onPress={onCancel}
            >
              <Text style={formStyles.secondaryButtonText}>Cancel</Text>
            </Pressable>
          )}

          {onDelete && (
            <Pressable
              style={formStyles.secondaryButton}
              onPress={onDelete}
            >
              <SymbolView name="trash" size={20} tintColor={colors.error} weight="bold" />
              <Text style={[formStyles.secondaryButtonText, { color: colors.error }]}>Delete</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  )
}

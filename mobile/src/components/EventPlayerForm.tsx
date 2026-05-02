import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View, Text, Pressable } from 'react-native'
import { eventPlayerSchema, EventPlayerSchema, EventPlayerSchemaInput } from '@birdogey/shared'
import { NumericInput } from './NumericInput'

export type EventPlayerFormProps = {
  submitText?: string,
  submitIcon?: React.ReactNode,
  initialValues?: EventPlayerSchemaInput | undefined,
  onSubmit: (data: EventPlayerSchema) => void,
}

export function EventPlayerForm({ submitText, submitIcon, initialValues, onSubmit }: EventPlayerFormProps): React.ReactNode {
  const { control, handleSubmit, formState: { errors, isLoading } } = useForm<EventPlayerSchemaInput, any, EventPlayerSchema>({
    resolver: zodResolver(eventPlayerSchema),
    defaultValues: initialValues,
  })

  return (
    <>
      <View style={formStyles.form}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 18 }}>
          <View style={[formStyles.formGroup, { flex: 1 }]}>
            <Text style={formStyles.label}>Incoming Tag</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <NumericInput
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  style={[formStyles.input]}
                />
              )}
              name="incomingTagId"
            />
            {errors.incomingTagId && <Text style={formStyles.errorText}>{errors.incomingTagId.message}</Text>}
          </View>

          <View style={[formStyles.formGroup, { flex: 1 }]}>
            <Text style={formStyles.label}>Outgoing Tag</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <NumericInput
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  style={[formStyles.input]}
                />
              )}
              name="outgoingTagId"
            />
            {errors.outgoingTagId && <Text style={formStyles.errorText}>{errors.outgoingTagId.message}</Text>}
          </View>
        </View>
      </View>

      <View style={formStyles.form}>
        <Pressable
          disabled={isLoading}
          style={formStyles.button}
          onPress={() => void handleSubmit(onSubmit)()}
        >
          <Text style={formStyles.buttonText}>{submitText}</Text>
          {submitIcon}
        </Pressable>
      </View>
    </>
  )
}

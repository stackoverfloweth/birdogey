import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormState, useForm } from 'react-hook-form'
import { View, Text, Pressable } from 'react-native'
import { eventPlayerSchema, EventPlayerSchema, EventPlayerSchemaInput } from '@birdogey/shared'
import { NumericInput } from './NumericInput'

export type EventPlayerFormProps = {
  submitText?: string,
  submitIcon?: React.ReactNode,
  initialValues: EventPlayerSchemaInput | undefined,
  renderActions?: (formState: FormState<EventPlayerSchemaInput>, handleSubmit: () => Promise<void>) => React.ReactNode,
  onSubmit: (data: EventPlayerSchema) => void,
}

export function EventPlayerForm({ submitText, submitIcon, initialValues, renderActions, onSubmit }: EventPlayerFormProps): React.ReactNode {
  const { control, handleSubmit, formState } = useForm<EventPlayerSchemaInput, any, EventPlayerSchema>({
    resolver: zodResolver(eventPlayerSchema),
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
          {formState.errors.incomingTagId && <Text style={formStyles.errorText}>{formState.errors.incomingTagId.message}</Text>}
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
          {formState.errors.outgoingTagId && <Text style={formStyles.errorText}>{formState.errors.outgoingTagId.message}</Text>}
        </View>
      </View>

      {actions()}
    </>
  )
}

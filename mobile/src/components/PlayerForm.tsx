import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormState, useForm } from 'react-hook-form'
import { View, Text, Pressable, Switch, ActivityIndicator } from 'react-native'
import { TextInput } from '@/components/TextInput'
import { userSchema, UserSchema, UserSchemaInput } from '@birdogey/shared'
import { colors } from '@/theme/colors'

export type PlayerFormProps = {
  submitText?: string,
  submitIcon?: React.ReactNode,
  initialValues: UserSchemaInput | undefined,
  isLoading?: boolean,
  renderActions?: (formState: FormState<UserSchemaInput>, handleSubmit: () => Promise<void>) => React.ReactNode,
  onSubmit: (data: UserSchema) => void,
  onCancel?: () => void,
}

export function PlayerForm({ submitText, submitIcon, initialValues, isLoading, renderActions, onSubmit, onCancel }: PlayerFormProps): React.ReactNode {
  const { control, handleSubmit, formState } = useForm<UserSchemaInput, any, UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: initialValues,
  })

  function actions(): React.ReactNode {
    if (renderActions) {
      return renderActions(formState, () => handleSubmit(onSubmit)())
    }

    return (
      <Pressable
        disabled={formState.isLoading || isLoading}
        style={formStyles.button}
        onPress={() => void handleSubmit(onSubmit)()}
      >
        <Text style={formStyles.buttonText}>{submitText}</Text>
        {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : submitIcon}
      </Pressable>
    )
  }

  return (
    <>
      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Player Name</Text>
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
        <Text style={formStyles.label}>PDGA Number</Text>
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
          name="pdgaNumber"
        />
        {formState.errors.pdgaNumber && <Text style={formStyles.errorText}>{formState.errors.pdgaNumber.message}</Text>}
      </View>

      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>UDisc ID</Text>
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
          name="udiscId"
        />
        {formState.errors.udiscId && <Text style={formStyles.errorText}>{formState.errors.udiscId.message}</Text>}
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

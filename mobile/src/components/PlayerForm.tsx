import { formStyles } from '@/theme/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import { TextInput } from '@/components/TextInput'
import { userSchema, UserSchema, UserSchemaInput } from '@birdogey/shared'
import { colors } from '@/theme/colors'

export type PlayerFormProps = {
  submitText?: string,
  submitIcon?: React.ReactNode,
  initialValues?: UserSchemaInput | undefined,
  isLoading?: boolean,
  onSubmit: (data: UserSchema) => void,
  onCancel?: () => void,
}

export function PlayerForm({ submitText, submitIcon, initialValues, isLoading, onSubmit, onCancel }: PlayerFormProps): React.ReactNode {
  const { control, handleSubmit, formState: { errors, isLoading: formIsLoading } } = useForm<UserSchemaInput, any, UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: initialValues,
  })

  return (
    <>
      <View style={formStyles.formGroup}>
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
          {errors.name && <Text style={formStyles.errorText}>{errors.name.message}</Text>}
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
          {errors.pdgaNumber && <Text style={formStyles.errorText}>{errors.pdgaNumber.message}</Text>}
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
          {errors.udiscId && <Text style={formStyles.errorText}>{errors.udiscId.message}</Text>}
        </View>
      </View>

      <View style={formStyles.formGroup}>
        <Pressable
          disabled={formIsLoading || isLoading}
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
      </View>
    </>
  )
}

import { Text, View, Pressable } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { LoginPhoneSchema, loginPhoneSchema } from '@birdogey/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/TextInput'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'

export function LoginPhoneStep({ onSuccess }: { onSuccess: (phoneNumber: string) => void }): React.ReactNode {
  const { control, handleSubmit, formState: { errors, isLoading, isSubmitted } } = useForm<LoginPhoneSchema>({
    resolver: zodResolver(loginPhoneSchema),
  })

  async function onSubmit(data: LoginPhoneSchema): Promise<void> {
    onSuccess(data.phoneNumber)
  }

  return (
    <>
      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Phone Number</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              style={formStyles.input}
              placeholder="(555) 555-5555"
              keyboardType="numeric"
              maxLength={10}
              icon={<SymbolView name="phone" size={20} tintColor={colors.primary} />}
            />
          )}
          name="phoneNumber"
        />
        {isSubmitted && errors.phoneNumber && <Text style={formStyles.errorText}>{errors.phoneNumber.message}</Text>}
      </View>

      <Pressable
        disabled={isLoading}
        style={formStyles.button}
        onPress={() => void handleSubmit(onSubmit)()}
      >
        <Text style={formStyles.buttonText}>Send Code</Text>
        <SymbolView name="arrow.right" size={20} tintColor="#fff" weight="bold" />
      </Pressable>
    </>
  )
}

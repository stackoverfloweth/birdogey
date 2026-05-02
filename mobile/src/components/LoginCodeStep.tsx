import { Text, View, Pressable } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { LoginCodeSchema, loginCodeSchema } from '@birdogey/shared'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/TextInput'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'

export function LoginCodeStep({ onSuccess }: { onSuccess: (code: string) => void }): React.ReactNode {
  const { control, handleSubmit, formState: { errors, isLoading, isSubmitted } } = useForm<LoginCodeSchema>({
    resolver: zodResolver(loginCodeSchema),
  })

  async function onSubmit(data: LoginCodeSchema): Promise<void> {
    onSuccess(data.code)
  }

  return (
    <>
      <View style={formStyles.formGroup}>
        <Text style={formStyles.label}>Verification Code</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="XXXXXX"
              keyboardType="numeric"
              icon={<SymbolView name="number" size={20} tintColor={colors.primary} />}
            />
          )}
          name="code"
        />
        {isSubmitted && errors.code && <Text style={formStyles.errorText}>{errors.code.message}</Text>}
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

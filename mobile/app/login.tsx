import { useAuth } from '@/contexts/AuthContext'
import { useCallback } from 'react'
import { Text, StyleSheet, Image, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import splashImage from '../../assets/splash.png'
import { Controller, useForm } from 'react-hook-form'
import { LoginSchema, loginSchema } from '@/schemas/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput } from '@/components/TextInput'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg'

export default function Login(): React.ReactNode {
  const { sendCode, verifyCode } = useAuth()

  const { control, handleSubmit, formState: { errors, isValid, isLoading, isSubmitted } } = useForm<LoginSchema>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginSchema) => {
    console.log('Submitted Data:', data)
  }

  const handleVerifyCode = useCallback(async () => {
    await verifyCode('1234567890', '123456')
    router.replace('/')
  }, [verifyCode])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrapper}>
        <Svg width={600} height={600} style={styles.logoGlow}>
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={colors.primary_200} stopOpacity="0.75" />
              <Stop offset="1" stopColor={colors.primary_200} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="300" cy="300" r="300" fill="url(#glow)" />
        </Svg>
        <View style={styles.logoContainer}>
          <Image source={splashImage} style={styles.logo} />
        </View>
      </View>
      <Text style={styles.title}>Birdogey</Text>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                style={styles.input}
                placeholder="(555) 555-5555"
                keyboardType="numeric"
                maxLength={10}
                icon={<SymbolView name="phone" size={20} tintColor={colors.primary} />}
              />
            )}
            name="phoneNumber"
          />
          {isSubmitted && errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
        </View>

        <Pressable
          disabled={isLoading}
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={() => void handleSubmit(onSubmit)()}
        >
          <Text style={styles.buttonText}>Send Code</Text>
          <SymbolView name="arrow.right" size={20} tintColor="#fff" weight="bold" />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  logoWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.primary_500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface_container_lowest,
  },
  logo: {
    width: 120,
    height: 120,
  },
  form: {
    padding: 24,
    gap: 16,
  },
  formGroup: {
    gap: 8,
    paddingHorizontal: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.on_surface_variant,
  },
  input: {
    marginHorizontal: -18,
  },
  errorText: {
    color: colors.error,
  },
  title: {
    fontFamily: 'Ephesis',
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.on_surface,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 9999,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
})

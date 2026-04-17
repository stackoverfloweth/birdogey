import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useState } from 'react'
import { Text, StyleSheet, Image, View, Pressable, Modal } from 'react-native'
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
import * as LocalAuthentication from 'expo-local-authentication'
import { authenticateWithBiometrics, setBiometricsEnabled } from '@/services/biometrics'

export default function Login(): React.ReactNode {
  const { sendCode, verifyCode, availableBiometrics, biometricsEnabled } = useAuth()
  const [askEnableBiometrics, setAskEnableBiometrics] = useState(false)

  const isFaceIdAvailable = availableBiometrics.includes(
    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
  )

  const isTouchIDAvailable = availableBiometrics.includes(
    LocalAuthentication.AuthenticationType.FINGERPRINT,
  )

  const showBiometrics = !!biometricsEnabled && (isFaceIdAvailable || isTouchIDAvailable)

  const { control, handleSubmit, formState: { errors, isValid, isLoading, isSubmitted } } = useForm<LoginSchema>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginSchema) => {
    console.log('Submitted Data:', data)
    handleVerifyCode(data.phoneNumber, '123456')
  }

  async function handleVerifyCode(phoneNumber: string, code: string): Promise<void> {
    await verifyCode(phoneNumber, code)

    if (biometricsEnabled === null && availableBiometrics.length > 0) {
      console.log('askEnableBiometrics', availableBiometrics)
      setAskEnableBiometrics(true)
    } else {
      router.replace('/')
    }
  }

  const handleEnableBiometrics = useCallback(async () => {
    await setBiometricsEnabled(true)
    setAskEnableBiometrics(false)
    router.replace('/')
  }, [])

  const handleDisableBiometrics = useCallback(async () => {
    await setBiometricsEnabled(false)
    setAskEnableBiometrics(false)
    router.replace('/')
  }, [])

  const handleBiometricsLogin = useCallback(async () => {
    const success = await authenticateWithBiometrics()
    if (success) {
      router.replace('/')
    }
  }, [])

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

        {showBiometrics && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.biometricsTitle}>Or</Text>
              <View style={styles.dividerLine} />
            </View>
            {isFaceIdAvailable && (
              <Pressable style={styles.faceIdButton} onPress={() => void handleBiometricsLogin()}>
                <SymbolView name="faceid" size={24} tintColor={colors.primary} />
                <Text style={styles.faceIdText}>Sign in with Face ID</Text>
              </Pressable>
            )}
            {isTouchIDAvailable && (
              <Pressable style={styles.faceIdButton} onPress={() => void handleBiometricsLogin()}>
                <SymbolView name="touchid" size={24} tintColor={colors.primary} />
                <Text style={styles.faceIdText}>Sign in with Touch ID</Text>
              </Pressable>
            )}
          </>
        )}
      </View>

      <Modal animationType="slide" transparent={true} visible={askEnableBiometrics}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            {isFaceIdAvailable && (
              <>
                <SymbolView name="faceid" size={28} tintColor={colors.on_surface} />
                <Text style={styles.modalTitle}>Enable Face ID?</Text>
              </>
            )}
            {isTouchIDAvailable && (
              <>
                <SymbolView name="touchid" size={28} tintColor={colors.on_surface} />
                <Text style={styles.modalTitle}>Enable Touch ID?</Text>
              </>
            )}
          </View>

          <View style={styles.modalButtons}>
            <Pressable style={styles.button} onPress={handleEnableBiometrics}>
              <Text style={styles.buttonText}>Yes</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={handleDisableBiometrics}>
              <Text style={styles.secondaryButtonText}>No</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    borderRadius: 9999,
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
    textTransform: 'uppercase',
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
    backgroundColor: colors.primary_500,
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
  secondaryButton: {
    backgroundColor: colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: colors.on_surface_variant,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 9999,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.on_surface_variant,
    fontWeight: 'bold',
    fontSize: 18,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.on_surface_variant,
  },
  biometricsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  faceIdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.surface_container_lowest,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 9999,
  },
  faceIdText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContent: {
    height: 160,
    width: '100%',
    backgroundColor: colors.surface_container_lowest,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'space-between',
    bottom: 0,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    color: colors.on_surface,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
})

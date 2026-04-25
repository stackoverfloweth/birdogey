import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useState } from 'react'
import { Text, StyleSheet, Image, View, Pressable, Modal, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import splashImage from '../../assets/splash.png'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'
import { modalsStyles } from '@/theme/modals'
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg'
import * as LocalAuthentication from 'expo-local-authentication'
import { authenticateWithBiometrics, setBiometricsEnabled } from '@/services/biometrics'
import { LoginPhoneStep } from '@/components/LoginPhoneStep'
import { LoginCodeStep } from '@/components/LoginCodeStep'

export default function Login(): React.ReactNode {
  const { sendCode, verifyCode, exchange, availableBiometrics, biometricsEnabled } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [askEnableBiometrics, setAskEnableBiometrics] = useState(false)
  const [exchangeFailed, setExchangeFailed] = useState(false)

  const isFaceIdAvailable = availableBiometrics.includes(
    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
  )
  const isTouchIDAvailable = availableBiometrics.includes(
    LocalAuthentication.AuthenticationType.FINGERPRINT,
  )
  const showBiometrics = !exchangeFailed && !!biometricsEnabled && (isFaceIdAvailable || isTouchIDAvailable)

  async function handleCodeSent(phoneNumber: string): Promise<void> {
    await sendCode(phoneNumber)
    setPhoneNumber(phoneNumber)
  }

  async function handleCodeVerified(code: string): Promise<void> {
    if (phoneNumber === null) return
    await verifyCode(phoneNumber, code)
    if (biometricsEnabled === null && availableBiometrics.length > 0) {
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
    try {
      await authenticateWithBiometrics()
      await exchange()
      router.replace('/')
    } catch {
      Alert.alert('Error', 'Failed to authenticate with biometrics')
      setExchangeFailed(true)
    }
  }, [exchange])

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

      <View style={formStyles.form}>
        {phoneNumber === null && (
          <LoginPhoneStep onSuccess={(data) => void handleCodeSent(data)} />
        )}
        {phoneNumber !== null && (
          <LoginCodeStep onSuccess={(code) => void handleCodeVerified(code)} />
        )}

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
        <View style={[styles.modalContent, modalsStyles.content]}>
          <View style={[modalsStyles.header]}>
            {isFaceIdAvailable && (
              <>
                <SymbolView name="faceid" size={28} tintColor={colors.on_surface} />
                <Text style={modalsStyles.title}>Enable Face ID?</Text>
              </>
            )}
            {isTouchIDAvailable && (
              <>
                <SymbolView name="touchid" size={28} tintColor={colors.on_surface} />
                <Text style={modalsStyles.title}>Enable Touch ID?</Text>
              </>
            )}
          </View>

          <View style={modalsStyles.buttons}>
            <Pressable style={formStyles.button} onPress={() => void handleEnableBiometrics()}>
              <Text style={formStyles.buttonText}>Yes</Text>
            </Pressable>
            <Pressable style={formStyles.secondaryButton} onPress={() => void handleDisableBiometrics()}>
              <Text style={formStyles.secondaryButtonText}>No</Text>
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
  title: {
    fontFamily: 'Ephesis',
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.on_surface,
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
    padding: 24,
  },
})

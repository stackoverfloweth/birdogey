import * as LocalAuthentication from 'expo-local-authentication'
import { Platform } from 'react-native'
import { getStoredValue, setStoredValue } from './tokenStorage'

const BIOMETRICS_ENABLED_KEY = 'BIRDOGEY_BIOMETRICS_ENABLED'

export async function isBiometricsAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  return hasHardware && isEnrolled
}

export async function getAvailableBiometrics(): Promise<LocalAuthentication.AuthenticationType[]> {
  if (Platform.OS === 'web') return []
  return LocalAuthentication.supportedAuthenticationTypesAsync()
}

export async function isBiometricsEnabled(): Promise<boolean | null> {
  if (Platform.OS === 'web') return false
  const value = await getStoredValue(BIOMETRICS_ENABLED_KEY)
  if (value === null) return null
  return value === 'true'
}

export async function setBiometricsEnabled(enabled: boolean): Promise<void> {
  await setStoredValue(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false')
}

export async function authenticateWithBiometrics(): Promise<void> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to continue',
    fallbackLabel: 'Use Passcode',
    disableDeviceFallback: false,
  })

  if (!result.success) {
    throw new Error('Failed to authenticate with biometrics')
  }
}

import { useState, useRef } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../src/contexts/AuthContext'

type Step = 'phone' | 'code'

export default function LoginScreen(): React.ReactNode {
  const { sendCode, verifyCode } = useAuth()
  const [step, setStep] = useState<Step>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const codeInputRef = useRef<TextInput>(null)

  function formatPhoneDisplay(value: string): string {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  function handlePhoneChange(value: string): void {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 10) {
      setPhoneNumber(digits)
    }
  }

  async function handleSendCode(): Promise<void> {
    if (phoneNumber.length < 10) return
    setError('')
    setLoading(true)
    try {
      await sendCode(phoneNumber)
      setStep('code')
      setTimeout(() => codeInputRef.current?.focus(), 100)
    } catch {
      setError('Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode(): Promise<void> {
    if (code.length < 6) return
    setError('')
    setLoading(true)
    try {
      await verifyCode(phoneNumber, code)
      router.replace('/(protected)')
    } catch {
      setError('Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  function handleBack(): void {
    setStep('phone')
    setCode('')
    setError('')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birdogey</Text>

      {step === 'phone' ? (
        <>
          <Text style={styles.subtitle}>Enter your phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="(555) 555-5555"
            keyboardType="phone-pad"
            value={formatPhoneDisplay(phoneNumber)}
            onChangeText={handlePhoneChange}
            onSubmitEditing={() => void handleSendCode()}
            autoFocus
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            style={[styles.button, phoneNumber.length < 10 && styles.buttonDisabled]}
            onPress={() => void handleSendCode()}
            disabled={loading || phoneNumber.length < 10}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Code</Text>}
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Enter the code sent to{'\n'}{formatPhoneDisplay(phoneNumber)}</Text>
          <TextInput
            ref={codeInputRef}
            style={styles.codeInput}
            placeholder="000000"
            keyboardType="number-pad"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
            onSubmitEditing={() => void handleVerifyCode()}
            maxLength={6}
            autoFocus
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            style={[styles.button, code.length < 6 && styles.buttonDisabled]}
            onPress={() => void handleVerifyCode()}
            disabled={loading || code.length < 6}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
          </Pressable>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Use a different number</Text>
          </Pressable>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 12,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93b4f5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2563eb',
    fontSize: 14,
  },
})

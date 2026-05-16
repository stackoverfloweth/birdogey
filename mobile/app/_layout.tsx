import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { AuthProvider } from '@/contexts/AuthContext'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ApiClientProvider } from '@/contexts/ApiClientContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Sentry from '@sentry/react-native'
import { ENV } from 'varlock/env'
import 'intl-pluralrules'

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  beforeSend(event) {
    const frames = event.exception?.values?.flatMap((value) => value.stacktrace?.frames ?? []) ?? []
    const files = frames.map((frame) => frame.filename ?? '').filter(Boolean)

    if (['/auth/refresh'].some((file) => files.includes(file))) {
      return null
    }

    return event
  },
})

function RootLayout(): React.ReactNode {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ApiClientProvider>
            <AuthProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </AuthProvider>
          </ApiClientProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default Sentry.wrap(RootLayout)

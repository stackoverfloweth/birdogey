import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'
import { AuthProvider } from '@/contexts/AuthContext'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ApiClientProvider } from '@/contexts/ApiClientContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'intl-pluralrules'

export default function RootLayout(): React.ReactNode {
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

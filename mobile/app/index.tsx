import { useAuth } from '@/contexts/AuthContext'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { Text } from 'react-native'

export default function Index(): React.ReactNode {
  const { isAuthenticated, isLoading } = useAuth()

  console.log({ isAuthenticated, isLoading })

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }

  return <Text>Hello World</Text>
  // return <Redirect href="/(protected)" />
}

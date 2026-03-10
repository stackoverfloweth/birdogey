import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'

export default function ModeratorLayout(): React.ReactNode {
  const { user } = useAuth()

  if (user?.isReadonly) {
    return <Redirect href="/(protected)" />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

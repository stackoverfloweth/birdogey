import { Stack } from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'index',
}

export default function PlayersLayout(): React.ReactNode {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]" />
    </Stack>
  )
}

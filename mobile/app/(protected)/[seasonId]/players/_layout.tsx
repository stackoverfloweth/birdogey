import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Pressable } from 'react-native'
import { SymbolView } from 'expo-symbols'

export default function PlayersLayout(): React.ReactNode {
  const { seasonId } = useLocalSearchParams<{ seasonId: string }>()

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Players',
          headerRight: () => (
            <Pressable onPress={() => router.push(`/(protected)/${seasonId}/players/create`)}>
              <SymbolView name="plus" tintColor="#007AFF" size={22} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{ title: 'Create Player' }}
      />
      <Stack.Screen
        name="[playerId]"
        options={{ title: 'Player' }}
      />
    </Stack>
  )
}

import { PlayerListItem } from '@/components/PlayerListItem'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native'
import { router } from 'expo-router'

export default function Players(): React.ReactNode {
  const api = useApiClient()

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => api.user.getList(),
  })

  return (
    <View style={styles.container}>
      <Pressable style={formStyles.button} onPress={() => router.push('players/create')}>
        <SymbolView name="plus" size={24} tintColor="#fff" weight="bold" />
        <Text style={formStyles.buttonText}>Add Player</Text>
      </Pressable>

      <FlatList
        data={players}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PlayerListItem player={item} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  list: {
    gap: 16,
  },
})

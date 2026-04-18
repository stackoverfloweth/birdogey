import { PlayerListItem } from '@/components/PlayerListItem'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { StyleSheet, View, Text, FlatList } from 'react-native'

export default function Players(): React.ReactNode {
  const api = useApiClient()

  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: () => api.user.getList(),
  })

  return (
    <View style={styles.container}>
      <FlatList
        data={players}
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
    flex: 1,
    flexDirection: 'column',
  },
})

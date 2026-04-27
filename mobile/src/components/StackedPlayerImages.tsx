import { useApiClient } from '@/contexts/ApiClientContext'
import { useQueries } from '@tanstack/react-query'
import { StyleSheet, View } from 'react-native'
import { UserImage } from '@/components/UserImage'

export function StackedPlayerImages({ playerIds }: { playerIds: string[] }): React.ReactNode {
  const api = useApiClient()

  const userQueries = useQueries({
    queries: playerIds.map((userId) => ({
      queryKey: ['user', userId],
      queryFn: () => api.user.getById(userId),
      enabled: !!userId,
    })),
  })

  return (
    <View style={styles.container}>
      {userQueries.map((query) => (
        <UserImage key={query.data?.id} imageUrl={query.data?.imageUrl} width={40} height={40} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
    gap: 2,
  },
})

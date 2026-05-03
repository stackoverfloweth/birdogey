import { useApiClient } from '@/contexts/ApiClientContext'
import { useQueries } from '@tanstack/react-query'
import { StyleSheet, View } from 'react-native'
import { UserImage } from '@/components/UserImage'
import { useMemo } from 'react'

export function StackedPlayerImages({ playerIds }: { playerIds: string[] }): React.ReactNode {
  const api = useApiClient()

  const userQueries = useQueries({
    queries: playerIds.map((userId) => ({
      queryKey: ['players', userId],
      queryFn: () => api.user.getById(userId),
      enabled: !!userId,
    })),
  })

  const users = useMemo(() => {
    return userQueries
      .filter((query) => query.data !== undefined)
      .map((query) => query.data)
  }, [userQueries])

  return (
    <View style={styles.container}>
      {users.map((user) => (
        <UserImage key={user.id} userId={user.id} imageUrl={user.imageUrl} width={40} height={40} />
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

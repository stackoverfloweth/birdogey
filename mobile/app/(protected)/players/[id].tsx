import { PlayerForm } from '@/components/PlayerForm'
import { useApiClient } from '@/contexts/ApiClientContext'
import { queryClient } from '@/services/queryClient'
import { colors } from '@/theme/colors'
import { cardStyles } from '@/theme/card'
import { UserRequest } from '@birdogey/shared'
import { useMutation, useQuery } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { StyleSheet, View, ActivityIndicator } from 'react-native'

export default function PlayerView(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>()

  const api = useApiClient()
  const { data: player, isLoading, isRefetching } = useQuery({
    queryKey: ['players', id],
    queryFn: () => api.user.getById(id),
  })

  const { mutate: updatePlayer, isPending: isUpdatingPlayer } = useMutation({
    mutationFn: (player: UserRequest) => api.user.update(id, player),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', id] })
    },
  })

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.primary} />
  }

  return (
    <View style={[cardStyles.card, styles.container]}>
      <PlayerForm
        initialValues={player}
        submitText="Save"
        submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
        isLoading={isUpdatingPlayer || isRefetching}
        onCancel={() => router.back()}
        onSubmit={updatePlayer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    margin: 16,
  },
})

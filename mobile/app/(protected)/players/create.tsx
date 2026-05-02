import { PlayerForm } from '@/components/PlayerForm'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useMutation } from '@tanstack/react-query'
import { ScrollView, StyleSheet } from 'react-native'
import { queryClient } from '@/services/queryClient'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { cardStyles } from '@/theme/card'
import { UserSchema } from '@birdogey/shared'

export default function PlayerCreate(): React.ReactNode {
  const api = useApiClient()

  const { mutate: createPlayer } = useMutation({
    mutationFn: (data: UserSchema) => api.user.create(data),
    onSuccess: (userId) => {
      router.push(`/players/${userId}`)
      queryClient.invalidateQueries({ queryKey: ['players'] })
    },
  })

  return (
    <ScrollView style={{ margin: 16 }} contentContainerStyle={[cardStyles.card, styles.container]}>
      <PlayerForm
        submitText="Create Player"
        submitIcon={<SymbolView name="plus" size={20} tintColor="#fff" weight="bold" />}
        onSubmit={createPlayer}
        onCancel={() => router.back()}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    flex: 1,
  },
})

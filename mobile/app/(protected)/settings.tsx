import { PlayerFormModal } from '@/components/PlayerFormModal'
import { useAuth } from '@/contexts/AuthContext'
import { queryClient } from '@/services/queryClient'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useCallback, useState } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMutation, useQuery } from '@tanstack/react-query'
import { UserRequest } from '@birdogey/shared'
import { useApiClient } from '@/contexts/ApiClientContext'

export default function Settings(): React.ReactNode {
  const { logout } = useAuth()

  const [playerModalVisible, setPlayerModalVisible] = useState(false)

  const userId = useAuth().user?.id
  const api = useApiClient()

  const { data: player } = useQuery({
    queryKey: ['players', userId],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error('User not found'))
      }

      return api.user.getById(userId)
    },
    enabled: !!userId,
  })

  const { mutate: updatePlayer } = useMutation({
    mutationFn: (data: UserRequest) => {
      if (!userId) {
        return Promise.reject(new Error('Player not found'))
      }

      return api.user.update(userId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', userId] })
    },
  })

  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
  }, [logout])

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={[formStyles.secondaryButton, { backgroundColor: colors.surface_container_lowest }]}
        onPress={() => setPlayerModalVisible(true)}
      >
        <SymbolView name="person.fill" size={20} tintColor={colors.on_surface_variant} weight="bold" />
        <Text style={formStyles.secondaryButtonText}>Edit Profile</Text>
      </Pressable>

      <Pressable
        style={[formStyles.secondaryButton, { backgroundColor: colors.surface_container_lowest }]}
        onPress={handleLogout}
      >
        <SymbolView name="escape" size={20} tintColor={colors.on_surface_variant} weight="bold" />
        <Text style={formStyles.secondaryButtonText}>Logout</Text>
      </Pressable>

      {playerModalVisible && player && (
        <PlayerFormModal
          player={player}
          visible={playerModalVisible}
          onDismiss={() => setPlayerModalVisible(false)}
          onSubmit={updatePlayer}
          style={{ height: '93%' }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 18,
  },
})

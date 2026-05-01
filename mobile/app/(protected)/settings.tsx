import { PlayerFormModal } from '@/components/PlayerFormModal'
import { useAuth } from '@/contexts/AuthContext'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useCallback, useState } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings(): React.ReactNode {
  const { logout } = useAuth()

  const [playerModalVisible, setPlayerModalVisible] = useState(false)

  const player = useAuth().user

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
          // onSubmit={handleEventModalSave}
          // style={{ top }}
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

import { ProfileForm } from '@/components/ProfileForm'
import { useAuth } from '@/contexts/AuthContext'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useCallback } from 'react'
import { StyleSheet, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings(): React.ReactNode {
  const { logout } = useAuth()

  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
  }, [logout])

  return (
    <SafeAreaView style={styles.container}>
      <ProfileForm />

      <Pressable
        style={[formStyles.secondaryButton, { backgroundColor: colors.surface_container_lowest }]}
        onPress={handleLogout}
      >
        <Text style={formStyles.secondaryButtonText}>Logout</Text>
        <SymbolView name="escape" size={20} tintColor={colors.on_surface_variant} weight="bold" />
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },
})

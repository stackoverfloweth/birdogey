import { colors } from '@/theme/colors'
import { router, Stack } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { modalsStyles } from '@/theme/modals'
import { formStyles } from '@/theme/forms'
import { useCallback, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ProfileForm } from '@/components/ProfileForm'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedLayout(): React.ReactNode {
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const { logout } = useAuth()
  const insets = useSafeAreaInsets()

  const handleLogout = useCallback(() => {
    setProfileModalVisible(false)
    logout()
    router.push('/login')
  }, [logout])

  return (
    <>
      <Stack screenOptions={{
        title: 'Birdogey',
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'Ephesis',
          fontSize: 32,
          fontWeight: 'normal',
          color: colors.primary_500,
        },
        headerLeft: () => (
          <Pressable onPress={() => setProfileModalVisible(true)}>
            <SymbolView name="person.circle.fill" size={32} tintColor={colors.primary} />
          </Pressable>
        ),
      }}
      />
      <Modal animationType="slide" transparent={true} visible={profileModalVisible}>
        <View style={[modalsStyles.content, style.modalContent]}>
          <View style={[style.modalHeader, { paddingTop: insets.top + 16 }]}>
            <View style={[style.headerLeft]}>
              <Pressable onPress={() => setProfileModalVisible(false)}>
                <SymbolView name="x.circle" size={34} tintColor={colors.primary} />
              </Pressable>
            </View>
            <View style={modalsStyles.header}>
              <Text style={modalsStyles.title}>Profile</Text>
            </View>
          </View>
          <View style={style.modalBody}>
            <ProfileForm />
            <Pressable style={formStyles.secondaryButton} onPress={handleLogout}>
              <Text style={formStyles.secondaryButtonText}>Logout</Text>
              <SymbolView name="escape" size={20} tintColor={colors.on_surface_variant} weight="bold" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
}

const style = StyleSheet.create({
  modalContent: {
    height: '100%',
    backgroundColor: colors.surface,
  },
  headerLeft: {
    position: 'absolute',
    left: 12,
    bottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  modalHeader: {
    position: 'relative',
    paddingHorizontal: 28,
    paddingBottom: 14,
    marginBottom: 8,
    borderBottomWidth: 1,
    backgroundColor: colors.surface_container_lowest,
    borderBottomColor: colors.outline_variant,
  },
  modalBody: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})

import { Pressable, StyleSheet, View, Modal, StyleProp, ViewStyle, ScrollView, Alert, Text } from 'react-native'
import { modalStyles } from '@/theme/modals'
import { PlayerSeasonForm } from '@/components/PlayerSeasonForm'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { queryClient } from '@/services/queryClient'
import { formStyles } from '@/theme/forms'
import { UserSeasonSchemaInput } from '@birdogey/shared'

type PlayerSeasonFormModalProps = {
  userId: string,
  visible?: boolean,
  initialValues?: UserSeasonSchemaInput,
  onDismiss?: () => void,
  style?: StyleProp<ViewStyle>,
}

export function PlayerSeasonFormModal({ userId, visible, initialValues, onDismiss, style }: PlayerSeasonFormModalProps): React.ReactNode {
  const apiClient = useApiClient()

  const { mutate: setUserSeason } = useMutation({
    mutationFn: (data: UserSeasonSchemaInput) => {
      const { seasonId, ...membership } = data

      return apiClient.season.setUser(seasonId, userId, membership)
    },
    onSuccess: () => {
      onDismiss?.()
      router.replace('/players')
      queryClient.invalidateQueries({ queryKey: ['players', userId] })
    },
  })

  const { mutate: removeUserSeason } = useMutation({
    mutationFn: (seasonId: string) => apiClient.season.removeUser(seasonId, userId),
    onSuccess: () => {
      onDismiss?.()
      router.replace('/players')
      queryClient.invalidateQueries({ queryKey: ['players', userId] })
    },
  })

  function handleDelete(seasonId: string): void {
    Alert.alert(
      'Are you sure?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove Player',
          style: 'destructive',
          onPress: () => {
            removeUserSeason(seasonId)
          },
        },
      ],
    )
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
      <Pressable style={modalStyles.backdrop} onPress={onDismiss} />

      <View style={[modalStyles.content, style]}>
        <View style={modalStyles.header}>
          <Pressable style={[formStyles.iconButton, { backgroundColor: colors.outline_variant }]} onPress={onDismiss}>
            <SymbolView name="chevron.down" size={30} tintColor="#fff" weight="bold" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <PlayerSeasonForm
            submitText={initialValues ? 'Save' : 'Add'}
            submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
            deleteText="Remove"
            initialValues={initialValues}
            onSubmit={(data) => setUserSeason(data)}
            onCancel={onDismiss}
            onDelete={handleDelete}
          />
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    position: 'relative',
    paddingBottom: 24,
  },
  submitButton: {
    position: 'absolute',
    top: 12,
    right: 18,
    backgroundColor: colors.primary,
  },
})

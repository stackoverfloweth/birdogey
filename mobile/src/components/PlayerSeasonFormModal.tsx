import { StyleSheet, StyleProp, ViewStyle, ScrollView, Alert } from 'react-native'
import { BottomSheet } from '@/components/BottomSheet'
import { PlayerSeasonForm } from '@/components/PlayerSeasonForm'
import { SymbolView } from 'expo-symbols'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { queryClient } from '@/services/queryClient'
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
    <BottomSheet visible={!!visible} onDismiss={() => onDismiss?.()} contentStyle={style}>
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
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    paddingBottom: 24,
  },
})

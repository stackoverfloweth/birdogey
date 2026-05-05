import { StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native'
import { BottomSheet } from '@/components/BottomSheet'
import { PlayerForm } from '@/components/PlayerForm'
import { User, UserSchema, UserSchemaInput } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { useMemo } from 'react'

type PlayerFormModalProps = {
  player: User,
  visible?: boolean,
  onDismiss?: () => void,
  onSubmit?: (user: UserSchema) => void,
  style?: StyleProp<ViewStyle>,
}

export function PlayerFormModal({ player, visible, onDismiss, onSubmit, style }: PlayerFormModalProps): React.ReactNode {
  const initialValues = useMemo<UserSchemaInput | undefined>(() => {
    return player
  }, [player])

  function handleSubmit(data: UserSchema): void {
    onSubmit?.(data)
    onDismiss?.()
  }

  return (
    <BottomSheet visible={!!visible} onDismiss={() => onDismiss?.()} contentStyle={style}>
      <ScrollView contentContainerStyle={styles.modalContent}>
        <PlayerForm
          userId={player.id}
          submitText="Save"
          submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onDismiss}
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

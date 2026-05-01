import { Pressable, StyleSheet, View, Modal, StyleProp, ViewStyle, ScrollView } from 'react-native'
import { modalsStyles } from '@/theme/modals'
import { PlayerForm } from '@/components/PlayerForm'
import { User, UserSchema, UserSchemaInput } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { useMemo } from 'react'
import { colors } from '@/theme/colors'

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
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
      <Pressable style={modalsStyles.backdrop} onPress={onDismiss} />

      <View style={[modalsStyles.content, style]}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <PlayerForm
            submitText="Save"
            submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={onDismiss}
          />
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    paddingVertical: 24,
    gap: 78,
    position: 'relative',
  },
  submitButton: {
    position: 'absolute',
    top: 12,
    right: 18,
    backgroundColor: colors.primary,
  },
})

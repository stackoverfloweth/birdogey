import { Pressable, StyleSheet, View, Modal, StyleProp, ViewStyle, ScrollView } from 'react-native'
import { modalStyles } from '@/theme/modals'
import { PlayerForm } from '@/components/PlayerForm'
import { User, UserSchema, UserSchemaInput } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { useMemo } from 'react'
import { colors } from '@/theme/colors'
import { formStyles } from '@/theme/forms'

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
      <Pressable style={modalStyles.backdrop} onPress={onDismiss} />

      <View style={[modalStyles.content, style]}>
        <View style={modalStyles.header}>
          <Pressable style={[formStyles.iconButton, { backgroundColor: colors.outline_variant }]} onPress={onDismiss}>
            <SymbolView name="chevron.down" size={30} tintColor="#fff" weight="bold" />
          </Pressable>
        </View>

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

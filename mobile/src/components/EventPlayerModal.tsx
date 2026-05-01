import { Pressable, StyleSheet, View, Modal, StyleProp, ViewStyle, Text } from 'react-native'
import { modalStyles } from '@/theme/modals'
import { EventPlayerForm } from '@/components/EventPlayerForm'
import { PlayerInEvent } from '@/components/EventPlayersActiveList'
import { EventPlayerSchemaInput } from '@birdogey/shared'
import { colors } from '@/theme/colors'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'
import { router } from 'expo-router'

type EventPlayerModalProps = {
  player: PlayerInEvent,
  onSubmit?: (data: PlayerInEvent) => void,
  onDismiss?: () => void,
  style?: StyleProp<ViewStyle>,
}

export function EventPlayerModal({ player, onSubmit = () => {}, onDismiss = () => {}, style }: EventPlayerModalProps): React.ReactNode {
  function handleSubmit(data: EventPlayerSchemaInput): void {
    onSubmit({ ...player, ...data })
    onDismiss()
  }

  function handleEditLinkPress(): void {
    onDismiss()
    router.navigate(`/players/${player.userId}`)
  }

  return (
    <Modal animationType="slide" transparent={true} visible={!!player} onRequestClose={onDismiss}>
      <Pressable style={modalStyles.backdrop} onPress={onDismiss} />

      <View style={[modalStyles.content, styles.modalContent, style]}>
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalTitle}>{player.name}</Text>
            <Pressable
              onPress={handleEditLinkPress}
            >
              <Text style={{ color: colors.primary }}>Edit Player</Text>
              <SymbolView name="person" size={20} tintColor="#fff" weight="bold" />
            </Pressable>
          </View>

          <Pressable onPress={onDismiss} style={[formStyles.iconButton, { backgroundColor: colors.outline_variant }]}>
            <SymbolView name="xmark" size={30} tintColor="#fff" weight="bold" />
          </Pressable>
        </View>

        <EventPlayerForm
          initialValues={player}
          submitText="Save"
          submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
          onSubmit={handleSubmit}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    paddingVertical: 24,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.on_surface,
  },
})

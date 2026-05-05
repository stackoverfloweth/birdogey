import { Pressable, StyleSheet, View, StyleProp, ViewStyle, Text } from 'react-native'
import { BottomSheet } from '@/components/BottomSheet'
import { EventPlayerForm } from '@/components/EventPlayerForm'
import { PlayerInEvent } from '@/components/EventPlayersActiveList'
import { EventPlayerSchemaInput } from '@birdogey/shared'
import { colors } from '@/theme/colors'
import { SymbolView } from 'expo-symbols'
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
    <BottomSheet visible={!!player} onDismiss={onDismiss} contentStyle={[styles.modalContent, style]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{player.name}</Text>
        <Pressable onPress={handleEditLinkPress}>
          <Text style={{ color: colors.primary }}>Edit Player</Text>
        </Pressable>
      </View>

      <EventPlayerForm
        initialValues={player}
        submitText="Save"
        submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
        onSubmit={handleSubmit}
      />
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    paddingBottom: 24,
    gap: 16,
  },
  modalHeader: {
    paddingHorizontal: 24,
    gap: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.on_surface,
  },
})

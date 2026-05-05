import { PlayerListItem } from '@/components/PlayerListItem'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { Score } from '@/components/Score'
import { ScoreModal } from '@/components/ScoreModal'
import { EventPlayerModal } from '@/components/EventPlayerModal'
import { PlayerInEvent } from '@/components/EventPlayersActiveList'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useState } from 'react'

type PlayerListItemWithSwipeActionsProps = {
  player: PlayerInEvent,
  visible?: boolean,
  onChange?: (player: PlayerInEvent) => void,
  onRemove?: (userId: string) => void,
}

export function PlayerListItemWithSwipeActions({ player, visible, onChange, onRemove }: PlayerListItemWithSwipeActionsProps): React.ReactNode {
  const [ctpState, setCtpState] = useState<boolean>(player.inForCtp ?? false)
  const [aceState, setAceState] = useState<boolean>(player.inForAce ?? false)
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false)
  const [scoreModalVisible, setScoreModalVisible] = useState<boolean>(false)

  function handleSwipeClose(): void {
    onChange?.({
      ...player,
      inForAce: aceState,
      inForCtp: ctpState,
    })
  }

  function renderRightActions(player: PlayerInEvent): React.ReactNode {
    return (
      <View style={styles.swipeActions}>
        <Pressable style={[styles.swipeAction, aceState ? styles.swipeActionActive : undefined]} onPress={() => setAceState(!aceState)}>
          <Text style={styles.swipeActionText}>ACE</Text>
        </Pressable>
        <Pressable style={[styles.swipeAction, ctpState ? styles.swipeActionActive : undefined]} onPress={() => setCtpState(!ctpState)}>
          <Text style={styles.swipeActionText}>CTP</Text>
        </Pressable>
        <Pressable style={[styles.swipeAction, styles.swipeActionRemove]} onPress={() => onRemove?.(player.userId)}>
          <SymbolView name="trash" size={24} tintColor="#fff" weight="bold" />
        </Pressable>
      </View>
    )
  }

  function renderRightState(player: PlayerInEvent): React.ReactNode {
    return (
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Pressable onPress={() => setScoreModalVisible(true)}>
          {player.score === undefined ? <SymbolView name="exclamationmark.triangle.fill" size={32} tintColor={colors.error} /> : <Score value={player.score} />}
        </Pressable>
      </View>
    )
  }

  function renderSubTitle(player: PlayerInEvent): React.ReactNode {
    return (
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Text>{player.incomingTagId ? `#${player.incomingTagId}` : 'No tag'}</Text>

        <Text style={aceState ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.outline_variant }}>ACE</Text>

        <Text style={ctpState ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.outline_variant }}>CTP</Text>
      </View>
    )
  }

  return (
    <>
      <ReanimatedSwipeable
        onSwipeableClose={handleSwipeClose}
        renderRightActions={() => renderRightActions(player)}
        overshootRight={false}
      >
        <PlayerListItem
          player={player}
          visible={visible}
          right={renderRightState(player)}
          subTitle={renderSubTitle(player)}
          onPress={() => setEditModalVisible(true)}
        />
      </ReanimatedSwipeable>

      {editModalVisible && (
        <EventPlayerModal
          player={player}
          onSubmit={onChange}
          onDismiss={() => setEditModalVisible(false)}
        />
      )}

      {scoreModalVisible && (
        <ScoreModal
          player={player}
          onDismiss={() => setScoreModalVisible(false)}
          onChange={onChange}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
  },
  swipeAction: {
    width: 72,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    gap: 4,
    backgroundColor: colors.outline_variant,
  },
  swipeActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.surface_container_lowest,
  },
  swipeActionActive: {
    backgroundColor: colors.primary,
  },
  swipeActionRemove: {
    backgroundColor: colors.error,
  },
})

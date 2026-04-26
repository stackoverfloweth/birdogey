import { modalsStyles } from '@/theme/modals'
import { Pressable, StyleSheet, Modal, View } from 'react-native'
import { Score } from '@/components/Score'
import { PlayerListItem } from './PlayerListItem'
import { colors } from '@/theme/colors'
import { SymbolView } from 'expo-symbols'
import { PlayerInEvent } from '@/components/EventPlayersActiveList'

type ScoreModalProps = {
  player?: PlayerInEvent,
  onDismiss: () => void,
  onChange: (value: PlayerInEvent) => void,
}

export function ScoreModal({ player, onDismiss, onChange }: ScoreModalProps): React.ReactNode {
  const count = 16
  const negativeValues = new Array(count).fill(null)
    .map((_value, index) => -count + index)
  const positiveValues = new Array(count).fill(null)
    .map((_value, index) => index + 1)

  function setScore(score: number): void {
    if (!player) {
      return
    }

    onChange({ ...player, score })
  }

  function handleScoreSelection(score: number): void {
    setScore(score)
    onDismiss()
  }

  function renderRightState(): React.ReactNode {
    return (
      <Pressable style={[{ paddingHorizontal: 8, paddingVertical: 8, borderRadius: 9999, backgroundColor: colors.outline_variant }]} onPress={onDismiss}>
        <SymbolView name="xmark" size={20} tintColor={colors.on_surface} weight="bold" />
      </Pressable>
    )
  }

  function renderSubTitle(): React.ReactNode {
    return (
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Pressable onPress={() => setScore((player?.score ?? 0) - 1)}>
          <SymbolView name="minus" size={32} tintColor={colors.on_surface} />
        </Pressable>
        <Score value={player?.score} />
        <Pressable onPress={() => setScore((player?.score ?? 0) + 1)}>
          <SymbolView name="plus" size={32} tintColor={colors.on_surface} />
        </Pressable>
      </View>
    )
  }
  return (
    <Modal animationType="slide" transparent={true} visible={!!player} onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss} />

      <View style={[modalsStyles.content, styles.modalContent]}>
        {player && <PlayerListItem player={player} right={renderRightState()} subTitle={renderSubTitle()} />}

        <View style={styles.scoreGrid}>
          {negativeValues.map((value) => (
            <Pressable key={value} style={styles.scoreButton} onPress={() => handleScoreSelection(value)}>
              <Score value={value} />
            </Pressable>
          ))}

          <Pressable style={[styles.scoreButton, { width: '100%' }]} onPress={() => handleScoreSelection(0)}>
            <Score value={0} />
          </Pressable>

          {positiveValues.map((value) => (
            <Pressable key={value} style={styles.scoreButton} onPress={() => handleScoreSelection(value)}>
              <Score value={value} />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  modalContent: {
    height: 560,
    padding: 24,
    gap: 16,
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outline_variant,
  },
  scoreButton: {
    alignItems: 'center',
    padding: 18,
    width: '25%',
    borderWidth: 1,
    borderColor: colors.outline_variant,
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: colors.surface_container_lowest,
  },
})

import { BottomSheet } from '@/components/BottomSheet'
import { Pressable, StyleSheet, View } from 'react-native'
import { Score } from '@/components/Score'
import { colors } from '@/theme/colors'
import { SymbolView } from 'expo-symbols'
import { PlayerInEvent } from '@/components/EventPlayersActiveList'
import { UserImage } from './UserImage'
import { useState } from 'react'

type ScoreModalProps = {
  player: PlayerInEvent,
  onDismiss?: () => void,
  onChange?: (value: PlayerInEvent) => void,
}

export function ScoreModal({ player, onDismiss, onChange }: ScoreModalProps): React.ReactNode {
  const count = 12
  const [score, setScore] = useState<number | undefined>(player.score)

  const negativeValues = new Array(count).fill(null)
    .map((_value, index) => -count + index)
  const positiveValues = new Array(count).fill(null)
    .map((_value, index) => index + 1)

  function save(score: number | undefined): void {
    onChange?.({ ...player, score })
    onDismiss?.()
  }

  function renderRightState(): React.ReactNode {
    return (
      <Pressable
        style={[{ paddingHorizontal: 8, paddingVertical: 8, borderRadius: 9999, backgroundColor: colors.primary }]}
        onPress={() => save(score)}
      >
        <SymbolView name="checkmark" size={30} tintColor={colors.surface_container_lowest} weight="bold" />
      </Pressable>
    )
  }

  function renderSubTitle(): React.ReactNode {
    return (
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Pressable onPress={() => setScore((score = 0) => score - 1)}>
          <SymbolView name="minus" size={32} tintColor={colors.on_surface} />
        </Pressable>

        <Score value={score} />

        <Pressable onPress={() => setScore((score = 0) => score + 1)}>
          <SymbolView name="plus" size={32} tintColor={colors.on_surface} />
        </Pressable>
      </View>
    )
  }
  return (
    <BottomSheet visible={!!player} onDismiss={() => onDismiss?.()} contentStyle={styles.modalContent}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <UserImage userId={player.userId} imageUrl={player.imageUrl} width={40} height={40} />
        {renderSubTitle()}
        {renderRightState()}
      </View>

      <View style={styles.scoreGrid}>
        {negativeValues.map((value) => (
          <Pressable key={value} style={styles.scoreButton} onPress={() => save(value)}>
            <Score value={value} />
          </Pressable>
        ))}

        <Pressable style={[styles.scoreButton, { width: '100%' }]} onPress={() => save(0)}>
          <Score value={0} />
        </Pressable>

        {positiveValues.map((value) => (
          <Pressable key={value} style={styles.scoreButton} onPress={() => save(value)}>
            <Score value={value} />
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
    gap: 16,
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    justifyContent: 'space-between',
  },
  scoreButton: {
    alignItems: 'center',
    padding: 18,
    width: '22%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline_variant,
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: colors.surface_container_lowest,
  },
})

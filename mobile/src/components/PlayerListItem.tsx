import { View, Text, Pressable, StyleSheet } from 'react-native'
import type { Player } from '@birdogey/shared'

interface Props {
  player: Player,
  onPress?: () => void,
}

function EntryPaid({ player }: { player: Player }): React.ReactNode {
  return (
    <Text style={[styles.paid, player.entryPaid ? styles.paidYes : styles.paidNo]}>
      {player.entryPaid ? 'Paid' : 'Unpaid'}
    </Text>
  )
}

export function PlayerListItem({ player, onPress }: Props): React.ReactNode {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>
            #
            {player.tagId}
          </Text>
        </View>
        <Text style={styles.name}>{player.name}</Text>
      </View>
      {player.entryPaid !== undefined
      && <EntryPaid player={player} />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tagBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  paid: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  paidYes: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  paidNo: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
})

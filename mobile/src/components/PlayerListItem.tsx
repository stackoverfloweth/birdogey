import { Text, StyleSheet, Pressable } from 'react-native'
import type { User } from '@birdogey/shared'
import { colors } from '@/theme/colors'
import { UserImage } from './UserImage'

export function PlayerListItem({ player }: { player: User }): React.ReactNode {
  return (
    <Pressable style={styles.container}>
      <UserImage imageUrl={player.imageUrl} width={40} height={40} />
      <Text>{player.name}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.surface_container_high,
  },
})

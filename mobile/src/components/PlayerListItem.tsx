import { Text, StyleSheet, View } from 'react-native'
import type { User } from '@birdogey/shared'
import { colors } from '@/theme/colors'
import { UserImage } from './UserImage'

type PlayerListItemProps = {
  player: User,
  visible?: boolean,
}

export function PlayerListItem({ player, visible = true }: PlayerListItemProps): React.ReactNode {
  return (
    <View style={styles.container}>
      <UserImage imageUrl={visible ? player.imageUrl : undefined} width={40} height={40} />
      <Text>{player.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: colors.surface_container_lowest,
    borderRadius: 9999,
  },
})

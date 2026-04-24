import { Text, StyleSheet, View } from 'react-native'
import type { User } from '@birdogey/shared'
import { colors } from '@/theme/colors'
import { UserImage } from './UserImage'

type PlayerListItemProps = {
  player: User,
  visible?: boolean,
  right?: React.ReactNode,
  subTitle?: React.ReactNode,
}

export function PlayerListItem({ player, visible = true, right, subTitle }: PlayerListItemProps): React.ReactNode {
  return (
    <View style={styles.container}>
      <View style={styles.primary}>
        <UserImage imageUrl={visible ? player.imageUrl : undefined} width={40} height={40} />
        <View style={{ gap: 2 }}>
          <Text style={styles.primaryText}>{player.name}</Text>
          {subTitle}
        </View>
      </View>
      {right}
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
  primary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})

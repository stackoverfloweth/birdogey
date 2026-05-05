import { StyleSheet, StyleProp, ViewStyle, FlatList, FlatListProps, ListRenderItemInfo } from 'react-native'
import { User } from '@birdogey/shared'
import { BottomSheet } from '@/components/BottomSheet'
import { PlayerListItem } from '@/components/PlayerListItem'

type PlayersModalProps<T extends User> = Omit<FlatListProps<T>, 'data' | 'renderItem'> & {
  players: T[],
  visible?: boolean,
  beforeList?: () => React.ReactNode,
  renderItem?: (item: T, onSelect: (player: T) => void, onDismiss: () => void) => React.ReactElement,
  onSelect?: (player: T) => void,
  onDismiss?: () => void,
  style?: StyleProp<ViewStyle>,
}

export function PlayersModal<T extends User>({ players, visible, beforeList, renderItem, onSelect = () => {}, onDismiss = () => {}, style, ...listProps }: PlayersModalProps<T>): React.ReactNode {
  function defaultRenderItem({ item }: ListRenderItemInfo<T>): React.ReactElement {
    return <PlayerListItem player={item} onPress={() => onSelect(item)} />
  }

  return (
    <BottomSheet visible={!!visible} onDismiss={onDismiss} contentStyle={[styles.modalContent, style]}>
      {beforeList?.()}

      <FlatList
        data={players}
        renderItem={renderItem ? ({ item }) => renderItem(item, onSelect, onDismiss) : defaultRenderItem}
        {...listProps}
      />
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
    gap: 16,
  },
})

import { Pressable, StyleSheet, View, Modal, StyleProp, ViewStyle, FlatList, FlatListProps, ListRenderItemInfo } from 'react-native'
import { User } from '@birdogey/shared'
import { modalsStyles } from '@/theme/modals'
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
    return (
      <Pressable onPress={() => onSelect(item)}>
        <PlayerListItem player={item} />
      </Pressable>
    )
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
      <Pressable style={modalsStyles.backdrop} onPress={onDismiss} />

      <View style={[modalsStyles.content, styles.modalContent, style]}>
        {beforeList?.()}

        <FlatList
          data={players}
          renderItem={renderItem ? ({ item }) => renderItem(item, onSelect, onDismiss) : defaultRenderItem}
          {...listProps}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
    gap: 16,
  },
})

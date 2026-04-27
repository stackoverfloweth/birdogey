import { cardStyles } from '@/theme/card'
import { colors } from '@/theme/colors'
import { calculatePayoutSplit, penniesToUSD, Event, calculateEventCtpPot, calculateEventAcePot, EventRequest } from '@birdogey/shared'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { StackedPlayerImages } from '@/components/StackedPlayerImages'
import { PlayersModal } from '@/components/PlayersModal'
import { useMemo, useState } from 'react'
import type { PlayerInEvent } from '@/components/EventPlayersActiveList'
import { PlayerListItem } from './PlayerListItem'
import { SymbolView } from 'expo-symbols'

type PotBalancesProps = {
  event?: Event,
  eventPlayers: PlayerInEvent[],
  onChange?: (event: Partial<EventRequest>) => void,
  onDismiss?: () => void,
}

type PotProperties = Pick<Event, 'aceUserIds' | 'ctpUserIds'>

export function PotBalances({ event, eventPlayers, onChange }: PotBalancesProps): React.ReactNode {
  const [modalVisible, setModalVisible] = useState<keyof PotProperties | null>(null)

  const ctpWinnerUserIds = useMemo(() => event?.ctpUserIds ?? [], [event])
  const aceWinnerUserIds = useMemo(() => event?.aceUserIds ?? [], [event])
  const ctpUserIds = useMemo(() => eventPlayers.filter((player) => player.inForCtp).map(({ id }) => id), [eventPlayers])
  const aceUserIds = useMemo(() => eventPlayers.filter((player) => player.inForAce).map(({ id }) => id), [eventPlayers])

  const ctpInPennies = useMemo(() => {
    if (!event) {
      return 0
    }

    return calculateEventCtpPot({
      ...event,
      players: eventPlayers,
    })
  }, [event, eventPlayers])

  const aceInPennies = useMemo(() => {
    if (!event) {
      return 0
    }

    return calculateEventAcePot({
      ...event,
      players: eventPlayers,
    })
  }, [event, eventPlayers])

  function handlePlayerSelect(player: PlayerInEvent): void {
    setModalVisible(null)

    if (modalVisible === null) {
      return
    }

    const currentUserIds = event?.[modalVisible] ?? []

    if (currentUserIds.includes(player.userId)) {
      onChange?.({
        ...event,
        [modalVisible]: currentUserIds.filter((userId) => userId !== player.userId),
      })
      return
    }

    onChange?.({ ...event, [modalVisible]: [...currentUserIds, player.userId] })
  }

  function renderRightState(player: PlayerInEvent): React.ReactElement | undefined {
    switch (modalVisible) {
      case 'aceUserIds':
        return aceWinnerUserIds.includes(player.id) ? <SymbolView name="checkmark.circle.fill" size={30} tintColor={colors.primary} /> : undefined
      case 'ctpUserIds':
        return ctpWinnerUserIds.includes(player.id) ? <SymbolView name="checkmark.circle.fill" size={30} tintColor={colors.primary} /> : undefined
      case null:
        return undefined
      default:
        return modalVisible satisfies never
    }
  }

  function renderSubTitle(player: PlayerInEvent): React.ReactElement | undefined {
    switch (modalVisible) {
      case 'aceUserIds':
        return aceUserIds.includes(player.id) ? undefined : <Text style={{ color: colors.error, fontWeight: 'bold' }}>NOT IN FOR ACE</Text>
      case 'ctpUserIds':
        return ctpUserIds.includes(player.id) ? undefined : <Text style={{ color: colors.error, fontWeight: 'bold' }}>NOT IN FOR CTP</Text>
      case null:
        return undefined
      default:
        return modalVisible satisfies never
    }
  }

  function renderItem(player: PlayerInEvent, onSelect: (player: PlayerInEvent) => void): React.ReactElement {
    return (
      <Pressable onPress={() => onSelect(player)}>
        <PlayerListItem player={player} right={renderRightState(player)} subTitle={renderSubTitle(player)} />
      </Pressable>
    )
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: 16 }}>
      <Pressable style={[cardStyles.card, { backgroundColor: colors.primary }]} onPress={() => setModalVisible('aceUserIds')}>
        <Text style={cardStyles.cardSecondaryText}>Ace Pot</Text>
        <Text style={cardStyles.cardPrimaryText}>{penniesToUSD(aceInPennies)}</Text>
        {aceWinnerUserIds.length > 0 && (
          <View style={{ gap: 2, paddingVertical: 8 }}>
            <StackedPlayerImages playerIds={aceWinnerUserIds} />
          </View>
        )}
        {aceWinnerUserIds.length > 1 && (
          <Text style={cardStyles.cardSecondaryText}>
            {penniesToUSD(calculatePayoutSplit(aceInPennies, aceWinnerUserIds.length))}
            / each
          </Text>
        )}
      </Pressable>

      <Pressable style={[cardStyles.card, { backgroundColor: colors.primary }]} onPress={() => setModalVisible('ctpUserIds')}>
        <Text style={cardStyles.cardSecondaryText}>CTP Pool</Text>
        <Text style={cardStyles.cardPrimaryText}>{penniesToUSD(ctpInPennies)}</Text>
        {ctpWinnerUserIds.length > 0 && (
          <View style={{ gap: 2, paddingVertical: 8 }}>
            <StackedPlayerImages playerIds={ctpWinnerUserIds} />
          </View>
        )}
        {ctpWinnerUserIds.length > 1 && (
          <Text style={cardStyles.cardSecondaryText}>
            {penniesToUSD(calculatePayoutSplit(ctpInPennies, ctpWinnerUserIds.length))}
            / each
          </Text>
        )}
      </Pressable>

      <PlayersModal
        players={eventPlayers}
        visible={modalVisible !== null}
        renderItem={renderItem}
        onDismiss={() => setModalVisible(null)}
        style={styles.modalContent}
        keyExtractor={(item) => item.id}
        onSelect={handlePlayerSelect}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    height: 380,
  },
})

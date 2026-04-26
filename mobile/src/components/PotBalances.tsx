import { cardStyles } from '@/theme/card'
import { colors } from '@/theme/colors'
import { calculatePayoutSplit, penniesToUSD, Event, calculateEventCtpPot, calculateEventAcePot, EventPlayerRequest } from '@birdogey/shared'
import { View, Text } from 'react-native'
import { StackedPlayerImages } from '@/components/StackedPlayerImages'
import { useMemo } from 'react'

type PotBalancesProps = {
  event?: Event,
  eventPlayers: EventPlayerRequest[],
}

export function PotBalances({ event, eventPlayers }: PotBalancesProps): React.ReactNode {
  const ctpWinnerUserIds = useMemo(() => event?.ctpUserIds ?? [], [event])
  const aceWinnerUserIds = useMemo(() => event?.aceUserIds ?? [], [event])
  const ctpUsers = useMemo(() => eventPlayers.filter((player) => player.inForCtp), [eventPlayers])
  const aceUsers = useMemo(() => eventPlayers.filter((player) => player.inForAce), [eventPlayers])
  const ctpStartingBalance = useMemo(() => event?.ctpStartingBalance ?? 0 / 100, [event])
  const aceStartingBalance = useMemo(() => event?.aceStartingBalance ?? 0 / 100, [event])
  const ctpPerPlayer = useMemo(() => event?.ctpPerPlayer ?? 0 / 100, [event])
  const acePerPlayer = useMemo(() => event?.acePerPlayer ?? 0 / 100, [event])

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

  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: 16 }}>
      <View style={[cardStyles.card, { backgroundColor: colors.primary }]}>
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
      </View>

      <View style={[cardStyles.card, { backgroundColor: colors.primary }]}>
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
      </View>
    </View>
  )
}

import { EventPlayerRequest, UseUDiscImport, UserRequest, UserSeason, udisc } from '@birdogey/shared'
import { MaybeRefOrGetter, reactive, toValue } from 'vue'

export function useUDiscImport(players: MaybeRefOrGetter<UserSeason[]>, eventPlayers: MaybeRefOrGetter<EventPlayerRequest[]>): UseUDiscImport {
  const notInBirdogey = reactive<{ name: string, username: string }[]>([])
  const unmatchedInEvent = reactive<{ userId: string, userName: string }[]>([])
  const scores = reactive(new Map<string, number>())
  const missingMetadata = reactive(new Map<string, Partial<UserRequest>>())

  function reset(): void {
    notInBirdogey.splice(0, notInBirdogey.length)
    unmatchedInEvent.splice(0, unmatchedInEvent.length)
    scores.clear()
    missingMetadata.clear()
  }

  async function parseFile(data: ArrayBuffer): Promise<void> {
    const playersValue = toValue(players)
    const eventPlayersValue = toValue(eventPlayers)
    const rows = udisc.parseFile(data)
    const matchedUserIds = new Set<string>()

    for (const row of rows) {
      const rowPdgaNumber = udisc.toPdgaString(row.pdga_number)
      const trimmedUsername = row.username?.trim()
      const rowUsername = trimmedUsername !== '' ? trimmedUsername : undefined
      const rowNameNormalized = udisc.normalizeName(row.name ?? '')

      let matched: UserSeason | undefined

      if (rowUsername) {
        matched = playersValue.find((player) => player.udiscId === rowUsername)
      }

      if (!matched && rowPdgaNumber) {
        matched = playersValue.find((player) => player.pdgaNumber === rowPdgaNumber)
      }

      if (!matched && rowNameNormalized) {
        matched = playersValue.find((player) => udisc.normalizeName(player.name) === rowNameNormalized)
      }

      if (!matched) {
        notInBirdogey.push({ name: row.name ?? '', username: rowUsername ?? '' })
        continue
      }

      const matchedPlayer = matched
      const isInEvent = eventPlayersValue.some(({ userId }) => userId === matchedPlayer.id)

      if (!isInEvent) {
        notInBirdogey.push({ name: row.name ?? '', username: rowUsername ?? '' })
        continue
      }

      matchedUserIds.add(matchedPlayer.id)
      scores.set(matchedPlayer.id, row.event_relative_score)

      const suggestion: Partial<UserRequest> = { name: matchedPlayer.name }
      let hasSuggestion = false

      if (!matchedPlayer.udiscId && rowUsername) {
        suggestion.udiscId = rowUsername
        hasSuggestion = true
      }

      if (!matchedPlayer.pdgaNumber && rowPdgaNumber) {
        suggestion.pdgaNumber = rowPdgaNumber
        hasSuggestion = true
      }

      if (hasSuggestion) {
        missingMetadata.set(matchedPlayer.id, suggestion)
      }

      unmatchedInEvent.splice(0, unmatchedInEvent.length, ...eventPlayersValue
        .filter(({ userId }) => !matchedUserIds.has(userId))
        .map(({ userId }) => ({
          userId,
          userName: playersValue.find((player) => player.id === userId)?.name ?? userId,
        })))
    }
  }

  return { scores, notInBirdogey, unmatchedInEvent, missingMetadata, parseFile, reset }
}

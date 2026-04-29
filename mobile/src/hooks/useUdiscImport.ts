import { EventPlayerRequest, udisc, UserRequest, UserSeason, UseUDiscImport } from '@birdogey/shared'
import { useState } from 'react'

export function useUDiscImport(players: UserSeason[], eventPlayers: EventPlayerRequest[]): UseUDiscImport {
  const [notInBirdogey, setNotInBirdogey] = useState<{ name: string, username: string }[]>([])
  const [unmatchedInEvent, setUnmatchedInEvent] = useState<{ userId: string, userName: string }[]>([])
  const [scores, setScores] = useState<Map<string, number>>(new Map())
  const [missingMetadata, setMissingMetadata] = useState<Map<string, Partial<UserRequest>>>(new Map())

  function reset(): void {
    setNotInBirdogey([])
    setUnmatchedInEvent([])
    setScores(new Map())
    setMissingMetadata(new Map())
  }

  async function parseFile(file: File): Promise<void> {
    const rows = await udisc.parseFile(file)
    const matchedUserIds = new Set<string>()

    for (const row of rows) {
      const rowPdgaNumber = udisc.toPdgaString(row.pdga_number)
      const trimmedUsername = row.username?.trim()
      const rowUsername = trimmedUsername !== '' ? trimmedUsername : undefined
      const rowNameNormalized = udisc.normalizeName(row.name ?? '')

      let matched: UserSeason | undefined

      if (rowUsername) {
        matched = players.find((player) => player.udiscId === rowUsername)
      }

      if (!matched && rowPdgaNumber) {
        matched = players.find((player) => player.pdgaNumber === rowPdgaNumber)
      }

      if (!matched && rowNameNormalized) {
        matched = players.find((player) => udisc.normalizeName(player.name) === rowNameNormalized)
      }

      if (!matched) {
        notInBirdogey.push({ name: row.name ?? '', username: rowUsername ?? '' })
        continue
      }

      const matchedPlayer = matched
      const isInEvent = eventPlayers.some(({ userId }) => userId === matchedPlayer.id)

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

      unmatchedInEvent.splice(0, unmatchedInEvent.length, ...eventPlayers
        .filter(({ userId }) => !matchedUserIds.has(userId))
        .map(({ userId }) => ({
          userId,
          userName: players.find((player) => player.id === userId)?.name ?? userId,
        })))
    }
  }

  return {
    scores,
    notInBirdogey,
    unmatchedInEvent,
    missingMetadata,
    parseFile,
    reset,
  }
}

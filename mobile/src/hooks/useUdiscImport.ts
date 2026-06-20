import { EventPlayerRequest, udisc, UserRequest, UserSeason, UseUDiscImport } from '@birdogey/shared'
import { useState } from 'react'

export function useUDiscImport(players: UserSeason[], eventPlayers: EventPlayerRequest[]): UseUDiscImport {
  const [notInBirdogey, setNotInBirdogey] = useState<{ name: string, username: string }[]>([])
  const [notInEvent, setNotInEvent] = useState<{ userId: string, userName: string, score: number, udiscId?: string, pdgaNumber?: string }[]>([])
  const [unmatchedInEvent, setUnmatchedInEvent] = useState<{ userId: string, userName: string }[]>([])
  const [scores, setScores] = useState<Map<string, number>>(new Map())
  const [missingMetadata, setMissingMetadata] = useState<Map<string, Partial<UserRequest>>>(new Map())

  function reset(): void {
    setNotInBirdogey([])
    setNotInEvent([])
    setUnmatchedInEvent([])
    setScores(new Map())
    setMissingMetadata(new Map())
  }

  function addToEvent(userId: string): void {
    const entry = notInEvent.find((entry) => entry.userId === userId)
    if (!entry) return

    scores.set(userId, entry.score)

    const player = players.find((player) => player.id === userId)
    if (player) {
      const suggestion: Partial<UserRequest> = { name: player.name }
      let hasSuggestion = false

      if (!player.udiscId && entry.udiscId) {
        suggestion.udiscId = entry.udiscId
        hasSuggestion = true
      }

      if (!player.pdgaNumber && entry.pdgaNumber) {
        suggestion.pdgaNumber = entry.pdgaNumber
        hasSuggestion = true
      }

      if (hasSuggestion) {
        missingMetadata.set(userId, suggestion)
      }
    }

    setNotInEvent(notInEvent.filter((entry) => entry.userId !== userId))
  }

  async function parseFile(data: ArrayBuffer): Promise<void> {
    const rows = udisc.parseFile(data)
    const matchedUserIds = new Set<string>()
    const newNotInEvent: typeof notInEvent = []

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
        newNotInEvent.push({ userId: matchedPlayer.id, userName: matchedPlayer.name, score: row.event_relative_score, udiscId: rowUsername, pdgaNumber: rowPdgaNumber })
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

    setNotInEvent(newNotInEvent)
  }

  return {
    scores,
    notInBirdogey,
    notInEvent,
    unmatchedInEvent,
    missingMetadata,
    parseFile,
    addToEvent,
    reset,
  }
}

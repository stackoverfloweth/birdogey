import { read, utils } from 'xlsx'
import type { EventPlayerRequest, UserRequest, UserSeason } from '@birdogey/shared'
import { MaybeRefOrGetter, reactive, toValue } from 'vue'

type UDiscRow = {
  name: string | null,
  username: string | null,
  pdga_number: string | number | null,
  event_relative_score: number,
}

export type UDiscMissingMetadata = Map<string, Partial<UserRequest>>

export type UseUDiscImport = {
  scores: Map<string, number>,
  notInBirdogey: { name: string, username: string }[],
  unmatchedInEvent: { userId: string, userName: string }[],
  missingMetadata: UDiscMissingMetadata,
  parseFile: (file: File) => Promise<void>,
  reset: () => void,
}

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

  async function parseFile(file: File): Promise<void> {
    const playersValue = toValue(players)
    const eventPlayersValue = toValue(eventPlayers)
    const rows = await parseUDiscFile(file)
    const matchedUserIds = new Set<string>()

    for (const row of rows) {
      const rowPdgaNumber = toPdgaString(row.pdga_number)
      const trimmedUsername = row.username?.trim()
      const rowUsername = trimmedUsername !== '' ? trimmedUsername : undefined
      const rowNameNormalized = normalizeName(row.name ?? '')

      let matched: UserSeason | undefined

      if (rowUsername) {
        matched = playersValue.find((player) => player.udiscId === rowUsername)
      }

      if (!matched && rowPdgaNumber) {
        matched = playersValue.find((player) => player.pdgaNumber === rowPdgaNumber)
      }

      if (!matched && rowNameNormalized) {
        matched = playersValue.find((player) => normalizeName(player.name) === rowNameNormalized)
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

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

function toPdgaString(value: string | number | null | undefined): string | undefined {
  if (value === null || value === undefined || value === 0) {
    return undefined
  }
  const str = String(value).trim()
  return str !== '' ? str : undefined
}

function parseUDiscFile(file: File): Promise<UDiscRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = event.target?.result
        const workbook = read(data, { type: 'array' })

        if (!workbook.SheetNames.includes('Event results')) {
          reject(new Error('Sheet "Event results" not found in the uploaded file'))
          return
        }

        const sheet = workbook.Sheets['Event results']
        const rows = utils.sheet_to_json<UDiscRow>(sheet, { defval: null })
        resolve(rows)
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)))
      }
    }

    reader.onerror = () => reject(new Error(reader.error?.message ?? 'File read failed'))
    reader.readAsArrayBuffer(file)
  })
}

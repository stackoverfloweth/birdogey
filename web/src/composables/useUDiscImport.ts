import { read, utils } from 'xlsx'
import type { EventPlayerRequest, UserSeason } from '@birdogey/shared'

interface UDiscRow {
  name: string | null,
  username: string | null,
  pdga_number: string | number | null,
  event_relative_score: number,
}

export type UDiscScorePatch = {
  userId: string,
  score: number,
}

export type UDiscMissingMetadata = {
  userId: string,
  userName: string,
  suggestedUdiscId?: string,
  suggestedPdgaNumber?: string,
}

export type UDiscImportResult = {
  scorePatches: UDiscScorePatch[],
  notInBirdogey: { name: string, username: string }[],
  unmatchedInEvent: { userId: string, userName: string }[],
  missingMetadata: UDiscMissingMetadata[],
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

export function parseUDiscFile(file: File): Promise<UDiscRow[]> {
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

export function processUDiscImport(
  rows: UDiscRow[],
  players: UserSeason[],
  eventPlayers: EventPlayerRequest[],
): UDiscImportResult {
  const scorePatches: UDiscScorePatch[] = []
  const notInBirdogey: { name: string, username: string }[] = []
  const missingMetadata: UDiscMissingMetadata[] = []
  const matchedUserIds = new Set<string>()

  for (const row of rows) {
    const rowPdgaNumber = toPdgaString(row.pdga_number)
    const trimmedUsername = row.username?.trim()
    const rowUsername = trimmedUsername !== '' ? trimmedUsername : undefined
    const rowNameNormalized = normalizeName(row.name ?? '')

    let matched: UserSeason | undefined

    if (rowUsername) {
      matched = players.find((player) => player.udiscId === rowUsername)
    }

    if (!matched && rowPdgaNumber) {
      matched = players.find((player) => player.pdgaNumber === rowPdgaNumber)
    }

    if (!matched && rowNameNormalized) {
      matched = players.find((player) => normalizeName(player.name) === rowNameNormalized)
    }

    if (!matched) {
      notInBirdogey.push({ name: row.name ?? '', username: rowUsername ?? '' })
      continue
    }

    const matchedPlayer = matched
    const isInEvent = eventPlayers.some((ep) => ep.userId === matchedPlayer.id)

    if (!isInEvent) {
      notInBirdogey.push({ name: row.name ?? '', username: rowUsername ?? '' })
      continue
    }

    matchedUserIds.add(matchedPlayer.id)
    scorePatches.push({ userId: matchedPlayer.id, score: row.event_relative_score })

    const suggestion: UDiscMissingMetadata = { userId: matchedPlayer.id, userName: matchedPlayer.name }
    let hasSuggestion = false

    if (!matchedPlayer.udiscId && rowUsername) {
      suggestion.suggestedUdiscId = rowUsername
      hasSuggestion = true
    }

    if (!matchedPlayer.pdgaNumber && rowPdgaNumber) {
      suggestion.suggestedPdgaNumber = rowPdgaNumber
      hasSuggestion = true
    }

    if (hasSuggestion) {
      missingMetadata.push(suggestion)
    }
  }

  const unmatchedInEvent = eventPlayers
    .filter((ep) => !matchedUserIds.has(ep.userId))
    .map((ep) => ({
      userId: ep.userId,
      userName: players.find((player) => player.id === ep.userId)?.name ?? ep.userId,
    }))

  return { scorePatches, notInBirdogey, unmatchedInEvent, missingMetadata }
}

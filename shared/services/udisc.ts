import { read, utils } from 'xlsx'
import { UserRequest } from '../models/api'

export type UDiscMissingMetadata = Map<string, Partial<UserRequest>>

export type UseUDiscImport = {
  scores: Map<string, number>,
  notInBirdogey: { name: string, username: string }[],
  unmatchedInEvent: { userId: string, userName: string }[],
  missingMetadata: UDiscMissingMetadata,
  parseFile: (data: ArrayBuffer) => Promise<void>,
  reset: () => void,
}

export type UDiscRow = {
  name: string | null,
  username: string | null,
  pdga_number: string | number | null,
  event_relative_score: number,
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

function parseFile(data: ArrayBuffer): UDiscRow[] {
  const workbook = read(data, { type: 'array' })

  if (!workbook.SheetNames.includes('Event results')) {
    throw new Error('Sheet "Event results" not found in the uploaded file')
  }

  const sheet = workbook.Sheets['Event results']
  return utils.sheet_to_json<UDiscRow>(sheet, { defval: null })
}

export const udisc = {
  normalizeName,
  toPdgaString,
  parseFile,
}

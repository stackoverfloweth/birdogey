import { read, utils } from 'xlsx'
import { UserRequest } from '../models/api'

export type UDiscMissingMetadata = Map<string, Partial<UserRequest>>

export type UseUDiscImport = {
  scores: Map<string, number>,
  notInBirdogey: { name: string, username: string }[],
  unmatchedInEvent: { userId: string, userName: string }[],
  missingMetadata: UDiscMissingMetadata,
  parseFile: (file: File) => Promise<void>,
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

function parseFile(file: File): Promise<UDiscRow[]> {
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

export const udisc = {
  normalizeName,
  toPdgaString,
  parseFile,
}

import { z } from 'zod'
import { optionalNumber, requiredNumber } from './helpers'

export const eventPlayerSchema = z.object({
  userId: z.string()
    .nonempty({ message: 'User is required' }),
  inForCtp: z.boolean().optional(),
  inForAce: z.boolean().optional(),
  score: optionalNumber,
  incomingTagId: requiredNumber('Incoming tag is required'),
  outgoingTagId: optionalNumber,
})

export type EventPlayerSchemaInput = z.input<typeof eventPlayerSchema>
export type EventPlayerSchema = z.output<typeof eventPlayerSchema>

export const eventSchema = z.object({
  seasonId: z.string()
    .nonempty({ message: 'Season is required' }),
  name: z.string()
    .nonempty({ message: 'Name is required' }),
  notes: z.string().optional(),
  completed: z.date().optional(),
  players: z.array(eventPlayerSchema).optional(),
  ctpStartingBalance: optionalNumber,
  aceStartingBalance: optionalNumber,
  ctpPerPlayer: optionalNumber,
  acePerPlayer: optionalNumber,
  ctpUserIds: z.array(z.string()).optional(),
  aceUserIds: z.array(z.string()).optional(),
  ctpHole: optionalNumber,
})

export type EventSchemaInput = z.input<typeof eventSchema>
export type EventSchema = z.output<typeof eventSchema>

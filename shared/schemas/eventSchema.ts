import { z } from 'zod'

const dollarsToCents = z.number().optional()
  .transform((value) => (value == null ? undefined : Math.round(value * 100)))

export const eventPlayerSchema = z.object({
  userId: z.string()
    .nonempty({ message: 'User is required' }),
  inForCtp: z.boolean().optional(),
  inForAce: z.boolean().optional(),
  score: z.number().optional(),
  incomingTagId: z.number({ message: 'Incoming tag is required' }),
  outgoingTagId: z.number().optional(),
})

export type EventPlayerSchemaInput = z.input<typeof eventPlayerSchema>
export type EventPlayerSchema = z.output<typeof eventPlayerSchema>

export const eventSchema = z.object({
  notes: z.string().optional(),
  completed: z.date().optional(),
  players: z.array(eventPlayerSchema).optional(),
  ctpStartingBalance: dollarsToCents,
  aceStartingBalance: dollarsToCents,
  ctpPerPlayer: dollarsToCents,
  acePerPlayer: dollarsToCents,
  ctpUserIds: z.array(z.string()).optional(),
  aceUserIds: z.array(z.string()).optional(),
  ctpHole: z.number().optional(),
})

export type EventSchemaInput = z.input<typeof eventSchema>
export type EventSchema = z.output<typeof eventSchema>

import { z } from 'zod'

export const eventPlayerSchema = z.object({
  userId: z.string()
    .nonempty({ message: 'User is required' }),
  inForCtp: z.boolean().optional(),
  inForAce: z.boolean().optional(),
  score: z.number().optional(),
  incomingTagId: z.number({ message: 'Incoming tag is required' }),
  outgoingTagId: z.number().optional(),
})

export type EventPlayerSchema = z.infer<typeof eventPlayerSchema>

export const eventSchema = z.object({
  seasonId: z.string()
    .nonempty({ message: 'Season is required' }),
  name: z.string()
    .nonempty({ message: 'Name is required' }),
  notes: z.string().optional(),
  completed: z.date().optional(),
  players: z.array(eventPlayerSchema).optional(),
  ctpStartingBalance: z.number().optional(),
  aceStartingBalance: z.number().optional(),
  ctpPerPlayer: z.number().optional(),
  acePerPlayer: z.number().optional(),
  ctpUserIds: z.array(z.string()).optional(),
  aceUserIds: z.array(z.string()).optional(),
  ctpHole: z.number().optional(),
})

export type EventSchema = z.infer<typeof eventSchema>

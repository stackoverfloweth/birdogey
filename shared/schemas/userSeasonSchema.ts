import { z } from 'zod'

export const userSeasonSchema = z.object({
  seasonId: z.string()
    .nonempty({ message: 'Season is required' }),
  tagId: z.number().optional(),
  entryPaid: z.boolean().optional(),
})

export type UserSeasonSchemaInput = z.input<typeof userSeasonSchema>
export type UserSeasonSchema = z.output<typeof userSeasonSchema>

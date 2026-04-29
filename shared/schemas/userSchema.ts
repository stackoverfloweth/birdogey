import { z } from 'zod'

export const userSchema = z.object({
  name: z.string()
    .nonempty({ message: 'Name is required' }),
  udiscId: z.string().optional(),
  pdgaNumber: z.string().optional(),
  imageUrl: z.string().optional(),
  seasonId: z.string().optional(),
  tagId: z.number().optional(),
  entryPaid: z.boolean().optional(),
})

export type UserSchemaInput = z.input<typeof userSchema>
export type UserSchema = z.output<typeof userSchema>

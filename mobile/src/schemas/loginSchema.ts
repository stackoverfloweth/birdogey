import { z } from 'zod'

export const loginSchema = z.object({
  phoneNumber: z.string()
    .nonempty({ message: 'Phone number is required' })
    .regex(/^\d{10}$/, { message: 'Invalid phone number' }),
})

export type LoginSchema = z.infer<typeof loginSchema>

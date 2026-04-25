import { z } from 'zod'

export const loginPhoneSchema = z.object({
  phoneNumber: z.string()
    .nonempty({ message: 'Phone number is required' })
    .regex(/^\d{10}$/, { message: 'Invalid phone number' }),
})

export type LoginPhoneSchema = z.infer<typeof loginPhoneSchema>

export const loginCodeSchema = z.object({
  code: z.string()
    .nonempty({ message: 'Code is required' }),
})

export type LoginCodeSchema = z.infer<typeof loginCodeSchema>

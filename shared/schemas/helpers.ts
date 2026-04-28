import { z } from 'zod'

export const optionalNumber = z.string().optional()
  .transform((value, ctx) => {
    if (!value) return undefined
    const parsed = Number(value)
    if (Number.isNaN(parsed)) {
      ctx.addIssue({ code: 'custom', message: 'Must be a number' })
      return z.NEVER
    }
    return parsed
  })

export const requiredNumber = (message: string) => z.string()
  .nonempty({ message })
  .transform((value, ctx) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) {
      ctx.addIssue({ code: 'custom', message: 'Must be a number' })
      return z.NEVER
    }
    return parsed
  })

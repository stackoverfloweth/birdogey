import { HttpError, JwtPayload } from '../types.js'

export function checkAdmin({ isAdmin }: JwtPayload): void {
  if (!isAdmin) {
    throw new HttpError(403, 'Admin access required')
  }
}

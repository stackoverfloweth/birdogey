import { HttpError } from '../types/httpError'
import { JwtPayload } from './jwt'

export function checkSeasonAccess(seasonId: string, { isAdmin, seasons }: JwtPayload): void {
  if (!isAdmin && !seasons.some((season) => season._id.toString() === seasonId)) {
    throw new HttpError(403, 'Not authorized to access this season')
  }
}

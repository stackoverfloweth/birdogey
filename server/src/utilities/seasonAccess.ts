import { HttpError, JwtPayload } from '../types.js'

export function checkSeasonAccess(seasonId: string, { role, seasons }: JwtPayload): void {
  if (role !== 'admin' && !seasons.some((season) => season._id.toString() === seasonId)) {
    throw new HttpError(403, 'Not authorized to access this season')
  }
}

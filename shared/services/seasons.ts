import { Season } from '../models/season'

export function getNextCtpHole(previous?: number, season?: Season): number | undefined {
  if (!previous) {
    return 1
  }

  const next = previous + 1

  if (next > (season?.course.holeCount ?? 18)) {
    return 1
  }

  return next
}

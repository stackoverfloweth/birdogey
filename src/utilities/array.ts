export function isSame(aArray: unknown[], bArray: unknown[]): boolean {
  return JSON.stringify(aArray) === JSON.stringify(bArray)
}
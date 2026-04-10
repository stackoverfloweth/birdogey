export function isNumber(value: unknown): value is string {
  if (typeof value !== 'string') return false

  return (
    // @ts-expect-error this function DOES accept strings
    !isNaN(value) // less forgiving than parseFloat, which will find a number inside an otherwise invalid string
    && !isNaN(parseFloat(value)) // some circumstances isNaN will return false but parseFloat returns NaN like whitespace
  )
}

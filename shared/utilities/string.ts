export function pluralize(
  count: number,
  word: string,
  locale?: string,
): string
export function pluralize(
  count: number,
  words: [single: string, plural: string],
  locale?: string,
): string
export function pluralize(
  count: number,
  words: string | [single: string, plural: string],
  locale = 'en',
): string {
  if (typeof words === 'string') {
    return pluralize(count, [words, `${words}s`], locale)
  }

  const rule = new Intl.PluralRules(locale).select(count)
  const [single, plural] = words

  return rule === 'one' ? single : plural
}

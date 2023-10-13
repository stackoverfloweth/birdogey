export function fromKebabCase(value: string): string
export function fromKebabCase(value?: string): string | undefined
export function fromKebabCase(value?: string): string | undefined {
  return value?.replace(/-/g, ' ')
}

export function capitalize(value: string): string {
  return value.replace(/\b\w/g, letter => letter.toUpperCase())
}
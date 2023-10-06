export type Typeof = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'

export function isValidRequest<T>(target: unknown, properties: [PropertyKey, Typeof][]): target is T {
  return isRecord(target) && properties.every(([key, type]) => {
    console.log(key, type, typeof target[key])

    return isKeyOfT(target, key) && typeof target[key] === type
  })
}

export function isRecord(target: unknown): target is Record<PropertyKey, unknown> {
  return !!target && typeof target === 'object'
}

export function isKeyOfT<T extends Record<PropertyKey, unknown>>(target: T, key: PropertyKey): key is keyof T {
  return key in target
}
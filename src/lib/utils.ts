import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isDefined = <T>(value: T) => value !== null && value !== undefined

export const filterObject = <T extends Record<string, unknown>>(
  object: T,
  filter: <K extends keyof T>(key: K, item: T[K]) => boolean
) => {
  const out = {} as Partial<T>

  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) continue

    if (filter(key as keyof T, object[key])) out[key] = object[key]
  }

  return out
}

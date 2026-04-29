// Tiny `useState` clone that mirrors writes into localStorage so the value
// survives a reload. Used for UI prefs (theme toggles, last-selected season,
// favorite teams) — for richer state we use IndexedDB via lib/db.
import { useState, useCallback } from 'react'

// Persistent state hook. Reads on mount; writes back on every set. Failures
// (quota exceeded, private mode) are swallowed so the UI keeps working.
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value)
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // Silently fail if localStorage is full or unavailable
      }
    },
    [key]
  )

  return [storedValue, setValue]
}

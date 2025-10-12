import type { CookiePreferences, CookieCategory } from '@/types/cookie-consent'

const STORAGE_KEY = 'cookie-consent'

export interface StoredConsent {
  preferences: CookiePreferences
  timestamp: number
}

/**
 * Save cookie consent preferences to localStorage
 */
export function saveCookieConsent(preferences: CookiePreferences): void {
  const consent: StoredConsent = {
    preferences,
    timestamp: Date.now(),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
  } catch (error) {
    console.error('Failed to save cookie consent:', error)
  }
}

/**
 * Retrieve cookie consent preferences from localStorage
 */
export function getCookieConsent(): StoredConsent | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as StoredConsent
    return parsed
  } catch (error) {
    console.error('Failed to retrieve cookie consent:', error)
    return null
  }
}

/**
 * Check if user has responded to the cookie banner
 */
export function hasUserResponded(): boolean {
  const consent = getCookieConsent()
  return consent !== null
}

/**
 * Enable cookies for a specific category
 */
export function enableCookies(category: CookieCategory): void {
  const consent = getCookieConsent()
  if (consent) {
    const updatedPreferences = {
      ...consent.preferences,
      [category]: true,
    }
    saveCookieConsent(updatedPreferences)
  }
}

/**
 * Disable cookies for a specific category (except necessary)
 */
export function disableCookies(category: CookieCategory): void {
  // Necessary cookies cannot be disabled
  if (category === 'necessary') {
    console.warn('Necessary cookies cannot be disabled')
    return
  }

  const consent = getCookieConsent()
  if (consent) {
    const updatedPreferences = {
      ...consent.preferences,
      [category]: false,
    }
    saveCookieConsent(updatedPreferences)
  }
}

/**
 * Clear all cookie consent data
 */
export function clearCookieConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear cookie consent:', error)
  }
}

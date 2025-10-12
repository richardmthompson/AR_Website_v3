export type CookieCategory = 'necessary' | 'analytics' | 'marketing'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export interface CookieConsentState {
  showBanner: boolean
  showSettings: boolean
  preferences: CookiePreferences
  hasResponded: boolean
}

export interface CookieConsentActions {
  acceptAll: () => void
  rejectAll: () => void
  savePreferences: (preferences: CookiePreferences) => void
  openSettings: () => void
  closeBanner: () => void
  closeSettings: () => void
}

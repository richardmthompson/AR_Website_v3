import * as React from 'react'
import type { CookiePreferences, CookieConsentState } from '@/types/cookie-consent'
import { getCookieConsent, saveCookieConsent, hasUserResponded } from '@/lib/cookie-utils'

// Action types for state management
const actionTypes = {
  SET_SHOW_BANNER: 'SET_SHOW_BANNER',
  SET_SHOW_SETTINGS: 'SET_SHOW_SETTINGS',
  SET_PREFERENCES: 'SET_PREFERENCES',
  ACCEPT_ALL: 'ACCEPT_ALL',
  REJECT_ALL: 'REJECT_ALL',
} as const

type ActionType = typeof actionTypes

type Action =
  | { type: ActionType['SET_SHOW_BANNER']; show: boolean }
  | { type: ActionType['SET_SHOW_SETTINGS']; show: boolean }
  | { type: ActionType['SET_PREFERENCES']; preferences: CookiePreferences }
  | { type: ActionType['ACCEPT_ALL'] }
  | { type: ActionType['REJECT_ALL'] }

// Reducer for state updates
function reducer(state: CookieConsentState, action: Action): CookieConsentState {
  switch (action.type) {
    case 'SET_SHOW_BANNER':
      return {
        ...state,
        showBanner: action.show,
      }

    case 'SET_SHOW_SETTINGS':
      return {
        ...state,
        showSettings: action.show,
      }

    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: action.preferences,
        hasResponded: true,
      }

    case 'ACCEPT_ALL':
      return {
        ...state,
        preferences: {
          necessary: true,
          analytics: true,
          marketing: true,
        },
        showBanner: false,
        showSettings: false,
        hasResponded: true,
      }

    case 'REJECT_ALL':
      return {
        ...state,
        preferences: {
          necessary: true,
          analytics: false,
          marketing: false,
        },
        showBanner: false,
        showSettings: false,
        hasResponded: true,
      }
  }
}

// Listener array for component subscriptions
const listeners: Array<(state: CookieConsentState) => void> = []

// Initialize state from localStorage or defaults
function getInitialState(): CookieConsentState {
  const userResponded = hasUserResponded()
  const storedConsent = getCookieConsent()

  return {
    showBanner: !userResponded,
    showSettings: false,
    preferences: storedConsent?.preferences || {
      necessary: true,
      analytics: false,
      marketing: false,
    },
    hasResponded: userResponded,
  }
}

// External state (outside React component lifecycle)
let memoryCookieState: CookieConsentState = getInitialState()

// Dispatcher pattern for state updates
function dispatch(action: Action) {
  memoryCookieState = reducer(memoryCookieState, action)

  // Persist preferences to localStorage when they change
  if (
    action.type === 'ACCEPT_ALL' ||
    action.type === 'REJECT_ALL' ||
    action.type === 'SET_PREFERENCES'
  ) {
    saveCookieConsent(memoryCookieState.preferences)
  }

  // Notify all listeners of state change
  listeners.forEach((listener) => {
    listener(memoryCookieState)
  })
}

// Public API for managing cookie consent
export function useCookieConsent() {
  const [state, setState] = React.useState<CookieConsentState>(memoryCookieState)

  React.useEffect(() => {
    // Register this component as a listener
    listeners.push(setState)

    // Cleanup: remove listener on unmount
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    acceptAll: () => dispatch({ type: 'ACCEPT_ALL' }),
    rejectAll: () => dispatch({ type: 'REJECT_ALL' }),
    savePreferences: (preferences: CookiePreferences) => {
      dispatch({ type: 'SET_PREFERENCES', preferences })
      dispatch({ type: 'SET_SHOW_SETTINGS', show: false })
      dispatch({ type: 'SET_SHOW_BANNER', show: false })
    },
    openSettings: () => {
      dispatch({ type: 'SET_SHOW_SETTINGS', show: true })
    },
    closeBanner: () => {
      dispatch({ type: 'SET_SHOW_BANNER', show: false })
    },
    closeSettings: () => {
      dispatch({ type: 'SET_SHOW_SETTINGS', show: false })
    },
  }
}

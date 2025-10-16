import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useCookieConsent } from '@/hooks/use-cookie-consent'
import { CookieDetails } from './CookieDetails'
import { cn } from '@/lib/utils'
import type { CookiePreferences } from '@/types/cookie-consent'

export function CookieSettings() {
  const { t } = useTranslation()
  const { showSettings, preferences, savePreferences, closeSettings } = useCookieConsent()

  // Local state for checkbox management
  const [localPreferences, setLocalPreferences] = React.useState<CookiePreferences>(preferences)

  // Sync local state with global state when dialog opens
  React.useEffect(() => {
    if (showSettings) {
      setLocalPreferences(preferences)
    }
  }, [showSettings, preferences])

  const handleSave = () => {
    savePreferences(localPreferences)
  }

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
  }

  const handleCheckboxChange = (category: keyof CookiePreferences, checked: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [category]: checked,
    }))
  }

  return (
    <Dialog open={showSettings} onOpenChange={(open) => !open && closeSettings()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('cookies.settings.title')}</DialogTitle>
          <DialogDescription>{t('cookies.settings.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Necessary Cookies */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="necessary"
                checked={true}
                disabled={true}
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor="necessary"
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    "cursor-pointer"
                  )}
                >
                  {t('cookies.settings.necessary.title')}
                </label>
                <p className="text-sm text-muted-foreground mt-1.5">
                  {t('cookies.settings.necessary.description')}
                </p>
                <span className="text-xs text-muted-foreground mt-1 inline-block">
                  {t('cookies.settings.alwaysEnabled')}
                </span>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="analytics"
                checked={localPreferences.analytics}
                onCheckedChange={(checked) => handleCheckboxChange('analytics', !!checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor="analytics"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {t('cookies.settings.analytics.title')}
                </label>
                <p className="text-sm text-muted-foreground mt-1.5">
                  {t('cookies.settings.analytics.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="marketing"
                checked={localPreferences.marketing}
                onCheckedChange={(checked) => handleCheckboxChange('marketing', !!checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label
                  htmlFor="marketing"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {t('cookies.settings.marketing.title')}
                </label>
                <p className="text-sm text-muted-foreground mt-1.5">
                  {t('cookies.settings.marketing.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Details */}
        <div className="border-t pt-4 mt-4">
          <CookieDetails />
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={handleSave}>
            {t('cookies.settings.savePreferences')}
          </Button>
          <Button onClick={handleAcceptAll}>
            {t('cookies.settings.acceptSelected')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

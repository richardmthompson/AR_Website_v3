import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { CookieSettings } from './CookieSettings'
import { useCookieConsent } from '@/hooks/use-cookie-consent'
import { cn } from '@/lib/utils'

export function CookieConsent() {
  const { t } = useTranslation()
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent()

  // Don't render if banner shouldn't be shown
  if (!showBanner) {
    return null
  }

  return (
    <>
      {/* Cookie Banner */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50",
          "bg-background/95 backdrop-blur-md",
          "border-t border-border shadow-lg",
          "animate-in slide-in-from-bottom duration-500"
        )}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6">
            {/* Text Content */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {t('cookies.banner.title')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('cookies.banner.message')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={rejectAll}
                className="w-full sm:w-auto"
              >
                {t('cookies.banner.rejectAll')}
              </Button>
              <Button
                variant="ghost"
                onClick={openSettings}
                className="w-full sm:w-auto"
              >
                {t('cookies.banner.customize')}
              </Button>
              <Button
                onClick={acceptAll}
                className="w-full sm:w-auto"
              >
                {t('cookies.banner.acceptAll')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <CookieSettings />
    </>
  )
}

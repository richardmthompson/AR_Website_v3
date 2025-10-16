import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';
import { CookieDetails } from '@/components/CookieDetails';

export default function CookiePolicyPage() {
  const { t } = useTranslation();
  const { openSettings } = useCookieConsent();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{t('cookiePolicy.title')}</h1>
            <p className="text-muted-foreground">{t('cookiePolicy.lastUpdated')}</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('cookiePolicy.introduction.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('cookiePolicy.introduction.content')}</p>
            </section>

            {/* What Are Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('cookiePolicy.whatAreCookies.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('cookiePolicy.whatAreCookies.content')}</p>
            </section>

            {/* How We Use Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('cookiePolicy.howWeUse.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('cookiePolicy.howWeUse.content')}</p>
            </section>

            {/* Cookie Categories */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('cookiePolicy.categories.title')}</h2>

              {/* Necessary Cookies */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{t('cookies.settings.necessary.title')}</h3>
                <p className="text-muted-foreground">{t('cookies.settings.necessary.description')}</p>
              </div>

              {/* Analytics Cookies */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{t('cookies.settings.analytics.title')}</h3>
                <p className="text-muted-foreground">{t('cookies.settings.analytics.description')}</p>
              </div>

              {/* Marketing Cookies */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{t('cookies.settings.marketing.title')}</h3>
                <p className="text-muted-foreground">{t('cookies.settings.marketing.description')}</p>
              </div>
            </section>

            {/* Detailed Cookie List */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('cookiePolicy.detailedList.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('cookiePolicy.detailedList.content')}</p>
              <div className="my-6">
                <CookieDetails />
              </div>
            </section>

            {/* Managing Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('cookiePolicy.managing.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('cookiePolicy.managing.content')}</p>
              <div className="my-4">
                <Button onClick={() => openSettings()} variant="default">
                  {t('cookiePolicy.managing.button')}
                </Button>
              </div>
            </section>

            {/* Browser Settings */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('cookiePolicy.browserSettings.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('cookiePolicy.browserSettings.content')}</p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('cookiePolicy.contact.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('cookiePolicy.contact.content')}</p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{t('privacy.contact.company')}</p>
                <p className="text-muted-foreground">{t('privacy.contact.email')}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

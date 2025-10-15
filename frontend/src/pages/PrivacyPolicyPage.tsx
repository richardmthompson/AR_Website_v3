import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const { openSettings } = useCookieConsent();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{t('privacy.title')}</h1>
            <p className="text-muted-foreground">{t('privacy.lastUpdated')}</p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.introduction.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('privacy.introduction.content')}</p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.collection.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('privacy.collection.content')}</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>{t('privacy.collection.items.personal')}</li>
                <li>{t('privacy.collection.items.usage')}</li>
                <li>{t('privacy.collection.items.technical')}</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.usage.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('privacy.usage.content')}</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>{t('privacy.usage.items.service')}</li>
                <li>{t('privacy.usage.items.communication')}</li>
                <li>{t('privacy.usage.items.improvement')}</li>
                <li>{t('privacy.usage.items.analytics')}</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.cookies.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('privacy.cookies.content')}</p>
              <div className="my-4">
                <Button onClick={() => openSettings()} variant="outline">
                  {t('privacy.cookies.manageButton')}
                </Button>
              </div>
            </section>

            {/* Data Storage and Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.security.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('privacy.security.content')}</p>
            </section>

            {/* Your Rights (GDPR) */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.rights.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('privacy.rights.content')}</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>{t('privacy.rights.items.access.title')}:</strong> {t('privacy.rights.items.access.description')}</li>
                <li><strong>{t('privacy.rights.items.rectification.title')}:</strong> {t('privacy.rights.items.rectification.description')}</li>
                <li><strong>{t('privacy.rights.items.erasure.title')}:</strong> {t('privacy.rights.items.erasure.description')}</li>
                <li><strong>{t('privacy.rights.items.portability.title')}:</strong> {t('privacy.rights.items.portability.description')}</li>
                <li><strong>{t('privacy.rights.items.objection.title')}:</strong> {t('privacy.rights.items.objection.description')}</li>
                <li><strong>{t('privacy.rights.items.restriction.title')}:</strong> {t('privacy.rights.items.restriction.description')}</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('privacy.contact.content')}</p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{t('privacy.contact.company')}</p>
                <p className="text-muted-foreground">{t('privacy.contact.email')}</p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.changes.title')}</h2>
              <p className="text-muted-foreground mb-4">{t('privacy.changes.content')}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

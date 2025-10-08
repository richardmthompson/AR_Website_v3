import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TrustIndicators() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({ hours: 0, productivity: 0, queries: 0, roi: 0 });

  useEffect(() => {
    const targets = { hours: 30, productivity: 66, queries: 85, roi: 500 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        hours: Math.round(targets.hours * progress),
        productivity: Math.round(targets.productivity * progress),
        queries: Math.round(targets.queries * progress),
        roi: Math.round(targets.roi * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(targets);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: counts.hours, label: t('trust.hoursSaved'), suffix: '+' },
    { value: counts.productivity, label: t('trust.productivityGain'), suffix: '%' },
    { value: counts.queries, label: t('trust.queriesAutomated'), suffix: '%' },
    { value: counts.roi, label: t('trust.roi'), suffix: '%' },
  ];

  return (
    <section className="py-20 lg:py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-trust-headline">
            {t('trust.headline')}
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto">
            {t('trust.subheadline')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 text-yellow-400" data-testid={`stat-${index}`}>
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm sm:text-base text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/20 pt-12">
          <h3 className="text-2xl font-semibold text-center mb-8">{t('trust.trustedBy')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {['Grant Thornton', 'Mengali Accountancy', 'WNS Travel-Tech', 'Microsoft Partner'].map((company, index) => (
              <div key={index} className="text-lg font-semibold" data-testid={`company-${index}`}>
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

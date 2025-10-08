import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-accent-cream/50 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6" data-testid="text-cta-headline">
          {t('cta.headline')}
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('cta.subheadline')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" className="group" data-testid="button-schedule-audit-cta">
            <Calendar className="mr-2 w-5 h-5" />
            {t('cta.scheduleAudit')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" data-testid="button-download-playbook">
            {t('cta.downloadPlaybook')}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>{t('cta.noObligation')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>{t('cta.duration')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>{t('cta.customROI')}</span>
          </div>
        </div>

        <div className="mt-8 p-4 bg-accent-cream/50 rounded-lg border border-accent-cream">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{t('cta.guarantee')}</span> {t('cta.guaranteeText')}
          </p>
        </div>
      </div>
    </section>
  );
}

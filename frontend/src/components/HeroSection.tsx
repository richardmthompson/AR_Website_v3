import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import heroImage from '@assets/images/AI_automation_network_hero_visual_656dfdf1.png';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6" data-testid="text-hero-headline">
              {t('hero.headline')}
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-2xl" data-testid="text-hero-subheadline">
              {t('hero.subheadline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group bg-background text-foreground hover:bg-background/90" data-testid="button-schedule-audit">
                {t('hero.scheduleAudit')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-see-how-it-works">
                {t('hero.seeHowItWorks')}
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                <span>{t('hero.noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                <span>{t('hero.quickSetup')}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-lg blur-3xl -z-10" />
              <img
                src={heroImage}
                alt="AI Automation Network Visualization"
                className="rounded-lg shadow-2xl"
                data-testid="img-hero-visual"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

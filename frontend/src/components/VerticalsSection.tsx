import { useTranslation } from 'react-i18next';
import VerticalCard from './VerticalCard';
import { Calculator, ShoppingCart, GraduationCap } from 'lucide-react';
import accountingImage from '@assets/images/Accounting_automation_illustration_a101f360.png';
import ecommerceImage from '@assets/images/E-commerce_automation_illustration_1bd21796.png';
import educationImage from '@assets/images/Education_automation_illustration_2882b70d.png';

export default function VerticalsSection() {
  const { t } = useTranslation();

  const verticals = [
    {
      title: t('verticals.accounting.title'),
      description: t('verticals.accounting.description'),
      painPoints: [
        t('verticals.accounting.painPoints.1'),
        t('verticals.accounting.painPoints.2'),
        t('verticals.accounting.painPoints.3'),
      ],
      results: [
        t('verticals.accounting.results.1'),
        t('verticals.accounting.results.2'),
        t('verticals.accounting.results.3'),
      ],
      icon: <Calculator className="w-8 h-8" />,
      accentColor: 'bg-vertical-accounting',
      image: accountingImage,
    },
    {
      title: t('verticals.ecommerce.title'),
      description: t('verticals.ecommerce.description'),
      painPoints: [
        t('verticals.ecommerce.painPoints.1'),
        t('verticals.ecommerce.painPoints.2'),
        t('verticals.ecommerce.painPoints.3'),
      ],
      results: [
        t('verticals.ecommerce.results.1'),
        t('verticals.ecommerce.results.2'),
        t('verticals.ecommerce.results.3'),
      ],
      icon: <ShoppingCart className="w-8 h-8" />,
      accentColor: 'bg-vertical-ecommerce',
      image: ecommerceImage,
    },
    {
      title: t('verticals.education.title'),
      description: t('verticals.education.description'),
      painPoints: [
        t('verticals.education.painPoints.1'),
        t('verticals.education.painPoints.2'),
        t('verticals.education.painPoints.3'),
      ],
      results: [
        t('verticals.education.results.1'),
        t('verticals.education.results.2'),
        t('verticals.education.results.3'),
      ],
      icon: <GraduationCap className="w-8 h-8" />,
      accentColor: 'bg-vertical-education',
      image: educationImage,
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-accent-cream/30" id="industries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4" data-testid="text-verticals-headline">
            {t('verticals.headline')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('verticals.subheadline')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {verticals.map((vertical, index) => (
            <VerticalCard
              key={index}
              {...vertical}
              onLearnMore={() => console.log(`Learn more: ${vertical.title}`)}
              onTalkToExpert={() => console.log(`Talk to expert: ${vertical.title}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

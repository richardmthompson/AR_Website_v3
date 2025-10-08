import { Brain, Database, Link2, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SolutionsSection() {
  const { t } = useTranslation();

  const solutions = [
    {
      icon: <Brain className="w-12 h-12 text-primary" />,
      title: t('solutions.ipa.title'),
      description: t('solutions.ipa.description'),
      features: [
        t('solutions.ipa.feature1'),
        t('solutions.ipa.feature2'),
        t('solutions.ipa.feature3'),
      ],
    },
    {
      icon: <Database className="w-12 h-12 text-primary" />,
      title: t('solutions.ai.title'),
      description: t('solutions.ai.description'),
      features: [
        t('solutions.ai.feature1'),
        t('solutions.ai.feature2'),
        t('solutions.ai.feature3'),
      ],
    },
    {
      icon: <Link2 className="w-12 h-12 text-primary" />,
      title: t('solutions.unified.title'),
      description: t('solutions.unified.description'),
      features: [
        t('solutions.unified.feature1'),
        t('solutions.unified.feature2'),
        t('solutions.unified.feature3'),
      ],
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-primary" />,
      title: t('solutions.customer.title'),
      description: t('solutions.customer.description'),
      features: [
        t('solutions.customer.feature1'),
        t('solutions.customer.feature2'),
        t('solutions.customer.feature3'),
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4" data-testid="text-solutions-headline">
            {t('solutions.headline')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('solutions.subheadline')}
          </p>
        </div>

        <div className="space-y-24">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="mb-6">{solution.icon}</div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-primary mb-4" data-testid={`text-solution-${index}`}>
                  {solution.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">{solution.description}</p>
                <ul className="space-y-3">
                  {solution.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="bg-gradient-to-br from-primary/10 to-primary-light/10 rounded-lg p-12 h-64 flex items-center justify-center">
                  <div className="text-muted-foreground text-center">
                    <div className="text-6xl mb-4">{solution.icon}</div>
                    <p className="text-sm">{t('solutions.featureVisualization')}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

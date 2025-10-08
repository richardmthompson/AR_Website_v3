import { Brain, Database, Link2, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import processAutomationImg from '@assets/images/process_automation_w_5977f46d.jpg';
import aiKnowledgeImg from '@assets/images/artificial_intellige_d6c7e8a4.jpg';
import unifiedWorkspaceImg from '@assets/images/unified_digital_work_6fae4e6f.jpg';
import customerServiceImg from '@assets/images/customer_service_aut_5e8fe777.jpg';

export default function SolutionsSection() {
  const { t } = useTranslation();

  const solutions = [
    {
      icon: <Brain className="w-10 h-10 text-primary" />,
      title: t('solutions.ipa.title'),
      description: t('solutions.ipa.description'),
      features: [
        t('solutions.ipa.feature1'),
        t('solutions.ipa.feature2'),
        t('solutions.ipa.feature3'),
      ],
      image: processAutomationImg,
    },
    {
      icon: <Database className="w-10 h-10 text-primary" />,
      title: t('solutions.ai.title'),
      description: t('solutions.ai.description'),
      features: [
        t('solutions.ai.feature1'),
        t('solutions.ai.feature2'),
        t('solutions.ai.feature3'),
      ],
      image: aiKnowledgeImg,
    },
    {
      icon: <Link2 className="w-10 h-10 text-primary" />,
      title: t('solutions.unified.title'),
      description: t('solutions.unified.description'),
      features: [
        t('solutions.unified.feature1'),
        t('solutions.unified.feature2'),
        t('solutions.unified.feature3'),
      ],
      image: unifiedWorkspaceImg,
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-primary" />,
      title: t('solutions.customer.title'),
      description: t('solutions.customer.description'),
      features: [
        t('solutions.customer.feature1'),
        t('solutions.customer.feature2'),
        t('solutions.customer.feature3'),
      ],
      image: customerServiceImg,
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

        <div className="space-y-16">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="mb-4">{solution.icon}</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-3" data-testid={`text-solution-${index}`}>
                  {solution.title}
                </h3>
                <p className="text-base text-muted-foreground mb-4">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={solution.image} 
                    alt={solution.title}
                    className="w-full h-48 object-cover"
                    data-testid={`img-solution-${index}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

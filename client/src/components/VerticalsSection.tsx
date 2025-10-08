import VerticalCard from './VerticalCard';
import { Calculator, ShoppingCart, GraduationCap } from 'lucide-react';
import accountingImage from '@assets/generated_images/Accounting_automation_illustration_a101f360.png';
import ecommerceImage from '@assets/generated_images/E-commerce_automation_illustration_1bd21796.png';
import educationImage from '@assets/generated_images/Education_automation_illustration_2882b70d.png';

export default function VerticalsSection() {
  const verticals = [
    {
      title: 'Accounting Firms',
      description: 'Transform from tax preparation mill to strategic advisory partner',
      painPoints: [
        '66% of staff time on manual data entry',
        '300+ scattered process manuals',
        '5+ disconnected systems',
      ],
      results: [
        '20-30% time reclaimed',
        '66% more documents processed',
        '60% faster query resolution',
      ],
      icon: <Calculator className="w-8 h-8" />,
      accentColor: 'bg-vertical-accounting',
      image: accountingImage,
    },
    {
      title: 'E-commerce',
      description: 'Scale operations without proportional staff increases',
      painPoints: [
        'Fragmented systems (inventory, CRM, logistics)',
        '20-30 hours/week on repetitive tasks',
        'Customer service bottlenecks',
      ],
      results: [
        '20-30 hours/week saved',
        '60-70% faster customer responses',
        '300-500% ROI in first year',
      ],
      icon: <ShoppingCart className="w-8 h-8" />,
      accentColor: 'bg-vertical-ecommerce',
      image: ecommerceImage,
    },
    {
      title: 'Educational Institutions',
      description: 'Reduce admin burden while improving student experience',
      painPoints: [
        '3+ hours per student registration',
        '24% of budget on admin overhead',
        'Fragmented legacy systems',
      ],
      results: [
        '88% reduction in registration time',
        '30-50% lower admin costs',
        '40%+ increase in satisfaction',
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
            Automation Solutions for Your Industry
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We specialize in AI automation for three key sectors experiencing operational chaos
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

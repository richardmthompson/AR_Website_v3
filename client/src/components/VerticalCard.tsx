import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface VerticalCardProps {
  title: string;
  description: string;
  painPoints: string[];
  results: string[];
  icon: React.ReactNode;
  accentColor: string;
  image: string;
  onLearnMore?: () => void;
  onTalkToExpert?: () => void;
}

export default function VerticalCard({
  title,
  description,
  painPoints,
  results,
  icon,
  accentColor,
  image,
  onLearnMore,
  onTalkToExpert,
}: VerticalCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      <div className="p-6">
        <div className={`w-16 h-16 rounded-full ${accentColor} bg-opacity-10 flex items-center justify-center mb-4`}>
          <div className={`${accentColor.replace('bg-', 'text-')}`}>
            {icon}
          </div>
        </div>
        
        <div className="mb-4">
          <img src={image} alt={title} className="w-full h-32 object-cover rounded-md" />
        </div>

        <h3 className="text-2xl font-semibold text-primary mb-2" data-testid={`text-vertical-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p>

        <div className="space-y-3 mb-4">
          <h4 className="font-semibold text-sm text-foreground">{t('verticals.painPoints')}</h4>
          <ul className="space-y-2">
            {painPoints.map((point, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-destructive mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-sm text-foreground">{t('verticals.results')}</h4>
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full group/btn"
            onClick={onLearnMore}
            data-testid={`button-learn-more-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {t('verticals.learnMore')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
          <Button
            className="w-full"
            onClick={onTalkToExpert}
            data-testid={`button-talk-to-expert-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {t('verticals.talkToExpert')}
          </Button>
        </div>
      </div>
    </Card>
  );
}

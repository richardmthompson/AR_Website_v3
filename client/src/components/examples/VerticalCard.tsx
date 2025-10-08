import VerticalCard from '../VerticalCard';
import { Calculator } from 'lucide-react';
import accountingImage from '@assets/generated_images/Accounting_automation_illustration_a101f360.png';

export default function VerticalCardExample() {
  return (
    <div className="max-w-sm">
      <VerticalCard
        title="Accounting Firms"
        description="Transform from tax preparation mill to strategic advisory partner"
        painPoints={[
          '66% of staff time on manual data entry',
          '300+ scattered process manuals',
          '5+ disconnected systems',
        ]}
        results={[
          '20-30% time reclaimed',
          '66% more documents processed',
          '60% faster query resolution',
        ]}
        icon={<Calculator className="w-8 h-8" />}
        accentColor="bg-vertical-accounting"
        image={accountingImage}
        onLearnMore={() => console.log('Learn more clicked')}
        onTalkToExpert={() => console.log('Talk to expert clicked')}
      />
    </div>
  );
}

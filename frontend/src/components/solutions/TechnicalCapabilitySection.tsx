import { technicalCapabilities } from '@/data/edtech-solutions';
import * as Icons from 'lucide-react';

export default function TechnicalCapabilitySection() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {technicalCapabilities.map((capability) => {
        const Icon = Icons[capability.icon as keyof typeof Icons] || Icons.Box;

        return (
          <div key={capability.id} className="p-8 bg-card border border-border rounded-xl">
            <div className="text-primary mb-4">
              {/* @ts-ignore - Dynamic icon from string */}
              <Icon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold mb-3">{capability.name}</h3>
            <p className="text-muted-foreground mb-4">{capability.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
              <ul className="space-y-2">
                {capability.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Use Cases:</h4>
              <ul className="space-y-2">
                {capability.useCases.slice(0, 3).map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-accent-cream/50 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6" data-testid="text-cta-headline">
          Ready to Reclaim Your Time?
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Schedule your free automation audit today. In 45 minutes, we'll identify your biggest opportunities and show you the ROI of intelligent automation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button size="lg" className="group" data-testid="button-schedule-audit-cta">
            <Calendar className="mr-2 w-5 h-5" />
            Schedule Your Free Audit
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" data-testid="button-download-playbook">
            Download Automation Playbook
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>No obligation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>45-minute call</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>Custom ROI estimate</span>
          </div>
        </div>

        <div className="mt-8 p-4 bg-accent-cream/50 rounded-lg border border-accent-cream">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Risk Reversal Guarantee:</span> If we can't identify at least 15% efficiency gains, the audit is free.
          </p>
        </div>
      </div>
    </section>
  );
}

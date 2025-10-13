import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { Play, Clock, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function DemosPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const demos = [
    {
      title: 'Multilingual Student Registration',
      duration: '15 minutes',
      description: 'Watch how international students complete registration in their native language in 12 minutes instead of 3+ hours',
      thumbnail: '/assets/images/demo-student-registration.jpg',
      highlights: [
        'AI agent speaks 50+ languages',
        'OCR document processing',
        'Auto-populated forms',
        'Instant validation',
      ],
      timeSaved: '88% reduction in registration time',
      audience: 'Universities, International School Networks',
    },
    {
      title: 'Accreditation Document Preparation',
      duration: '10 minutes',
      description: 'See how universities prepare 200+ pages of accreditation documentation in 2 hours instead of 2-3 months',
      thumbnail: '/assets/images/demo-accreditation.jpg',
      highlights: [
        'Multi-system data consolidation',
        'AI-generated narrative sections',
        'Compliance validation',
        'Always audit-ready',
      ],
      timeSaved: '90% reduction in prep time',
      audience: 'Universities, Educational Institutions',
    },
    {
      title: 'EdTech Customer Onboarding',
      duration: '8 minutes',
      description: 'Learn how EdTech companies onboard school districts in 45 minutes instead of 4-6 weeks',
      thumbnail: '/assets/images/demo-customer-onboarding.jpg',
      highlights: [
        'Automated SIS integration',
        'Pre-built connectors',
        'Training material generation',
        'Support chatbot activation',
      ],
      timeSaved: '6 weeks → 1 week onboarding',
      audience: 'EdTech Companies, SaaS Platforms',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">
              See Our Solutions in Action
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Watch real workflows transformed by AI automation
            </p>
            <Button size="lg" className="text-lg px-8" onClick={() => setLocation('/contact')}>
              Schedule Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Library */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {demos.map((demo, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Video/Thumbnail */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative rounded-xl overflow-hidden bg-muted aspect-video group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent group-hover:from-primary/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-6 bg-white/90 rounded-full group-hover:scale-110 transition-transform">
                        <Play className="w-12 h-12 text-primary" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {demo.duration}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-semibold">{demo.audience}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">{demo.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{demo.description}</p>

                  <div className="space-y-3 mb-6">
                    {demo.highlights.map((highlight, hIndex) => (
                      <div key={hIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-accent-cream/50 rounded-lg border border-primary/20 mb-6">
                    <p className="text-primary font-semibold">✨ {demo.timeSaved}</p>
                  </div>

                  <Button size="lg" className="w-full sm:w-auto">
                    Watch Full Demo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to See Your Workflows Automated?</h2>
          <p className="text-xl mb-8 text-white/90">
            Schedule a personalized demo tailored to your specific use case
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => setLocation('/contact')}>
              Schedule Live Demo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              Download Demo Scripts
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

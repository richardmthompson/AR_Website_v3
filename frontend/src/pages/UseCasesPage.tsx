import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function UseCasesPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const useCases = [
    {
      company: 'SpaceBasic',
      companyType: 'EdTech Platform',
      geography: 'India',
      size: '50+ universities',
      problem: 'Customer onboarding at 300% growth requires 4-6 weeks, becoming growth bottleneck',
      solution: 'EdTech operations automation with pre-built SIS integrations',
      results: [
        'Onboarding: 6 weeks → 1 week',
        '3x capacity without 3x headcount',
        '$500k saved in engineering time',
      ],
      tags: ['EdTech', 'Scaling', 'Customer Onboarding'],
    },
    {
      company: 'Varthana',
      companyType: 'School Finance',
      geography: 'India',
      size: '5,000 schools',
      problem: 'Loan application processing requires 40+ documents, takes 2-3 days per school',
      solution: 'AI-powered document processing + workflow automation for loan operations',
      results: [
        'Processing time: 3 days → 6 hours',
        '5x application throughput',
        'Triple-model opportunity: Customer + Channel + Strategic',
      ],
      tags: ['Finance', 'Document Processing', 'Channel Partnership'],
    },
    {
      company: 'EtonHouse',
      companyType: 'International School Network',
      geography: 'Multi-Country',
      size: '25,000 students',
      problem: 'Multi-campus coordination, cross-border compliance, parent communication at scale',
      solution: 'Multi-campus operations hub with compliance automation',
      results: [
        'Admin cost per student: ↓ 35%',
        'Parent response: 2 days → 5 minutes',
        '$2.6M annual savings',
      ],
      tags: ['School Networks', 'Multi-Location', 'Compliance'],
    },
    {
      company: 'Nahdet Misr',
      companyType: 'Publisher',
      geography: 'MENA',
      size: 'Major regional publisher',
      problem: 'Digital curriculum production for government partnerships, slow and manual QA',
      solution: 'Publishing operations automation with AI content QA',
      results: [
        'Production time: ↓ 40%',
        'Government compliance automated',
        'Multi-dimensional partnership: Publisher + VC + Market Gateway',
      ],
      tags: ['Publishing', 'Government', 'MENA'],
    },
    {
      company: 'Aksorn Education',
      companyType: 'Publisher + School Network',
      geography: 'Thailand',
      size: '40% market share',
      problem: '100+ school relationships, 70,000 teachers to train, content production workflows',
      solution: 'Publisher operations + teacher training automation + school network management',
      results: [
        'Teacher training scaled 3x without additional trainers',
        'School updates: instant distribution',
        'Quadruple opportunity: Publisher + Schools + VC + Training',
      ],
      tags: ['Publishing', 'Teacher Training', 'School Networks'],
    },
    {
      company: 'Leverage Edu',
      companyType: 'Study Abroad Platform',
      geography: 'India',
      size: '7.5M students/month',
      problem: 'Document processing for international applications, counselor-student matching',
      solution: 'Application document automation + intelligent counselor matching',
      results: [
        'Document processing automated',
        'Counselor time saved: 40%',
        'Application throughput: 2x',
      ],
      tags: ['EdTech', 'International Education', 'Document Processing'],
    },
  ];

  const filters = [
    { label: 'All', value: 'all', active: true },
    { label: 'EdTech Companies', value: 'edtech', active: false },
    { label: 'School Networks', value: 'schools', active: false },
    { label: 'Publishers', value: 'publishers', active: false },
    { label: 'Universities', value: 'universities', active: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6">
              EdTech Solution Scenarios
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-3">
              Based on real EdTech organizations and their operational challenges, these scenarios demonstrate
              how our automation platform would address typical pain points across different organization types.
            </p>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto italic">
              These are sample solution scenarios showcasing our industry expertise and technical approach,
              not case studies of completed client projects.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter, index) => (
              <Button
                key={index}
                variant={filter.active ? 'default' : 'outline'}
                size="sm"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-8 bg-card border-2 border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {useCase.company}
                    </h3>
                    <p className="text-muted-foreground">{useCase.companyType}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-primary" />
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {useCase.geography}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    {useCase.size}
                  </div>
                </div>

                {/* Problem */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-destructive mb-2">Problem:</h4>
                  <p className="text-sm">{useCase.problem}</p>
                </div>

                {/* Solution */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-primary mb-2">Solution:</h4>
                  <p className="text-sm">{useCase.solution}</p>
                </div>

                {/* Results */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-green-600 mb-2">Results:</h4>
                  <ul className="space-y-2">
                    {useCase.results.map((result, rIndex) => (
                      <li key={rIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {useCase.tags.map((tag, tIndex) => (
                    <Badge key={tIndex} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  <span>Read Full Case Study</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-cream/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Your Use Case Next?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a consultation to explore how we can transform your operations
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => setLocation('/contact')}>
            Schedule Consultation
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

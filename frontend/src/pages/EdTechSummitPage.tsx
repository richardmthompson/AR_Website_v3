import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  prospectSolutions,
  solutionCategories,
  technicalCapabilities,
  architecturePatterns
} from '@/data/edtech-solutions';
import { MapPin, TrendingUp, CheckCircle2, Brain, Link2, Zap, Award, Shield, ClipboardCheck, Briefcase, Globe, DollarSign, BookOpen, Building2 } from 'lucide-react';
import MermaidDiagram from '@/components/MermaidDiagram';

// Icon mapping helper
const iconMap: Record<string, any> = {
  Brain, Link2, Zap, Award, Shield, ClipboardCheck, Briefcase, Globe, DollarSign, BookOpen, Building2
};

export default function EdTechSummitPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            EdTech Summit Research Cheat Sheet
          </h1>
          <p className="text-lg text-white/90">
            Internal reference: Solution workflows, technical capabilities, and implementation patterns
          </p>
        </div>
      </section>

      {/* Sample Solution Workflows */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Sample Solution Workflows by Organization Type</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {prospectSolutions.map((solution) => (
              <Card key={solution.id} className="p-6">
                {/* Header */}
                <div className="mb-4 border-b pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{solution.organization}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {solution.organizationType}
                      </Badge>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 justify-end">
                        <MapPin className="w-4 h-4" />
                        {solution.geography}
                      </div>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <TrendingUp className="w-4 h-4" />
                        {solution.scale}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Problem */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-destructive mb-2">Problem:</h4>
                  <p className="text-sm bg-destructive/5 p-3 rounded-md">{solution.problem}</p>
                </div>

                {/* Technical Implementation */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-primary mb-2">
                    Technical Implementation:
                  </h4>
                  <ul className="space-y-2 bg-primary/5 p-3 rounded-md">
                    {solution.technicalImplementation.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Time Savings */}
                <div className="p-3 bg-accent-cream/50 rounded-lg mb-4">
                  <p className="text-primary font-bold text-sm">
                    ⚡ {solution.timeSavings}
                  </p>
                </div>

                {/* Value Pitch */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold mb-2">Value Pitch:</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">{solution.valuePitch}</p>
                </div>

                {/* Solution Models (if available) */}
                {solution.solutionModels && solution.solutionModels.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-bold mb-2">Multiple Solution Models:</h4>
                    <ul className="space-y-1">
                      {solution.solutionModels.map((model, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{model}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Categories Quick Reference */}
      <section className="py-12 bg-accent-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Solution Categories Cheat Sheet</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {solutionCategories.map((category) => {
              const IconComponent = iconMap[category.icon];
              return (
                <Card key={category.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {IconComponent && <IconComponent className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                    <div>
                      <h3 className="font-bold text-sm mb-1">{category.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {category.targetAudience.map((audience) => (
                          <Badge key={audience} variant="outline" className="text-xs">
                            {audience}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs font-semibold text-primary">
                        {category.roiMetric}
                      </p>
                    </div>
                  </div>

                  {/* Context - Industry Challenge */}
                  {category.context && (
                    <div className="mb-3 text-xs">
                      <p className="font-semibold mb-1">Industry Context:</p>
                      <p className="text-muted-foreground">{category.context}</p>
                    </div>
                  )}

                  {/* Can/Cannot Solve */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {category.cannotSolve && (
                      <div className="bg-destructive/5 p-2 rounded">
                        <p className="font-semibold text-destructive mb-1">Cannot Solve:</p>
                        <ul className="space-y-1">
                          {category.cannotSolve.map((item, idx) => (
                            <li key={idx} className="text-muted-foreground">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {category.canSolve && (
                      <div className="bg-primary/5 p-2 rounded">
                        <p className="font-semibold text-primary mb-1">Can Solve:</p>
                        <ul className="space-y-1">
                          {category.canSolve.map((item, idx) => (
                            <li key={idx} className="text-muted-foreground">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Sample Solution Hook */}
                  {category.sampleSolutionHook && (
                    <div className="mt-3 bg-accent-cream/30 p-2 rounded text-xs">
                      <p className="font-semibold mb-1">Pitch Hook:</p>
                      <p className="text-muted-foreground mb-2">{category.sampleSolutionHook.setup}</p>
                      <p className="font-bold text-primary mb-1">{category.sampleSolutionHook.result}</p>
                      <p className="text-muted-foreground italic">{category.sampleSolutionHook.whyItWins}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Capabilities Quick Reference */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Technical Stack Quick Reference</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {technicalCapabilities.map((capability) => {
              const IconComponent = iconMap[capability.icon];
              return (
                <Card key={capability.id} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
                    <h3 className="font-bold text-sm">{capability.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{capability.description}</p>

                  <div className="mb-3">
                    <p className="text-xs font-semibold mb-2">Key Features:</p>
                    <ul className="space-y-1">
                      {capability.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="text-primary">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold mb-2">Example Use Cases:</p>
                    <ul className="space-y-1">
                      {capability.useCases.map((useCase, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span className="text-primary">•</span>
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture Patterns Reference */}
      <section className="py-12 bg-accent-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Architecture Patterns Reference</h2>
          <div className="space-y-4">
            {architecturePatterns.map((pattern) => (
              <Card key={pattern.id} className="p-5">
                {/* First pattern (horizontal) - diagram above, full width */}
                {pattern.id === 'document-processing' ? (
                  <>
                    <h3 className="font-bold mb-2">{pattern.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{pattern.description}</p>
                    {/* Mermaid Diagram - Full Width */}
                    {pattern.mermaidDiagram && (
                      <div className="mb-6">
                        <MermaidDiagram chart={pattern.mermaidDiagram} id={pattern.id} />
                      </div>
                    )}

                    {/* Text Content - 3 Columns */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Architecture Flow */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Architecture Flow:</p>
                        <ol className="space-y-2">
                          {pattern.architectureFlow.map((step, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="font-bold text-primary flex-shrink-0">{idx + 1}.</span>
                              <span className="text-muted-foreground">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Use Cases */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Use Cases:</p>
                        <ul className="space-y-2">
                          {pattern.useCases.map((useCase, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary flex-shrink-0">•</span>
                              <span>{useCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technical Components */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Technical Components:</p>
                        <ul className="space-y-2">
                          {pattern.technicalComponents.map((component, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary flex-shrink-0">•</span>
                              <span>{component}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Other patterns (vertical) - side by side layout */
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* Left Column: Title, Description & Text Content */}
                    <div className="space-y-4">
                      {/* Title and Description moved here */}
                      <div>
                        <h3 className="font-bold mb-2">{pattern.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{pattern.description}</p>
                      </div>

                      {/* Architecture Flow */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Architecture Flow:</p>
                        <ol className="space-y-2">
                          {pattern.architectureFlow.map((step, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="font-bold text-primary flex-shrink-0">{idx + 1}.</span>
                              <span className="text-muted-foreground">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Use Cases */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Use Cases:</p>
                        <ul className="space-y-2">
                          {pattern.useCases.map((useCase, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary flex-shrink-0">•</span>
                              <span>{useCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technical Components */}
                      <div>
                        <p className="text-sm font-semibold mb-2">Technical Components:</p>
                        <ul className="space-y-2">
                          {pattern.technicalComponents.map((component, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary flex-shrink-0">•</span>
                              <span>{component}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Mermaid Diagram (starts at top) */}
                    {pattern.mermaidDiagram && (
                      <div>
                        <MermaidDiagram chart={pattern.mermaidDiagram} id={pattern.id} />
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Types Summary */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Organization Types Summary</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { type: 'EdTech Platform', count: prospectSolutions.filter(s => s.organizationType.includes('EdTech')).length },
              { type: 'School', count: prospectSolutions.filter(s => s.organizationType.includes('School')).length },
              { type: 'Finance', count: prospectSolutions.filter(s => s.organizationType.includes('Finance')).length },
              { type: 'Publisher', count: prospectSolutions.filter(s => s.organizationType.includes('Publisher')).length },
              { type: 'Consulting', count: prospectSolutions.filter(s => s.organizationType.includes('Consulting')).length },
              { type: 'VC Portfolio', count: prospectSolutions.filter(s => s.organizationType.includes('VC')).length },
            ].map((item) => (
              <Card key={item.type} className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{item.count}</p>
                <p className="text-sm font-semibold">{item.type}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {prospectSolutions
                    .filter(s => s.organizationType.includes(item.type))
                    .map(s => s.organization)
                    .join(', ')}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Brain, Database, Link2, MessageSquare } from 'lucide-react';

export default function SolutionsSection() {
  const solutions = [
    {
      icon: <Brain className="w-12 h-12 text-primary" />,
      title: 'Intelligent Process Automation',
      description: 'Agentic AI workflows that handle complex, multi-step tasks autonomously',
      features: [
        'Document processing with OCR',
        'Automated data entry',
        'System-to-system integration',
      ],
    },
    {
      icon: <Database className="w-12 h-12 text-primary" />,
      title: 'AI Knowledge Systems',
      description: 'RAG-based platforms that ingest 300+ process manuals for instant query resolution',
      features: [
        'Seconds vs. 30-60 minutes search time',
        'Preserve institutional knowledge',
        'Always-current documentation',
      ],
    },
    {
      icon: <Link2 className="w-12 h-12 text-primary" />,
      title: 'Unified Digital Workspaces',
      description: 'Canvas-style platforms integrating Office 365, SharePoint, and custom systems',
      features: [
        'Universal search across all systems',
        'Eliminate context-switching',
        'Seamless integration',
      ],
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-primary" />,
      title: 'Customer Service Automation',
      description: 'Multilingual AI agents handling 60-85% of queries automatically',
      features: [
        'Self-service portals',
        'Automated follow-ups',
        'Multi-language support',
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4" data-testid="text-solutions-headline">
            Our Core Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Advanced AI automation tailored to your operational challenges
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
                    <p className="text-sm">Feature visualization</p>
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

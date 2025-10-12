import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { GraduationCap, Calculator, ShoppingCart, Brain, Database, Link2 } from 'lucide-react';

export default function SolutionsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const industries = [
    {
      title: 'EdTech & Education',
      description: 'Automation for EdTech companies, universities, and school networks',
      icon: <GraduationCap className="w-12 h-12" />,
      link: '/solutions/edtech',
      color: 'bg-vertical-education',
    },
    {
      title: 'Accounting Firms',
      description: 'Transform from tax prep to strategic advisory partner',
      icon: <Calculator className="w-12 h-12" />,
      link: '#accounting',
      color: 'bg-vertical-accounting',
    },
    {
      title: 'E-commerce',
      description: 'Scale operations without proportional staff increases',
      icon: <ShoppingCart className="w-12 h-12" />,
      link: '#ecommerce',
      color: 'bg-vertical-ecommerce',
    },
  ];

  const technologies = [
    {
      title: 'Agentic AI',
      description: 'Autonomous AI agents that handle complex, multi-step workflows',
      icon: <Brain className="w-10 h-10" />,
      features: ['Document processing', 'Natural language interfaces', 'Multilingual support', 'Context-aware automation'],
    },
    {
      title: 'n8n Workflow Automation',
      description: 'Visual workflow builder connecting 400+ systems',
      icon: <Link2 className="w-10 h-10" />,
      features: ['System integration', 'Data synchronization', 'Event-driven automation', 'Custom API connectors'],
    },
    {
      title: 'Combined Power',
      description: 'Intelligence + Integration = Transformative Automation',
      icon: <Database className="w-10 h-10" />,
      features: ['Smart document processing', 'Intelligent system orchestration', 'End-to-end workflows', 'Scalable infrastructure'],
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
              AI Automation Solutions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Industry-specific automation powered by Agentic AI and n8n workflow orchestration
            </p>
          </div>
        </div>
      </section>

      {/* Solutions by Industry */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Solutions by Industry</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Link key={index} href={industry.link}>
                <div className="group cursor-pointer">
                  <div className="p-8 bg-card border-2 border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300">
                    <div className={`inline-flex p-4 rounded-lg ${industry.color} text-white mb-4`}>
                      {industry.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{industry.title}</h3>
                    <p className="text-muted-foreground mb-4">{industry.description}</p>
                    <span className="text-primary font-semibold group-hover:underline">
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-accent-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Technology Stack</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining the best of AI intelligence and workflow automation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="p-8 bg-card border border-border rounded-xl">
                <div className="text-primary mb-4">{tech.icon}</div>
                <h3 className="text-xl font-bold mb-3">{tech.title}</h3>
                <p className="text-muted-foreground mb-4">{tech.description}</p>
                <ul className="space-y-2">
                  {tech.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

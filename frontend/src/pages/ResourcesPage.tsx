import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FileText, Download, Video, Calculator, BookOpen } from 'lucide-react';

export default function ResourcesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const resources = [
    {
      title: 'EdTech Operations Platform One-Pager',
      description: 'For EdTech companies: Scale operations without scaling headcount',
      type: 'PDF',
      icon: <FileText className="w-8 h-8" />,
      audience: 'EdTech Companies',
      pages: '2 pages',
    },
    {
      title: 'School Network Operations One-Pager',
      description: 'For multi-campus operators: Automate coordination across locations',
      type: 'PDF',
      icon: <FileText className="w-8 h-8" />,
      audience: 'School Networks',
      pages: '2 pages',
    },
    {
      title: 'Publisher Digital Transformation One-Pager',
      description: 'For publishers: Digital content workflows at the speed of AI',
      type: 'PDF',
      icon: <FileText className="w-8 h-8" />,
      audience: 'Publishers',
      pages: '2 pages',
    },
    {
      title: 'University Administration One-Pager',
      description: 'For universities: Reduce admin burden while improving student experience',
      type: 'PDF',
      icon: <FileText className="w-8 h-8" />,
      audience: 'Universities',
      pages: '2 pages',
    },
    {
      title: 'VC Portfolio Support One-Pager',
      description: 'For investors: Operational infrastructure for EdTech portfolio companies',
      type: 'PDF',
      icon: <FileText className="w-8 h-8" />,
      audience: 'VCs & Investors',
      pages: '2 pages',
    },
  ];

  const whitepapers = [
    {
      title: 'The Higher Ed Automation Readiness Guide',
      description: 'Comprehensive resource covering common administrative bottlenecks, feasibility assessment, and ROI calculator',
      pages: '24 pages',
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: 'EdTech Operations Playbook',
      description: 'How scaling EdTech companies reduce engineering time on operational plumbing by 30-40%',
      pages: '18 pages',
      icon: <BookOpen className="w-8 h-8" />,
    },
  ];

  const tools = [
    {
      title: 'EdTech ROI Calculator',
      description: 'Calculate potential savings from automating your operations',
      icon: <Calculator className="w-8 h-8" />,
      type: 'Interactive Tool',
    },
    {
      title: 'Demo Video Library',
      description: 'Watch 15-minute demos of real workflow automation',
      icon: <Video className="w-8 h-8" />,
      type: 'Video Content',
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
              Resources & Downloads
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              One-pagers, white papers, calculators, and demos to help you understand
              how AI automation transforms educational operations
            </p>
          </div>
        </div>
      </section>

      {/* One-Pagers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">One-Pagers by Audience</h2>
            <p className="text-lg text-muted-foreground">
              Quick overview documents tailored to your organization type
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-primary mb-4">{resource.icon}</div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{resource.audience}</span>
                    <span>{resource.pages}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* White Papers Section */}
      <section className="py-20 bg-accent-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">White Papers & Guides</h2>
            <p className="text-lg text-muted-foreground">
              In-depth analysis and implementation guides
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {whitepapers.map((paper, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-primary mb-4">{paper.icon}</div>
                  <CardTitle className="text-xl">{paper.title}</CardTitle>
                  <CardDescription>{paper.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{paper.pages}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Guide
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Interactive Tools</h2>
            <p className="text-lg text-muted-foreground">
              Calculators and demos to visualize your automation potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-primary mb-4">{tool.icon}</div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.type}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" variant="outline">
                    Access Tool →
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gated Content Form */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get All Resources + Newsletter
            </h2>
            <p className="text-xl text-white/90">
              Enter your email to download all resources and receive monthly automation insights
            </p>
          </div>

          <div className="bg-white rounded-lg p-8">
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type
                </label>
                <select
                  id="organization"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="edtech">EdTech Company</option>
                  <option value="university">University</option>
                  <option value="school-network">School Network</option>
                  <option value="publisher">Publisher</option>
                  <option value="vc">VC / Investor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button type="submit" size="lg" className="w-full">
                Download All Resources
              </Button>
              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

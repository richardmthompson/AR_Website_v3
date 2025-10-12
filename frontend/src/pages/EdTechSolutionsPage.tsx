import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import TechnicalCapabilitySection from '@/components/solutions/TechnicalCapabilitySection';
import SolutionCategoryGrid from '@/components/solutions/SolutionCategoryGrid';
import ArchitecturePatternAccordion from '@/components/solutions/ArchitecturePatternAccordion';
import ProspectSolutionTabs from '@/components/solutions/ProspectSolutionTabs';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function EdTechSolutionsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Enhanced */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <span className="font-semibold">EdTech Solutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Operational Infrastructure for <br />Education Organizations
            </h1>
            <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8">
              We provide AI-powered automation for EdTech companies, universities, and school networks.
              Scale operations without scaling headcount.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/conference">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                  Schedule EdTech Assessment
                </Button>
              </Link>
              <Link href="/demos">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-primary">
                  View Demos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Current Industry Context</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              The education technology sector is undergoing significant transformation. Alternative credentials are becoming mainstream, AI integration is accelerating, and international student mobility continues growing. However, a critical gap has emerged: <strong>operational infrastructure hasn't kept pace with strategic ambitions</strong>.
            </p>
            <p className="text-lg text-foreground leading-relaxed mb-4">
              The strategic vision exists—organizations know where they need to go—but operational workflows are breaking under the load:
            </p>
            <ul className="space-y-3 text-lg text-foreground mb-6">
              <li><strong>Universities</strong> launching micro-credential programs lack systems to issue thousands of credentials when built for annual degree ceremonies</li>
              <li><strong>EdTech companies</strong> scaling from 10 to 100 customers face month-long onboarding bottlenecks</li>
              <li><strong>Assessment organizations</strong> can't hire evaluators fast enough</li>
              <li><strong>International admissions teams</strong> manually process multilingual applications</li>
            </ul>
            <p className="text-lg text-foreground leading-relaxed font-semibold">
              <strong>Organizations need operational automation infrastructure, not more strategy consulting.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Honest Disclosure Section */}
      <section className="py-20 bg-accent-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Setting Realistic Expectations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in transparent communication. Here's what AI and automation can and cannot solve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Cannot Solve */}
            <Card className="p-8 border-2 border-destructive/20 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold">What AI and Automation CANNOT Solve</h3>
              </div>

              <p className="text-sm font-semibold text-muted-foreground mb-6">
                Our Focus: We don't solve strategic, pedagogical, or policy challenges. We automate operational workflows.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Strategic & pedagogical decisions</p>
                    <p className="text-sm text-muted-foreground">AI strategy, curriculum design, business model</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Content creation</p>
                    <p className="text-sm text-muted-foreground">courses, assessments, learning materials</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Industry standards & policy</p>
                    <p className="text-sm text-muted-foreground">credential frameworks, regulations, accreditation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Market forces</p>
                    <p className="text-sm text-muted-foreground">employer behavior, student debt crisis, education affordability</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Building your core product</p>
                    <p className="text-sm text-muted-foreground">EdTech features, assessment design, publishing content</p>
                  </div>
                </li>
              </ul>
            </Card>

            {/* Can Solve */}
            <Card className="p-8 border-2 border-primary/20 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">What AI and Automation CAN Solve</h3>
              </div>

              <p className="text-sm font-semibold text-muted-foreground mb-6">
                Our Sweet Spot: Repetitive, high-volume administrative work that currently requires humans but doesn't need human judgment.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Document processing at scale</p>
                    <p className="text-sm text-muted-foreground">OCR, extraction, classification, and validation of thousands of documents automatically</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Workflow orchestration</p>
                    <p className="text-sm text-muted-foreground">Multi-step processes with decision logic, routing, and human-in-the-loop approvals</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">System integration</p>
                    <p className="text-sm text-muted-foreground">Connect SIS, LMS, CRM, finance systems with automated data synchronization</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Capabilities Section */}
      <section className="py-20 bg-accent-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Technical Stack</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining Agentic AI and n8n workflow automation for intelligent, scalable solutions
            </p>
          </div>
          <TechnicalCapabilitySection />
        </div>
      </section>

      {/* Solution Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">EdTech Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive automation solutions for every education organization type
            </p>
          </div>
          <SolutionCategoryGrid />
        </div>
      </section>

      {/* Architecture Patterns Section */}
      <section className="py-20 bg-accent-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Solution Architecture Patterns</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Proven patterns for common education workflows
            </p>
          </div>
          <ArchitecturePatternAccordion />
        </div>
      </section>

      {/* Prospect Solutions Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Sample Solution Workflows by Organization Type</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
              Based on real organizations in the EdTech sector, these are example automation workflows demonstrating how we would address typical operational challenges for each organization type.
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto italic">
              These are sample workflows showcasing our technical expertise and industry understanding, not case studies of completed client engagements.
            </p>
          </div>
          <ProspectSolutionTabs />

          {/* Link to full case studies */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Want to explore more detailed automation scenarios?
            </p>
            <Link href="/use-cases">
              <Button variant="outline" size="lg">
                View Detailed Solution Scenarios →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Points Section */}
      <section className="py-20 bg-accent-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Integration Capabilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pre-built connectors for the education technology ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-lg font-bold mb-3">Student Information Systems</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  PowerSchool
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Ellucian Banner
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Infinite Campus
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Oracle PeopleSoft
                </li>
              </ul>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-lg font-bold mb-3">Learning Management</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Canvas LMS
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Blackboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Moodle
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Google Classroom
                </li>
              </ul>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-lg font-bold mb-3">CRM & Communication</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Salesforce
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  HubSpot
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Twilio/WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  SendGrid
                </li>
              </ul>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-lg font-bold mb-3">Payment & Finance</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Stripe
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Razorpay
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  PayPal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  QuickBooks
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Plus 400+ integrations via n8n, or custom API connectors for your specific systems
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your EdTech Operations?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Schedule a 30-minute assessment to explore automation opportunities for your organization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/conference">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Schedule Assessment
              </Button>
            </Link>
            <Link href="/resources">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-primary"
              >
                Download Solution Architecture Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

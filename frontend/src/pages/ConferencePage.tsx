import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Download, Clock, CheckCircle } from 'lucide-react';

export default function ConferencePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const meetingSlots = [
    { time: 'Oct 14, 9:00 AM', available: true },
    { time: 'Oct 14, 11:00 AM', available: true },
    { time: 'Oct 14, 2:00 PM', available: false },
    { time: 'Oct 14, 4:00 PM', available: true },
    { time: 'Oct 15, 10:00 AM', available: true },
    { time: 'Oct 15, 1:00 PM', available: true },
  ];

  const whatToExpect = [
    'Deep-dive into your specific operational challenges',
    'Demo of relevant automation workflows (tailored to your use case)',
    'ROI analysis for your organization',
    'Introduction to technical stack (Agentic AI + n8n)',
    'Discussion of implementation timeline and approach',
    'Connect with our EdTech solutions team',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <span className="font-semibold">EdTech Asia Summit 2025</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Meet AR Automation at<br />EdTech Asia Summit
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              October 14-15, 2025 · Singapore
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Singapore Conference Center</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Booth #42</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Both Days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Meeting Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Form */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Schedule a Meeting
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Book a 30-45 minute session to discuss your specific automation needs.
                Limited slots available.
              </p>

              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input id="name" type="text" placeholder="John Doe" required />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Work Email *
                  </label>
                  <Input id="email" type="email" placeholder="you@company.com" required />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company / Organization *
                  </label>
                  <Input id="company" type="text" placeholder="Your Organization" required />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-2">
                    Your Role
                  </label>
                  <select
                    id="role"
                    className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="ceo">CEO / Founder</option>
                    <option value="coo">COO / Operations</option>
                    <option value="cto">CTO / Engineering</option>
                    <option value="product">Product Leader</option>
                    <option value="vc">VC / Investor</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="organization-type" className="block text-sm font-medium mb-2">
                    Organization Type *
                  </label>
                  <select
                    id="organization-type"
                    className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="edtech">EdTech Company</option>
                    <option value="university">University</option>
                    <option value="school-network">School Network</option>
                    <option value="publisher">Publisher</option>
                    <option value="assessment">Assessment / Testing</option>
                    <option value="vc">VC / Investor</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="challenge" className="block text-sm font-medium mb-2">
                    Main Operational Challenge (Optional)
                  </label>
                  <textarea
                    id="challenge"
                    rows={3}
                    className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Customer onboarding takes 6 weeks, international student registration is manual, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Preferred Meeting Time *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {meetingSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        disabled={!slot.available}
                        className={`p-3 text-sm rounded-lg border-2 transition-all ${
                          slot.available
                            ? 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer'
                            : 'border-border/50 bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                        {!slot.available && (
                          <span className="block text-xs mt-1">Booked</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Request Meeting
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We'll confirm your meeting slot within 24 hours
                </p>
              </form>
            </div>

            {/* Right: What to Expect */}
            <div className="lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">What to Expect</CardTitle>
                  <CardDescription>
                    Your 30-45 minute session will cover:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {whatToExpect.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 p-4 bg-accent-cream/50 rounded-lg">
                    <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                      <Clock className="w-5 h-5" />
                      <span>Limited Availability</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We're accepting a maximum of 20 meeting requests to ensure quality conversations.
                      Book early to secure your preferred time.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Download Resources */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Conference Resources</CardTitle>
                  <CardDescription>
                    Download before the conference
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    EdTech Solutions One-Pager
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Use Case Library (6 stories)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Technical Architecture Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Meet Us Section */}
      <section className="py-20 bg-accent-cream/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Why Meet with AR Automation?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="text-3xl font-bold text-primary mb-3">30-40%</div>
              <p className="text-sm text-muted-foreground">
                Engineering time saved on operational workflows for EdTech companies
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-3">6 weeks → 1 week</div>
              <p className="text-sm text-muted-foreground">
                Typical improvement in customer onboarding time
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-3">15-20x ROI</div>
              <p className="text-sm text-muted-foreground">
                Average return on investment within 12 months
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

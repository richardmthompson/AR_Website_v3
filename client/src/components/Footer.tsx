import { Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Team', href: '#team' },
        { label: 'Careers', href: '#careers' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Industries',
      links: [
        { label: 'Accounting Firms', href: '#accounting' },
        { label: 'E-commerce', href: '#ecommerce' },
        { label: 'Education', href: '#education' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '#blog' },
        { label: 'Case Studies', href: '#case-studies' },
        { label: 'Documentation', href: '#docs' },
        { label: 'ROI Calculator', href: '#calculator' },
      ],
    },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">AR Automation</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-sm">
              Automating the boring stuff so you can build the business you dreamed of.
            </p>
            <div className="flex gap-4">
              <a
                href="#linkedin"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover-elevate flex items-center justify-center"
                data-testid="link-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover-elevate flex items-center justify-center"
                data-testid="link-twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#email"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover-elevate flex items-center justify-center"
                data-testid="link-email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2025 AR Automation. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-primary-foreground/60 hover:text-primary-foreground" data-testid="link-privacy">
              Privacy Policy
            </a>
            <a href="#terms" className="text-primary-foreground/60 hover:text-primary-foreground" data-testid="link-terms">
              Terms of Service
            </a>
            <a href="#cookies" className="text-primary-foreground/60 hover:text-primary-foreground" data-testid="link-cookies">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

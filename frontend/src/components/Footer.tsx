import { Linkedin, Twitter, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

export default function Footer() {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.aboutUs'), href: '#about', external: true },
        { label: t('footer.team'), href: '#team', external: true },
        { label: t('footer.careers'), href: '#careers', external: true },
        { label: t('footer.contact'), href: '/contact', external: false },
      ],
    },
    {
      title: t('footer.industries'),
      links: [
        { label: t('industries.accounting'), href: '#accounting', external: true },
        { label: t('industries.ecommerce'), href: '#ecommerce', external: true },
        { label: t('industries.education'), href: '#education', external: true },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.blog'), href: '#blog', external: true },
        { label: t('footer.caseStudies'), href: '#case-studies', external: true },
        { label: t('footer.documentation'), href: '#docs', external: true },
        { label: t('footer.roiCalculator'), href: '#calculator', external: true },
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
              {t('footer.tagline')}
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
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                        data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>
                        <a
                          className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                          data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {link.label}
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-primary-foreground/60 hover:text-primary-foreground" data-testid="link-privacy">
              {t('footer.privacyPolicy')}
            </a>
            <a href="#terms" className="text-primary-foreground/60 hover:text-primary-foreground" data-testid="link-terms">
              {t('footer.termsOfService')}
            </a>
            <a href="#cookies" className="text-primary-foreground/60 hover:text-primary-foreground" data-testid="link-cookies">
              {t('footer.cookiePolicy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

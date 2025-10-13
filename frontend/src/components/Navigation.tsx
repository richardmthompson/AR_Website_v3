import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLang = i18n.language;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer" data-testid="logo-arautomation">
                AR Automation
              </a>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <a
                href="/#industries"
                className="flex items-center gap-1 text-foreground hover-elevate px-3 py-2 rounded-md"
                onMouseEnter={() => setIndustriesOpen(true)}
                onMouseLeave={() => setIndustriesOpen(false)}
                data-testid="button-industries-dropdown"
              >
                {t('nav.industries')}
                <ChevronDown className="w-4 h-4" />
              </a>
              {industriesOpen && (
                <div
                  className="absolute top-full left-0 w-56 bg-popover border border-popover-border rounded-md shadow-lg py-2"
                  onMouseEnter={() => setIndustriesOpen(true)}
                  onMouseLeave={() => setIndustriesOpen(false)}
                >
                  <Link href="/solutions/edtech" className="block px-4 py-2 hover-elevate" data-testid="link-education">
                    {t('industries.education')}
                  </Link>
                  <a href="/#industries" className="block px-4 py-2 hover-elevate" data-testid="link-accounting">
                    {t('industries.accounting')}
                  </a>
                  <a href="/#industries" className="block px-4 py-2 hover-elevate" data-testid="link-ecommerce">
                    {t('industries.ecommerce')}
                  </a>
                </div>
              )}
            </div>
            <a href="#team" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-team">
              {t('nav.team')}
            </a>
            <a href="#resources" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-resources">
              {t('nav.resources')}
            </a>
            <div className="flex items-center gap-2">
              <button 
                className={`text-sm ${currentLang === 'en' ? 'text-foreground font-semibold' : 'text-muted-foreground'} hover:text-foreground`}
                onClick={() => changeLanguage('en')}
                data-testid="button-lang-en"
              >
                EN
              </button>
              <span className="text-muted-foreground">|</span>
              <button 
                className={`text-sm ${currentLang === 'de' ? 'text-foreground font-semibold' : 'text-muted-foreground'} hover:text-foreground`}
                onClick={() => changeLanguage('de')}
                data-testid="button-lang-de"
              >
                DE
              </button>
            </div>
            <Button onClick={() => setLocation('/contact')} data-testid="button-get-in-touch">{t('nav.getInTouch')}</Button>
          </div>

          <div className="md:hidden">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link href="/solutions/edtech" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-education">
                {t('industries.education')}
              </Link>
              <a href="/#industries" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-accounting">
                {t('industries.accounting')}
              </a>
              <a href="/#industries" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-ecommerce">
                {t('industries.ecommerce')}
              </a>
              <a href="#team" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-team">
                {t('nav.team')}
              </a>
              <a href="#resources" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-resources">
                {t('nav.resources')}
              </a>
              <div className="flex items-center gap-2 px-3">
                <button 
                  className={`text-sm ${currentLang === 'en' ? 'text-foreground font-semibold' : 'text-muted-foreground'} hover:text-foreground`}
                  onClick={() => changeLanguage('en')}
                  data-testid="mobile-button-lang-en"
                >
                  EN
                </button>
                <span className="text-muted-foreground">|</span>
                <button 
                  className={`text-sm ${currentLang === 'de' ? 'text-foreground font-semibold' : 'text-muted-foreground'} hover:text-foreground`}
                  onClick={() => changeLanguage('de')}
                  data-testid="mobile-button-lang-de"
                >
                  DE
                </button>
              </div>
              <Button onClick={() => setLocation('/contact')} className="w-full" data-testid="mobile-button-get-in-touch">
                {t('nav.getInTouch')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

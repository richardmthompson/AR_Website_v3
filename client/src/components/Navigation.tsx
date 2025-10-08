import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary" data-testid="logo-arautomation">
              AR Automation
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-foreground hover-elevate px-3 py-2 rounded-md"
                onMouseEnter={() => setIndustriesOpen(true)}
                onMouseLeave={() => setIndustriesOpen(false)}
                data-testid="button-industries-dropdown"
              >
                Industries
                <ChevronDown className="w-4 h-4" />
              </button>
              {industriesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-popover border border-popover-border rounded-md shadow-lg py-2"
                  onMouseEnter={() => setIndustriesOpen(true)}
                  onMouseLeave={() => setIndustriesOpen(false)}
                >
                  <a href="#accounting" className="block px-4 py-2 hover-elevate" data-testid="link-accounting">
                    Accounting Firms
                  </a>
                  <a href="#ecommerce" className="block px-4 py-2 hover-elevate" data-testid="link-ecommerce">
                    E-commerce
                  </a>
                  <a href="#education" className="block px-4 py-2 hover-elevate" data-testid="link-education">
                    Educational Institutions
                  </a>
                </div>
              )}
            </div>
            <a href="#team" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-team">
              Team
            </a>
            <a href="#resources" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-resources">
              Resources
            </a>
            <div className="flex items-center gap-2">
              <button className="text-sm text-muted-foreground hover:text-foreground" data-testid="button-lang-en">
                EN
              </button>
              <span className="text-muted-foreground">|</span>
              <button className="text-sm text-muted-foreground hover:text-foreground" data-testid="button-lang-de">
                DE
              </button>
            </div>
            <Button data-testid="button-get-in-touch">Get in Touch</Button>
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
              <a href="#accounting" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-accounting">
                Accounting Firms
              </a>
              <a href="#ecommerce" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-ecommerce">
                E-commerce
              </a>
              <a href="#education" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-education">
                Educational Institutions
              </a>
              <a href="#team" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-team">
                Team
              </a>
              <a href="#resources" className="hover-elevate px-3 py-2 rounded-md" data-testid="mobile-link-resources">
                Resources
              </a>
              <div className="flex items-center gap-2 px-3">
                <button className="text-sm text-muted-foreground hover:text-foreground" data-testid="mobile-button-lang-en">
                  EN
                </button>
                <span className="text-muted-foreground">|</span>
                <button className="text-sm text-muted-foreground hover:text-foreground" data-testid="mobile-button-lang-de">
                  DE
                </button>
              </div>
              <Button className="w-full" data-testid="mobile-button-get-in-touch">
                Get in Touch
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

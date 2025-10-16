import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { teamMembers } from '@/data/team-data';

export default function TeamPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <span className="font-semibold">{t('team.badge')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {t('team.headline')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('team.subheadline')}
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('team.ctaHeadline')}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {t('team.ctaSubheadline')}
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              {t('team.ctaButton')}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

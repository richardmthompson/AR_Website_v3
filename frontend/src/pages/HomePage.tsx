import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import VerticalsSection from '@/components/VerticalsSection';
import InlineChatbot from '@/components/InlineChatbot';
import SolutionsSection from '@/components/SolutionsSection';
import TrustIndicators from '@/components/TrustIndicators';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <VerticalsSection />
      <InlineChatbot />
      <SolutionsSection />
      <TrustIndicators />
      <CTASection />
      <Footer />
    </div>
  );
}

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import VerticalsSection from '@/components/VerticalsSection';
import SolutionsSection from '@/components/SolutionsSection';
import TrustIndicators from '@/components/TrustIndicators';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <VerticalsSection />
      <SolutionsSection />
      <TrustIndicators />
      <CTASection />
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

import BestSellersSection from '@/components/home/BestSellersSection';
import CategorySection from '@/components/home/CategorySection';
import GlobalOutlookSection from '@/components/home/GlobalOutlookSection';
import HeritageSection from '@/components/home/HeritageSection';
import HeroSection from '@/components/home/HeroSection';
import ProcessSection from '@/components/home/ProcessSection';
import PromoSection from '@/components/home/PromoSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import USPSection from '@/components/home/USPSection';
import VideoSection from '@/components/home/VideoSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <USPSection />
      <CategorySection />
      <BestSellersSection />
      <HeritageSection />
      <ProcessSection />
      <VideoSection />
      <PromoSection />
      <GlobalOutlookSection />
      <TestimonialsSection />
    </>
  );
}

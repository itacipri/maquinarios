import { mockCategories } from '@/data/mock';
import { getActiveListings, getFeaturedListings } from '@/lib/listings';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedListings from '@/components/home/FeaturedListings';
import StatsBar from '@/components/home/StatsBar';
import HowItWorks from '@/components/home/HowItWorks';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import LatestListings from '@/components/home/LatestListings';

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedListings(),
    getActiveListings(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoryGrid categories={mockCategories} />
      <FeaturedListings listings={featured} />
      <HowItWorks />
      <LatestListings listings={latest.slice(0, 6)} />
      <WhyChooseUs />
    </>
  );
}

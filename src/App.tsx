import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustedBy } from './components/TrustedBy';
import { StickyMediaSection } from './components/StickyMediaSection';
import { IndustriesSection } from './components/IndustriesSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SEO } from './components/SEO';
import { siteContent } from './content/site';
import { useCMS } from './lib/cmsStore';

const SLIDE_DURATION_MS = 6000;

export function App() {
  const cms = useCMS();
  // Check if preloader has already completed or been seen
  const [preloaderDone, setPreloaderDone] = useState(() => {
    if (typeof window === "undefined") return true;
    return Boolean((window as any).__PRELOADER_DONE__ || sessionStorage.getItem('axia_preloader_seen'));
  });

  useEffect(() => {
    if (preloaderDone) return;
    const handleDone = () => setPreloaderDone(true);
    window.addEventListener('axia:preloader_done', handleDone, { once: true });
    const timer = setTimeout(() => setPreloaderDone(true), 2500);
    return () => {
      window.removeEventListener('axia:preloader_done', handleDone);
      clearTimeout(timer);
    };
  }, [preloaderDone]);

  // Slide & synchronized filling line progress state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const totalSlides = siteContent.hero.slides.length;

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  // Synchronized auto-advancing slides every 6000ms only after preloader finishes
  useEffect(() => {
    if (!preloaderDone) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((curr) => (curr + 1) % totalSlides);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [preloaderDone, totalSlides]);

  const handleSearch = (query: string) => {
    console.log('[Axia Kairos Search submitted]:', query);
  };

  const navigate = useNavigate();

  const handleTalkToUs = () => {
    navigate('/contact');
  };

  const handleAbout = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-axia-navy dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      <SEO
        title="AXIA KAIROS — Strategy that moves you forward."
        description="Axia Kairos Advisory & Technology Group — Strategy that moves you forward. Cloud Platform Modernization, SAP S/4HANA Migrations, AI & Managed Services."
        canonicalUrl="https://axiakairos.com/"
        ogImage="/l.webp"
      />
      {/* 1. Header (with integrated SunMoonThemeToggle & animated StrokeText) */}
      <Header onCtaClick={handleTalkToUs} />

      {/* 2. Main Page Content */}
      <main className="w-full flex flex-col items-start">
        {/* Section 1: Hero Showcase & Service Cards */}
        <div className="w-full min-h-[100dvh] sm:min-h-[640px] lg:min-h-[680px] xl:min-h-screen flex flex-col justify-between">
          <Hero
            currentSlideIndex={currentSlideIndex}
            onSlideChange={handleSlideChange}
            onSearch={handleSearch}
          />

          {/* Section 1 Footer: Live Trusted-By Strip with Synchronized Filling Line */}
          <TrustedBy
            currentSlide={currentSlideIndex + 1}
            totalSlides={totalSlides}
            progress={0}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>

        {/* Section 2: Sticky Left Media, Scrolling Right Content Feature Section */}
        <StickyMediaSection
          categoryTag={cms.homePage.aboutAxiaSection?.categoryTag}
          title={cms.homePage.aboutAxiaSection?.title}
          description={cms.homePage.aboutAxiaSection?.description}
          descriptionSecondary={cms.homePage.aboutAxiaSection?.descriptionSecondary}
          videoUrl={cms.homePage.aboutAxiaSection?.videoUrl}
          posterUrl={cms.homePage.aboutAxiaSection?.posterUrl}
          badgeText={cms.homePage.aboutAxiaSection?.badgeText}
          fleetTag={cms.homePage.aboutAxiaSection?.fleetTag}
          metrics={cms.homePage.aboutAxiaSection?.metrics}
          capabilities={cms.homePage.aboutAxiaSection?.capabilities}
          marqueeItems={cms.homePage.aboutAxiaSection?.marqueeItems}
          ctaHeadline={cms.homePage.aboutAxiaSection?.ctaHeadline}
          ctaSubtext={cms.homePage.aboutAxiaSection?.ctaSubtext}
          ctaButtonText={cms.homePage.aboutAxiaSection?.ctaButtonText}
          onCtaClick={handleAbout}
        />

        {/* Section 3: Industries We Serve (with Elastic Reel & Synced Descriptions) */}
        <IndustriesSection
          eyebrow={cms.homePage.industriesSection?.eyebrow}
          heading={cms.homePage.industriesSection?.heading}
          description={cms.homePage.industriesSection?.description}
          industries={cms.homePage.industriesSection?.items as any}
        />

        {/* Section 4: Frequently Asked Questions (FAQ) */}
        <FAQSection
          eyebrow={cms.homePage.faqSection?.eyebrow}
          title={cms.homePage.faqSection?.title}
          description={cms.homePage.faqSection?.description}
          imageSrc={cms.homePage.faqSection?.imageSrc}
          faqs={cms.homePage.faqSection?.faqs}
        />
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

export default App;

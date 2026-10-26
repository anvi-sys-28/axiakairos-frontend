import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Target, ShieldCheck, Globe, Users } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import DuotoneTeamRoster from '../components/ui/duotone-team-roster';
import { useCMS, DEFAULT_ABOUT_PAGE } from '../lib/cmsStore';

export function AboutPage() {
  const cms = useCMS();
  const about = cms.aboutPage || DEFAULT_ABOUT_PAGE;
  const roster = about.teamRoster || DEFAULT_ABOUT_PAGE.teamRoster;
  const story = about.storySection || DEFAULT_ABOUT_PAGE.storySection;
  const values = about.valuesSection || DEFAULT_ABOUT_PAGE.valuesSection;
  const focus = about.focusSection || DEFAULT_ABOUT_PAGE.focusSection;

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] dark:bg-[#05080e] text-[#0b192c] dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 overflow-x-clip transition-colors duration-300">
      <SEO
        title="About Axia Kairos — Strategic Leadership & Enterprise Transformation"
        description="Meet the minds behind Axia Kairos. Strategic consultants, digital architects, and transformation leaders empowering global enterprises."
        canonicalUrl="https://axiakairos.com/about"
        ogImage="/l.webp"
      />
      {/* 1. Header (with integrated AnimatedThemeToggle) */}
      <Header />

      {/* 2. First Section: Duotone Team & Leadership Roster */}
      <main className="w-full flex-1 flex flex-col">
        <DuotoneTeamRoster
          eyebrow={roster.eyebrow || 'LEADERSHIP · EXPERTISE · VALUES'}
          title={roster.title || 'The\nminds'}
          intro={roster.intro || 'Strategic consultants, digital architects, and transformation leaders empowering global enterprises to navigate complexity.'}
          cta={{
            label: roster.ctaLabel || 'Join the team',
            href: roster.ctaHref || '/careers',
          }}
          secondaryCta={{
            label: roster.secondaryCtaLabel || 'Our Approach →',
            href: roster.secondaryCtaHref || '/services',
          }}
          preset={isDark ? 'axiaDark' : 'axiaLight'}
          height="100vh"
          showPhotos={roster.showPhotos ?? true}
          columns={roster.columns || 3}
          driftSeconds={roster.driftSeconds || 22}
          members={roster.members && roster.members.length > 0 ? roster.members : DEFAULT_ABOUT_PAGE.teamRoster.members}
          openRoles={roster.openRoles && roster.openRoles.length > 0 ? roster.openRoles : DEFAULT_ABOUT_PAGE.teamRoster.openRoles}
        />

        {/* 3. Section 2: Story, Mission & Vision */}
        <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b14] transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#4945ff] dark:text-[#8c94ff] mb-3">
                  {story.eyebrow || 'OUR ORIGIN & PURPOSE'}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0b192c] dark:text-white leading-[1.15]">
                  {story.title || 'Architecting Sustainable Enterprise Transformation'}
                </h2>
              </div>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md">
                {story.tagline || 'Strategic consultants, digital architects, and transformation leaders empowering global enterprises to navigate complexity.'}
              </p>
            </div>

            {/* Overview Box */}
            <div className="p-8 md:p-12 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-16 shadow-xs">
              <p className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                {story.overview}
              </p>

              {story.locations && story.locations.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Globe className="w-4 h-4 text-[#4945ff]" />
                    <span>Global Footprint:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {story.locations.map((loc, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                  {story.headquarters && (
                    <span className="text-xs text-slate-500 ml-auto hidden lg:inline-block">
                      {story.headquarters}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Mission & Vision Dual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission Card */}
              <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#f8f9ff] to-white dark:from-[#0d1424] dark:to-[#070b14] border border-blue-100 dark:border-blue-950/60 relative overflow-hidden group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-[#4945ff] dark:text-[#8c94ff] mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0b192c] dark:text-white mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                  {story.mission}
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-[#fbf8ff] to-white dark:from-[#130d24] dark:to-[#070b14] border border-indigo-100 dark:border-indigo-950/60 relative overflow-hidden group">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-[#7048e8] dark:text-[#a78bfa] mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0b192c] dark:text-white mb-3">
                  Our Vision
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                  {story.vision}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Section 3: Core Enterprise Values */}
        {values.values && values.values.length > 0 && (
          <section className="py-24 px-6 md:px-12 lg:px-20 border-t border-slate-200 dark:border-slate-800/80 bg-[#f8f9fb] dark:bg-[#05080e] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#4945ff] dark:text-[#8c94ff] mb-3">
                  {values.eyebrow || 'OUR GUIDING PRINCIPLES'}
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0b192c] dark:text-white">
                  {values.title || 'Values That Anchor Every Client Engagement'}
                </h2>
                {values.description && (
                  <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm md:text-base">
                    {values.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.values.map((v, i) => (
                  <div
                    key={v.id || i}
                    className="p-7 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-[#4945ff]/40 dark:hover:border-[#4945ff]/40 transition-all duration-200 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black tracking-widest text-[#4945ff] dark:text-[#8c94ff]">
                        0{i + 1}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-[#4945ff] transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0b192c] dark:text-white mb-2">
                      {v.name}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Section 4: Strategic Focus Areas */}
        {focus.focusAreas && focus.focusAreas.length > 0 && (
          <section className="py-20 px-6 md:px-12 lg:px-20 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b14] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-2xl mb-12">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#4945ff] dark:text-[#8c94ff] mb-3">
                  {focus.eyebrow || 'PRACTICE CAPABILITIES'}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0b192c] dark:text-white">
                  {focus.title || 'Core Disciplines & Technology Domains'}
                </h2>
                {focus.description && (
                  <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
                    {focus.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {focus.focusAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#4945ff] shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>

              {/* Bottom CTA to Contact / Careers */}
              <div className="mt-16 p-8 md:p-12 rounded-2xl bg-gradient-to-r from-[#0b192c] to-[#12233f] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">
                    Ready to navigate your transformation?
                  </h3>
                  <p className="text-sm text-slate-300 max-w-xl">
                    Connect directly with our managing partners and practice architects to design your enterprise roadmap.
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Link
                    to="/contact"
                    className="px-6 py-3 rounded-lg bg-white text-[#0b192c] hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/careers"
                    className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Join Our Team
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Shared Ticket Stub Footer */}
      <Footer />
    </div>
  );
}

export default AboutPage;

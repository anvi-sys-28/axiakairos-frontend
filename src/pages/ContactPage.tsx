import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Mail, Phone, Headphones, Globe, Building2, ShieldCheck } from 'lucide-react';
import ContactWithGlobe, { CONTACT_LINKS } from '../components/ui/contact-with-globe';
import { useCMS } from '../lib/cmsStore';

export function ContactPage() {
  const cms = useCMS();
  const contact = cms.contactPage;
  const emails = contact?.emails || {
    general: 'contact@axiakairos.com',
    sales: 'sales@axiakairos.com',
    support: 'support@axiakairos.com',
  };
  const phone = contact?.phones?.general || '+1 (800) 321-4321';
  const offices = contact?.offices || [];

  const dynamicContactLinks = [
    {
      icon: Mail,
      label: emails.general,
      href: `mailto:${emails.general}`,
    },
    {
      icon: Phone,
      label: phone,
      href: `tel:${phone.replace(/[^0-9+]/g, '')}`,
    },
    {
      icon: Headphones,
      label: emails.sales || 'advisory@axiakairos.com',
      href: `mailto:${emails.sales || 'advisory@axiakairos.com'}`,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#05080e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-axia-slate/20 transition-colors duration-300">
      {/* SEO & Meta Tags */}
      <SEO
        title="Contact Us | Axia Kairos Enterprise Advisory"
        description="Connect with Axia Kairos principal consultants for enterprise digital transformation, cloud architecture, data engineering, and SAP advisory."
        canonicalUrl="https://axiakairos.com/contact"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Axia Kairos',
            description: 'Get in touch with Axia Kairos enterprise consultants.',
            url: 'https://axiakairos.com/contact',
          },
        ]}
      />

      {/* Floating Island Navigation Header */}
      <Header />

      {/* Main Content: Contact with Interactive 3D Wireframe Globe */}
      <main className="w-full flex-1 flex flex-col pt-20 sm:pt-24">
        <ContactWithGlobe
          title={contact?.title || "Let's build what's next."}
          subtitle={contact?.subtitle || "CONTACT AXIA KAIROS"}
          description={
            (contact as any)?.description ||
            "Reach our global advisory team across North America, EMEA, and APAC. Connect with a principal consultant to discuss your strategic enterprise initiatives."
          }
          contactLinks={dynamicContactLinks}
        />

        {/* Global Corporate Operating Hubs Section */}
        {offices && offices.length > 0 && (
          <section className="py-20 px-6 sm:px-10 lg:px-16 border-t border-slate-200 dark:border-slate-800 bg-[#f8f9fb] dark:bg-[#070b14] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#4945ff] dark:text-[#8c94ff] mb-2 font-mono">
                  GLOBAL FOOTPRINT
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0b192c] dark:text-white">
                  Corporate Operating Hubs
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Global presence serving enterprise leaders across North America, India, and the Middle East.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {offices.map((office, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-[#4945ff]/40 dark:hover:border-[#4945ff]/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl" role="img" aria-label={office.country}>
                          {office.flag}
                        </span>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#eafbe7] text-[#288226] border border-[#bbf2b6]">
                          {office.status || 'Active Operations'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0b192c] dark:text-white mb-1">
                        {office.country}
                      </h3>
                      <p className="text-xs font-semibold text-[#4945ff] dark:text-[#8c94ff] mb-3">
                        {office.region}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {office.note}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-[#4945ff]" />
                      <span>Executive Hub</span>
                    </div>
                  </div>
                ))}
              </div>

              {contact?.noteOnStreetAddresses && (
                <div className="mt-12 p-5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center max-w-3xl mx-auto">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {contact.noteOnStreetAddresses}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Shared Ticket Stub Footer */}
      <Footer />
    </div>
  );
}

export default ContactPage;

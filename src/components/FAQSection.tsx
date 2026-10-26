import FaqSections from './ui/faq-sections';
import { DiamondBackdrop } from './ui/diamond-backdrop';

export interface FAQSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export function FAQSection({
  eyebrow,
  title,
  description,
  imageSrc,
  faqs,
}: FAQSectionProps = {}) {
  return (
    <section
      id="faqs"
      aria-label="Frequently Asked Questions"
      className="diamond-zone w-full bg-white dark:bg-[#05080e] text-[#0b192c] dark:text-white py-16 sm:py-20 lg:py-24 border-t border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative Overlapping Diamond Rhombus Backdrop */}
      <DiamondBackdrop variant="faq" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <FaqSections
          eyebrow={eyebrow}
          title={title}
          description={description}
          imageSrc={imageSrc}
          faqs={faqs}
        />
      </div>
    </section>
  );
}

export default FAQSection;

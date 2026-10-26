// Verbatim data from axiakairos.com/about-us
// Single source of truth for About Us page, SEO, and AI Chatbot Knowledge Base

export interface OfficeHeadquarters {
  company: string;
  address: string;
  googleMapsUrl: string;
}

export interface OperatingCountry {
  name: string;
  flag: string;
}

export interface MissionVisionBlock {
  key: 'mission' | 'vision';
  label: string; // mono uppercase
  title: string;
  headline: string;
  description: string;
  bulletLead: string;
  bullets: string[];
}

export interface CoreValueItem {
  index: string; // '01' - '05'
  title: string;
  description: string;
  devPlaceholder?: string;
  isDuplicateError?: boolean;
}

export interface MilestoneItem {
  id: string;
  date: string; // ISO date format "YYYY-MM-DD" for chronological sorting
  displayDate: string; // "October 2024", "February 2025", etc.
  text: string;
  status: 'completed' | 'upcoming';
}

export interface WhyPointItem {
  index: number;
  title: string;
  description: string;
}

export interface PartnerSectionData {
  eyebrow: string;
  question: string;
  heading: string;
  paragraph: string;
}

export interface AboutPageData {
  title: string;
  tagline: string;
  overview: string;
  headquarters: string;
  locations: string[];
  focusAreas: string[];
  mission: string;
  vision: string;
  values: Array<{ name: string; description: string }>;

  // Verbatim Structured Sections
  whoWeAre: {
    eyebrow: string;
    heading: string;
    lead: string;
    headquarters: OfficeHeadquarters[];
    operatingCountries: OperatingCountry[];
    focusAreas: string[];
  };

  missionVision: {
    eyebrow: string;
    heading: string;
    // Note: Live statements extracted verbatim from live Next.js RSC state on axiakairos.com/about-us
    // TODO(client): "Mission/Vision statements needed" (if customized or rewritten)
    cards: MissionVisionBlock[];
  };

  coreValues: {
    eyebrow: string;
    heading: string;
    lead: string;
    values: CoreValueItem[];
  };

  journeyAndMilestones: {
    eyebrow: string;
    heading: string;
    lead: string;
    // TODO(client): "Milestones are dated; request updates after Nov 2025"
    milestones: MilestoneItem[];
  };

  whyAxiaKairos: {
    eyebrow: string;
    heading: string;
    lead: string;
    // TODO(client): "Confirm client consent to be named" (re: Valvolink reference in item 5)
    points: WhyPointItem[];
  };

  partnerWithUs: PartnerSectionData;
}

export const aboutData: AboutPageData = {
  title: "About Axiakairos | IT & Digital Transformation Experts",
  tagline: "Strategic consultants, digital architects, and transformation leaders empowering global enterprises to navigate complexity.",
  overview: "Axia Kairos is a next-gen tech consulting firm specializing in enterprise transformation, cloud modernization, and data innovation. We empower businesses to unlock their full potential.\n\nWith a global presence across Canada, the United States, UAE, and India, Axia Kairos brings deep enterprise architecture expertise and SAP consulting experience, helping organizations translate complexity into clarity and vision into execution.",
  headquarters: "Toronto, Canada & Bangalore, India",
  locations: ["Canada", "USA", "UAE", "India"],
  focusAreas: [
    "SAP",
    "Data Analytics",
    "Digital Transformation",
    "Automation",
    "AI",
    "Cybersecurity",
    "Enterprise Modernization",
  ],
  mission: "To empower enterprises with strategic clarity, operational excellence, and transformative innovation that deliver measurable business impact.",
  vision: "To be the most trusted global management consulting partner, helping organizations achieve sustainable growth, resilience, and digital leadership in an ever-evolving business landscape.",
  values: [
    {
      name: "Integrity",
      description: "Transparency and trust form the foundation of our client partnerships.",
    },
    {
      name: "Excellence",
      description: "We deliver world-class consulting and execution in every engagement.",
    },
    {
      name: "Innovation",
      description: "Transparency and trust form the foundation of our client partnerships.",
    },
    {
      name: "Client-Centricity",
      description: "Every solution is designed with the client's business outcomes in mind.",
    },
    {
      name: "Collaboration",
      description: "We work hand-in-hand with clients to co-create success.",
    },
  ],

  // SECTION 2: "Who We Are"
  whoWeAre: {
    eyebrow: "WHO WE ARE",
    heading: "Who We Are",
    lead: "Axia Kairos is a next-gen tech consulting firm specializing in enterprise transformation, cloud modernization, and data innovation. We empower businesses to unlock their full potential.\n\nWith a global presence across Canada, the United States, UAE, and India, Axia Kairos brings deep enterprise architecture expertise and SAP consulting experience, helping organizations translate complexity into clarity and vision into execution.",
    headquarters: [
      {
        company: "Axia Kairos Consulting Inc",
        address: "34 Minowan Miikan Lane, Toronto, ON, M6J0G3, Canada",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=34+Minowan+Miikan+Lane%2C+Toronto%2C+ON%2C+M6J0G3%2C+Canada",
      },
      {
        company: "Axia Kairos Software Solutions Pvt. Ltd.",
        address: "Regus, The Estate, 8th Floor, Dickenson Road, Bangalore, India - 560042",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Regus%2C+The+Estate%2C+8th+Floor%2C+Dickenson+Road%2C+Bangalore%2C+India+-+560042",
      },
    ],
    operatingCountries: [
      { name: "Canada", flag: "🇨🇦" },
      { name: "USA", flag: "🇺🇸" },
      { name: "UAE", flag: "🇦🇪" },
      { name: "India", flag: "🇮🇳" },
    ],
    focusAreas: [
      "SAP",
      "Data Analytics",
      "Digital Transformation",
      "Automation",
      "AI",
      "Cybersecurity",
      "Enterprise Modernization",
    ],
  },

  // SECTION 3: "Mission" and "Vision"
  // Note: Statements recovered verbatim from live Next.js RSC payload on axiakairos.com/about-us
  // TODO(client): "Mission/Vision statements needed" (if customized or rewritten)
  missionVision: {
    eyebrow: "MISSION & VISION",
    heading: "Mission & Vision",
    cards: [
      {
        key: "mission",
        label: "MISSION",
        title: "Our Mission",
        headline: "To empower enterprises with strategic clarity, operational excellence, and transformative innovation that deliver measurable business impact.",
        bulletLead: "We achieve this by:",
        bullets: [
          "Aligning business objectives with cutting-edge technology strategies.",
          "Driving enterprise-wide modernization through scalable digital solutions.",
          "Fostering a culture of agility, collaboration, and continuous improvement.",
          "Delivering measurable outcomes that fuel long-term growth and efficiency.",
        ],
        description: "To empower enterprises with strategic clarity, operational excellence, and transformative innovation that deliver measurable business impact.\n\nWe achieve this by:\n- Aligning business objectives with cutting-edge technology strategies.\n- Driving enterprise-wide modernization through scalable digital solutions.\n- Fostering a culture of agility, collaboration, and continuous improvement.\n- Delivering measurable outcomes that fuel long-term growth and efficiency.",
      },
      {
        key: "vision",
        label: "VISION",
        title: "Our Vision",
        headline: "To be the most trusted global management consulting partner, helping organizations achieve sustainable growth, resilience, and digital leadership in an ever-evolving business landscape.",
        bulletLead: "Our vision is guided by:",
        bullets: [
          "Commitment to excellence and client success.",
          "A future-ready approach rooted in innovation and governance.",
          "Deep expertise across industries and emerging technologies.",
          "A mission to create organizations that not only adapt to change but lead it.",
        ],
        description: "To be the most trusted global management consulting partner, helping organizations achieve sustainable growth, resilience, and digital leadership in an ever-evolving business landscape.\n\nOur vision is guided by:\n- Commitment to excellence and client success.\n- A future-ready approach rooted in innovation and governance.\n- Deep expertise across industries and emerging technologies.\n- A mission to create organizations that not only adapt to change but lead it.",
      },
    ],
  },

  // SECTION 4: "Our Core Values"
  coreValues: {
    eyebrow: "OUR GUIDING PRINCIPLES",
    heading: "Our Core Values",
    lead: "We operate with a global delivery footprint, combining local expertise with global scale.",
    values: [
      {
        index: "01",
        title: "Integrity",
        description: "Transparency and trust form the foundation of our client partnerships.",
      },
      {
        index: "02",
        title: "Excellence",
        // Typo fixed from live site: removed stray period after "every" (live site text had "in every. engagement.")
        description: "We deliver world-class consulting and execution in every engagement.",
      },
      {
        index: "03",
        title: "Innovation",
        // The live site shows the SAME sentence as Integrity ("Transparency and trust form the foundation of our client partnerships."), which is clearly a copy-paste error.
        // TODO(client): "Innovation description duplicates Integrity; client to provide correct text"
        description: "Transparency and trust form the foundation of our client partnerships.",
        devPlaceholder: "[TODO(client): Innovation description duplicates Integrity; client to provide correct text]",
        isDuplicateError: true,
      },
      {
        index: "04",
        title: "Client-Centricity",
        description: "Every solution is designed with the client's business outcomes in mind.",
      },
      {
        index: "05",
        title: "Collaboration",
        description: "We work hand-in-hand with clients to co-create success.",
      },
    ],
  },

  // SECTION 5: "Our Journey & Milestones"
  journeyAndMilestones: {
    eyebrow: "OUR JOURNEY & MILESTONES",
    heading: "Our Journey & Milestones",
    lead: "Every step in our journey reflects our growth as a trusted consulting partner",
    // TODO(client): "Milestones are dated; request updates after Nov 2025"
    milestones: [
      {
        id: "milestone-1",
        date: "2024-10-01",
        displayDate: "October 2024",
        text: "To mark the beginning of our journey, we initiated our first major engagement with a leading Automobile Lubricant client, setting the foundation for long-term strategic partnerships.",
        status: "completed",
      },
      {
        id: "milestone-2",
        date: "2025-02-07",
        displayDate: "February 2025",
        text: "Onboarded a new customer in the pharma sector, expanding our domain footprint and strengthening our position across regulated industries.",
        status: "completed",
      },
      {
        id: "milestone-3",
        date: "2025-09-01",
        displayDate: "September 2025",
        text: "Added a retail sector customer, enhancing our multi-industry portfolio and enabling accelerated growth across diverse business verticals.",
        status: "completed",
      },
      {
        id: "milestone-4",
        date: "2025-10-01",
        displayDate: "October 2025",
        text: "Incorporated Axia Kairos Software Solutions Pvt. Ltd., Bangalore, India—establishing our formal presence to drive innovation and digital excellence.",
        status: "completed",
      },
      {
        id: "milestone-5",
        date: "2025-11-01",
        displayDate: "November 2025",
        text: "Expansion plans are currently under evaluation. Additional milestones will be updated as the roadmap is finalized.",
        status: "upcoming",
      },
    ],
  },

  // SECTION 6: "Why Axia Kairos"
  whyAxiaKairos: {
    eyebrow: "WHY AXIA KAIROS",
    heading: "Why Axia Kairos",
    lead: "What makes us different is our consulting DNA — we go beyond technology to align strategy, governance, and execution.",
    points: [
      {
        index: 1,
        title: "Management Consulting First",
        description: "Solutions are business-driven, not just technology-driven.",
      },
      {
        index: 2,
        title: "Outcome-Based Engagements",
        description: "Success is measured by results, not deliverables.",
      },
      {
        index: 3,
        title: "Cross-Industry Expertise",
        description: "Deep domain experience across multiple sectors.",
      },
      {
        index: 4,
        title: "Global Scale, Local Touch",
        description: "Presence in four countries with region-specific expertise.",
      },
      {
        index: 5,
        title: "Trusted by Clients",
        // Note: Verbatim copy from live site.
        // TODO(client): "Confirm client consent to be named"
        description: "Partnerships with leading enterprises, including global names like Valvolink.",
      },
    ],
  },

  // SECTION 7: "Partner With Us"
  partnerWithUs: {
    eyebrow: "PARTNER WITH US",
    question: "Have a query or partnership idea?",
    heading: "Partner with Us",
    paragraph: "Join hands with Axia Kairos to explore strategic collaborations that drive innovation, digital growth, and business excellence. Let's build solutions that transform enterprises and create lasting impact — together.",
  },
};

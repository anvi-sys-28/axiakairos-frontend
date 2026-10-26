import { useState, useEffect } from 'react';
import { siteContent as defaultSiteContent } from '@/content/site';
import { aboutData as defaultAboutData } from '@/data/about';
import { contactData as defaultContactData } from '@/data/contact';
import { approachData as defaultApproachData } from '@/data/approach';
import { industries as defaultIndustries, type Industry } from '@/data/industries';
import { legalData as defaultLegalData } from '@/data/legal';
import { products as defaultProducts, type Product } from '@/data/products';
import { servicesData as defaultServicesData, type Service } from '@/data/services';
import { caseStudies as defaultCaseStudies, type CaseStudyItem } from '@/data/caseStudies';
import { blogs as defaultBlogs, type BlogPost } from '@/data/blogs';
import { jobs as defaultJobs, type Job } from '@/data/jobs';

export const CMS_STORAGE_KEY = 'axia_cms_content_v1';
export const CMS_UPDATE_EVENT = 'axia-cms-update';

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  craft: string;
  bio: string;
  photo: string;
  href: string;
  linkLabel: string;
  focus?: string;
  exposure?: number;
}

export interface OpenRoleItem {
  id: string;
  title: string;
  href: string;
  craft: string;
  note: string;
  mark?: string;
  linkLabel?: string;
}

export interface CoreValueItem {
  id: string;
  name: string;
  description: string;
}

export interface AboutPageData {
  teamRoster: {
    eyebrow: string;
    title: string;
    intro: string;
    ctaLabel: string;
    ctaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    showPhotos: boolean;
    columns: number;
    driftSeconds: number;
    members: TeamMemberItem[];
    openRoles: OpenRoleItem[];
  };
  storySection: {
    eyebrow: string;
    title: string;
    tagline: string;
    overview: string;
    mission: string;
    vision: string;
    headquarters: string;
    locations: string[];
    bannerImage?: string;
  };
  valuesSection: {
    eyebrow: string;
    title: string;
    description: string;
    values: CoreValueItem[];
  };
  focusSection: {
    eyebrow: string;
    title: string;
    description: string;
    focusAreas: string[];
  };
}

export interface CMSData {
  documentId: string;
  lastPublished: string;
  status: 'draft' | 'published';
  aboutPage: AboutPageData;
  homePage: {
    heroSection: {
      header1: string;
      header2: string;
      description: string;
      heroImage: string;
      heroImageAltText: string;
      eyebrow: string;
      searchPlaceholder: string;
      subtext1: string;
      subtext2: string;
      verticalLabels: string[];
    };
    servicesOverview?: {
      heading: string;
      tagline: string;
    };
    trustedByHeading: string;
    aboutAxiaSection?: {
      badgeText: string;
      categoryTag: string;
      title: string;
      description: string;
      descriptionSecondary: string;
      videoUrl: string;
      posterUrl: string;
      fleetTag?: string;
      metrics: Array<{ value: string; label: string }>;
      capabilities: Array<{ id: string; tag: string; title: string; description: string }>;
      marqueeItems: string[];
      ctaHeadline: string;
      ctaSubtext: string;
      ctaButtonText: string;
    };
    industriesSection?: {
      eyebrow: string;
      heading: string;
      description: string;
      items: Array<{
        id: string;
        title: string;
        tag: string;
        headline: string;
        shortDescription: string;
        longDescription: string;
        focusAreas: string[];
        impactMetric: { value: string; label: string };
        image: string;
        fallbackImage?: string;
        caseStudySlug?: string;
      }>;
    };
    faqSection?: {
      eyebrow: string;
      title: string;
      description: string;
      imageSrc: string;
      faqs: Array<{ question: string; answer: string }>;
    };
  };
  navbar: {
    brand: string;
    trademark: string;
    sub: string;
    ctaLabel: string;
    ctaHref: string;
    navLinks: Array<{ label: string; href: string }>;
  };
  footer: {
    copyright: string;
    tagline: string;
    email: string;
    phone: string;
    columns: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
  };
  aboutUsPage: typeof defaultAboutData;
  contactPage: typeof defaultContactData;
  ourApproachPage: typeof defaultApproachData;
  industryPage: Industry[];
  privacyPolicyPage: typeof defaultLegalData.privacyPolicy;
  termsAndConditionPage: typeof defaultLegalData.termsAndConditions;
  productPage: Product[];
  robot: {
    name: string;
    avatarUrl: string;
    status: 'online' | 'offline';
    welcomeMessage: string;
    systemPrompt: string;
    quickReplies: string[];
  };
  llm: {
    model: string;
    provider?: 'openai' | 'anthropic';
    apiKey?: string;
    temperature: number;
    maxTokens: number;
    searchEnabled: boolean;
    groundednessThreshold: number;
  };
  redirect: Array<{ from: string; to: string; permanent: boolean }>;
  sitemap: Array<{ url: string; priority: number; changefreq: string }>;
  users: Array<{ id: string; username: string; role: string; email: string; active: boolean }>;
  services: Service[];
  caseStudies: CaseStudyItem[];
  blogs: BlogPost[];
  careers: Job[];
}

export const DEFAULT_ABOUT_AXIA_SECTION = {
  badgeText: 'ABOUT AXIA KAIROS',
  categoryTag: 'About Axia Kairos',
  title: 'Global IT Transformation Partner',
  description:
    'Axia Kairos is a global management consulting firm helping organizations achieve enterprise modernization through SAP, cloud, data transformation, and more.',
  descriptionSecondary:
    'With expertise across industries and markets, we simplify complexity, enhance performance, and deliver measurable outcomes, enabling clients to move from transformation vision to execution seamlessly.',
  videoUrl: 'https://cdn.coverr.co/videos/coverr-cargo-ship-arriving-at-port-9268/1080p.mp4',
  posterUrl: '/assets/card_sunset.webp',
  fleetTag: 'ENTERPRISE TRANSFORMATION · GLOBAL ADVISORY',
  metrics: [
    { value: '15+', label: 'YEARS EXCELLENCE' },
    { value: '250+', label: 'ENTERPRISE CLIENTS' },
    { value: '99.8%', label: 'DELIVERY SUCCESS' },
    { value: '40+', label: 'GLOBAL MARKETS' },
  ],
  capabilities: [
    {
      id: 'sap-cloud',
      tag: 'ENTERPRISE ERP & CLOUD',
      title: 'SAP S/4HANA & Cloud Modernization',
      description:
        'End-to-end advisory, migration, and implementation accelerating legacy transition to modern hyperscaler and SAP BTP environments.',
    },
    {
      id: 'ai-automation',
      tag: 'INTELLIGENT PROCESSES',
      title: 'Enterprise AI & Intelligent Automation',
      description:
        'Generative AI co-pilots, computer vision QA, algorithmic decision engines, and Robotic Process Automation (RPA) at scale.',
    },
    {
      id: 'data-analytics',
      tag: 'ENTERPRISE INTELLIGENCE',
      title: 'Data Engineering & Predictive Analytics',
      description:
        'Modern Lakehouse architectures, real-time streaming ETL pipelines, and semantic governance driving data-driven decisions.',
    },
    {
      id: 'managed-services',
      tag: 'RESILIENCE & SUPPORT',
      title: '24/7 Managed IT & Cyber Security',
      description:
        'Zero-trust posture, proactively managed hybrid infrastructure, and round-the-clock SLA-backed enterprise support.',
    },
  ],
  marqueeItems: [
    'SAP S/4HANA MIGRATION & ADVISORY',
    'CLOUD PLATFORM MODERNIZATION',
    'ENTERPRISE AI & AUTOMATION',
    'DATA ENGINEERING & ANALYTICS',
    'CYBER SECURITY & GOVERNANCE',
    '24/7 MANAGED IT SERVICES',
    'STRATEGIC MANAGEMENT CONSULTING',
  ],
  ctaHeadline: 'Ready to transform your enterprise architecture?',
  ctaSubtext: 'Schedule a confidential discovery session with our executive advisory team.',
  ctaButtonText: 'Explore Enterprise Capabilities',
};

export const DEFAULT_HOME_INDUSTRIES = [
  {
    id: 'automotive-manufacturing',
    title: 'Automotive & Manufacturing',
    tag: 'SMART FACTORY & IOT',
    headline: 'Intelligent Manufacturing & Connected Automotive Ecosystems',
    longDescription:
      'Accelerating smart factory initiatives, Industry 4.0 automation, connected vehicle telemetry, and resilient supply chain logistics through SAP S/4HANA Manufacturing, predictive maintenance, and edge IoT analytics.',
    shortDescription: 'Industry 4.0 automation, connected vehicle telemetry, and predictive maintenance ERP.',
    focusAreas: [
      'SAP Digital Manufacturing & Shop-Floor Execution',
      'Predictive Maintenance & Computer Vision QA',
      'Resilient Multi-Tier Automotive Supply Chain',
    ],
    impactMetric: { value: '38%', label: 'Reduction in unplanned machine downtime' },
    image: '/assets/case-studies/manufacturing-automation-sap-btp.webp',
  },
  {
    id: 'bfsi',
    title: 'Banking, Financial Services, & Insurance',
    tag: 'CORE BANKING & RISK',
    headline: 'Resilient Financial Architectures & Zero-Downtime Modernization',
    longDescription:
      'Modernizing core banking ledgers, automated compliance reporting, AI fraud intelligence, and seamless digital customer experiences with mission-critical security and zero-downtime database migration.',
    shortDescription: 'Core banking modernization, real-time fraud intelligence, and automated compliance.',
    focusAreas: [
      'Core Banking Cloud & Ledger Modernization',
      'Real-Time Fraud Prevention & AML Pipelines',
      'Basel III & Regulatory Compliance Automation',
    ],
    impactMetric: { value: '99.999%', label: 'Platform uptime across transactional ledgers' },
    image: '/assets/case-studies/sap-s4hana-migration-bfsi.webp',
  },
  {
    id: 'energy-utilities',
    title: 'Energy & Utilities',
    tag: 'GRID TELEMETRY & SMART METERS',
    headline: 'Next-Generation Smart Grid Telemetry & Decarbonization',
    longDescription:
      'Enabling smart grid telemetry, renewable asset condition monitoring, high-frequency utility meter billing, and regulatory carbon footprint tracking for forward-thinking power providers.',
    shortDescription: 'Smart grid telemetry, renewable asset management, and high-frequency utility billing.',
    focusAreas: [
      'Smart Meter & Grid Telemetry Orchestration',
      'Renewable Asset Lifecycle & Field Service Automation',
      'SAP Utilities (IS-U) & S/4HANA Modernization',
    ],
    impactMetric: { value: '42%', label: 'Faster outage localization & grid restoration' },
    image:
      '/assets/case-studies/sap-s-4-hana-migration-and-data-governance-modernization-for-a-global-energy-and-utilities-enterprise.webp',
  },
  {
    id: 'healthcare-life-sciences',
    title: 'Healthcare & Life Sciences',
    tag: 'CLINICAL & PATIENT DATA',
    headline: 'FHIR-Compliant Healthcare Interoperability & Clinical Intelligence',
    longDescription:
      'Transforming clinical care delivery with HIPAA/HL7 FHIR compliant interoperability backbones, clinical data lakes, electronic health record (EHR) modernizations, and hospital operational efficiency.',
    shortDescription: 'HIPAA/FHIR interoperability, clinical data lakes, and hospital operational analytics.',
    focusAreas: [
      'FHIR / HL7 Interoperability & Data Pipelines',
      'Clinical Trials Analytics & Research Lakes',
      'Healthcare Enterprise ERP & Supply Assurance',
    ],
    impactMetric: { value: '99.9%', label: 'Clinical record integration accuracy & privacy' },
    image: '/assets/case-studies/healthcare-data-integration-sap-btp.webp',
  },
  {
    id: 'lending-fintech',
    title: 'Lending & FinTech',
    tag: 'ALGORITHMIC UNDERWRITING',
    headline: 'High-Speed Alternative Credit Underwriting & Open Banking',
    longDescription:
      'Powering algorithmic credit decisioning engines, instant digital KYC onboarding, open banking API integrations, and real-time fraud mitigation for high-growth neo-lenders and digital banks.',
    shortDescription: 'Algorithmic credit decisioning, instant KYC onboarding, and open banking APIs.',
    focusAreas: [
      'Sub-Minute Loan Underwriting & Scoring Pipelines',
      'Open Banking PSD2 / Open API Gateways',
      'Instant KYC, AML & Sanctions Screening',
    ],
    impactMetric: { value: '<45s', label: 'Automated underwriting turnaround time' },
    image: '/assets/case-studies/sap-s4hana-migration-bfsi.webp',
  },
  {
    id: 'oil-gas',
    title: 'Oil & Gas',
    tag: 'DOWNSTREAM & OFFSHORE IOT',
    headline: 'Digital Oilfield Automation & Downstream Asset Optimization',
    longDescription:
      'Automating upstream and downstream oilfield operations with edge IoT sensor telemetry, predictive pipeline maintenance, refinery throughput analytics, and hazardous area remote inspections.',
    shortDescription: 'Digital oilfield automation, predictive pipeline maintenance, and safety telemetry.',
    focusAreas: [
      'Refinery SCADA & IoT Telemetry Modernization',
      'Predictive Asset Maintenance & Safety Compliance',
      'Hydrocarbon Supply Chain Optimization',
    ],
    impactMetric: { value: '28%', label: 'Reduction in pipeline maintenance cycle duration' },
    image: '/assets/case-studies/data-engineering-oil-gas.webp',
  },
];

export const DEFAULT_HOME_FAQS = [
  {
    question: 'What enterprise modernization services does Axia Kairos provide?',
    answer:
      'Axia Kairos specializes in end-to-end management consulting and digital transformation, including SAP S/4HANA migrations, cloud platform modernization (AWS, Azure, GCP), enterprise AI and automation, data engineering, and 24/7 managed IT services.',
  },
  {
    question: 'How does Axia Kairos approach SAP S/4HANA migration?',
    answer:
      'We leverage proven greenfield, brownfield, and selective data transition methodologies combined with SAP Business Technology Platform (BTP). Our phased approach minimizes operational disruption and guarantees business continuity.',
  },
  {
    question: 'What industries do you specialize in?',
    answer:
      'We serve 12 global mission-critical sectors including BFSI, Manufacturing & Automotive, Aviation & Aerospace, Healthcare & Life Sciences, Energy & Utilities, E-Commerce & Retail, FinTech, and Public Sector.',
  },
  {
    question: 'How do you ensure enterprise data governance and cyber security?',
    answer:
      'Our architectures incorporate zero-trust security principles, strict regulatory compliance (SOC 2, ISO 27001, HIPAA, GDPR), automated audit trails, and proactive 24/7 SOC infrastructure monitoring.',
  },
  {
    question: 'How can our enterprise initiate an engagement with Axia Kairos?',
    answer:
      'You can request an initial architectural assessment through our contact page or speak directly with our domain practice leaders to evaluate your roadmap, scope, and timeline.',
  },
];

export const DEFAULT_ABOUT_PAGE: AboutPageData = {
  teamRoster: {
    eyebrow: 'LEADERSHIP · EXPERTISE · VALUES',
    title: 'The\nminds',
    intro:
      'Strategic consultants, digital architects, and transformation leaders empowering global enterprises to navigate complexity.',
    ctaLabel: 'Join the team',
    ctaHref: '/careers',
    secondaryCtaLabel: 'Our Approach →',
    secondaryCtaHref: '/services',
    showPhotos: false,
    columns: 3,
    driftSeconds: 22,
    members: [
      {
        id: 'tm-1',
        name: 'Aaditya Sharma',
        role: 'Managing Principal & Founder',
        craft: 'Enterprise Advisory',
        bio: '20+ years steering large-scale digital operating models, executive advisory, and cloud-native business modernizations.',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        href: 'mailto:contact@axiakairos.com',
        linkLabel: 'Connect',
        focus: '50% 25%',
      },
      {
        id: 'tm-2',
        name: 'Elena Rostova',
        role: 'Chief Technology & AI Officer',
        craft: 'Cognitive AI',
        bio: 'Pioneering autonomous systems, agentic workflow architectures, and resilient enterprise-grade machine learning pipelines.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        href: 'mailto:contact@axiakairos.com',
        linkLabel: 'Connect',
        focus: '50% 20%',
      },
      {
        id: 'tm-3',
        name: 'Marcus Bell',
        role: 'VP of SAP Transformation',
        craft: 'SAP S/4HANA',
        bio: 'Delivered 40+ global SAP S/4HANA migrations with zero unplanned downtime across mission-critical supply chains.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        href: 'mailto:contact@axiakairos.com',
        linkLabel: 'Connect',
        focus: '50% 22%',
      },
      {
        id: 'tm-4',
        name: 'Sophia Chen',
        role: 'Head of Cloud & Infrastructure',
        craft: 'Multi-Cloud',
        bio: 'Kubernetes, multi-region resilience, and hybrid multi-cloud infrastructure architect for regulated global enterprises.',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        href: 'mailto:contact@axiakairos.com',
        linkLabel: 'Connect',
        focus: '50% 24%',
      },
      {
        id: 'tm-5',
        name: 'David Morales',
        role: 'Director of Cyber Security & Governance',
        craft: 'Cyber Defense',
        bio: 'Specialist in Zero Trust security frameworks, sovereign cloud compliance, SOC-2 readiness, and enterprise risk containment.',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        href: 'mailto:contact@axiakairos.com',
        linkLabel: 'Connect',
        focus: '50% 22%',
      },
      {
        id: 'tm-6',
        name: 'Priya Nair',
        role: 'Partner, Process Automation',
        craft: 'Automation',
        bio: 'Spearheading hyper-automation initiatives, slashing enterprise processing cycle times by up to 65%.',
        photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
        href: 'mailto:contact@axiakairos.com',
        linkLabel: 'Connect',
        focus: '50% 26%',
      },
    ],
    openRoles: [
      {
        id: 'role-1',
        title: 'Lead SAP Solution Architect',
        craft: 'SAP S/4HANA',
        note: 'Lead enterprise architecture transformations for North American manufacturing and logistics leaders.',
        href: '/careers',
        mark: 'You?',
        linkLabel: 'Explore Role',
      },
      {
        id: 'role-2',
        title: 'Senior Cognitive AI Engineer',
        craft: 'Agentic AI',
        note: 'Design autonomous multi-agent orchestration tools and retrieval-augmented systems.',
        href: '/careers',
        mark: 'Join',
        linkLabel: 'Explore Role',
      },
    ],
  },
  storySection: {
    eyebrow: 'OUR ORIGIN & PURPOSE',
    title: 'Architecting Sustainable Enterprise Transformation',
    tagline: 'Strategic consultants, digital architects, and transformation leaders empowering global enterprises to navigate complexity.',
    overview:
      'Axia Kairos is a premier global management and technology consulting firm. We partner with forward-thinking business leaders to architect and deliver digital transformations that build institutional resilience, elevate customer experiences, and drive sustainable growth. Combining strategic advisory, SAP expertise, cloud modernization, data engineering, and automation, we bridge the gap between bold vision and flawless execution.',
    mission:
      'To empower global enterprises to achieve transformative, sustainable growth by orchestrating state-of-the-art technology, data intelligence, and human ingenuity.',
    vision:
      'To be the most trusted transformation partner for enterprise leaders worldwide, recognized for deep domain expertise, disciplined delivery, and measurable client success.',
    headquarters: 'Global operations with primary hubs in North America and India.',
    locations: ['Canada', 'India', 'USA', 'UAE'],
    bannerImage: '/assets/card_sunset.webp',
  },
  valuesSection: {
    eyebrow: 'OUR GUIDING PRINCIPLES',
    title: 'Values That Anchor Every Client Engagement',
    description:
      'Our culture is grounded in disciplined rigor, intellectual honesty, and an obsessive commitment to client value creation.',
    values: [
      {
        id: 'val-1',
        name: 'Integrity',
        description: 'We act with uncompromised ethics, transparency, and accountability in every client engagement.',
      },
      {
        id: 'val-2',
        name: 'Excellence',
        description: 'Excellence is our standard, driven by rigorous methodologies, deep domain expertise, and precision execution.',
      },
      {
        id: 'val-3',
        name: 'Innovation',
        description: 'We harness emerging technologies to create future-ready solutions that give our clients lasting competitive advantage.',
      },
      {
        id: 'val-4',
        name: 'Client-Centricity',
        description: 'We measure our success entirely by the tangible value and business outcomes we generate for our clients.',
      },
      {
        id: 'val-5',
        name: 'Collaboration',
        description: 'We co-create with client teams, building trust, mutual accountability, and shared ownership of results.',
      },
    ],
  },
  focusSection: {
    eyebrow: 'PRACTICE CAPABILITIES',
    title: 'Core Disciplines & Technology Domains',
    description: 'Targeted expertise engineered to solve mission-critical organizational challenges.',
    focusAreas: [
      'SAP Advisory, Implementation, Migrations & Support',
      'Cloud Platform Modernization (AWS, Azure, GCP)',
      'Data Engineering & Advanced Analytics',
      'Business Process Automation & Intelligent Workflows',
      'Digital Transformation & Architecture Advisory',
      'Cyber Security, Compliance & Governance',
    ],
  },
};

export const getDefaultCMSData = (): CMSData => ({
  documentId: 'w6nq1d9lvh2ps3opmnoa1tjr',
  lastPublished: new Date().toISOString(),
  status: 'published',
  homePage: {
    heroSection: {
      header1: defaultSiteContent.hero.slides[0]?.headlineLine1 || 'Strategy that',
      header2: defaultSiteContent.hero.slides[0]?.headlineLine2 || 'moves you forward.',
      description:
        'Axia Kairos is a global consulting partner specializing in enterprise transformation, cloud modernization, data engineering, automation, and intelligent technologies. We help organizations simplify complexity, modernize operations, and build lasting competitive advantage.',
      heroImage: defaultSiteContent.hero.slides[0]?.image || '/assets/hero.webp',
      heroImageAltText: 'HeroImage',
      eyebrow: defaultSiteContent.hero.slides[0]?.eyebrow || 'BUSINESS · TECHNOLOGY · PEOPLE',
      searchPlaceholder: defaultSiteContent.hero.slides[0]?.searchPlaceholder || 'Search for a service...',
      subtext1: defaultSiteContent.hero.slides[0]?.subtextLine1 || 'We help organisations navigate complexity,',
      subtext2: defaultSiteContent.hero.slides[0]?.subtextLine2 || 'make confident decisions and build lasting progress.',
      verticalLabels: defaultSiteContent.hero.slides[0]?.verticalLabels || ['INSIGHT', 'PEOPLE', 'TECHNOLOGY', 'IMPACT'],
    },
    servicesOverview: {
      heading: 'Specialized Transformation for Mission-Critical Sectors',
      tagline: 'Deep domain expertise across 12 regulated and fast-evolving global industries.',
    },
    trustedByHeading: defaultSiteContent.trustedBy.heading,
    aboutAxiaSection: DEFAULT_ABOUT_AXIA_SECTION,
    industriesSection: {
      eyebrow: 'INDUSTRIES WE SERVE',
      heading: 'Specialized Transformation for Mission-Critical Sectors',
      description:
        'Deep domain expertise across 12 regulated and fast-evolving global industries. We deliver purpose-engineered technology architectures that drive measurable enterprise impact.',
      items: DEFAULT_HOME_INDUSTRIES,
    },
    faqSection: {
      eyebrow: "FAQ'S",
      title: 'Looking for answer?',
      description:
        'Explore frequently asked questions about our enterprise consulting services, SAP modernization methodologies, and technical delivery frameworks.',
      imageSrc: '/assets/careers_team.webp',
      faqs: DEFAULT_HOME_FAQS,
    },
  },
  navbar: {
    brand: defaultSiteContent.header.logo.brand,
    trademark: defaultSiteContent.header.logo.trademark,
    sub: defaultSiteContent.header.logo.sub,
    ctaLabel: defaultSiteContent.header.cta.label,
    ctaHref: defaultSiteContent.header.cta.href,
    navLinks: defaultSiteContent.header.navLinks,
  },
  footer: {
    copyright: '© 2026 AXIA KAIROS LLC. All rights reserved.',
    tagline: 'Insight that shapes tomorrow. Execution that defines excellence.',
    email: 'contact@axiakairos.com',
    phone: '+1 (800) 321-4321',
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Our Approach', href: '/#approach' },
          { label: 'Careers', href: '/careers' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Services',
        links: [
          { label: 'Consulting & Strategy', href: '/services#consulting' },
          { label: 'Technology Solutions', href: '/services#technology' },
          { label: 'People & Transformation', href: '/services#transformation' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy-policy' },
          { label: 'Terms of Service', href: '/terms-and-conditions' },
        ],
      },
    ],
  },
  aboutPage: DEFAULT_ABOUT_PAGE,
  aboutUsPage: defaultAboutData,
  contactPage: defaultContactData,
  ourApproachPage: defaultApproachData,
  industryPage: defaultIndustries,
  privacyPolicyPage: defaultLegalData.privacyPolicy,
  termsAndConditionPage: defaultLegalData.termsAndConditions,
  productPage: defaultProducts,
  robot: {
    name: 'AXIA Assistant',
    avatarUrl: '/c.webp',
    status: 'online',
    welcomeMessage: "Hi, I'm AXIA Assistant. Ask me about our services, case studies, industries, careers or how we work with clients.",
    systemPrompt: 'You are the official AXIA KAIROS AI Assistant...',
    quickReplies: [
      'Tell me about SAP services',
      'Show case studies',
      'How do you work with clients?',
      'Explore careers at AXIA',
    ],
  },
  llm: {
    model: 'gpt-4o-mini',
    provider: 'openai',
    temperature: 0.2,
    maxTokens: 1024,
    searchEnabled: true,
    groundednessThreshold: 0.85,
  },
  redirect: [
    { from: '/contact-us', to: '/contact', permanent: true },
    { from: '/about-us', to: '/about', permanent: true },
    { from: '/jobs', to: '/careers', permanent: true },
  ],
  sitemap: [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/about', priority: 0.9, changefreq: 'monthly' },
    { url: '/services', priority: 0.9, changefreq: 'weekly' },
    { url: '/case-studies', priority: 0.8, changefreq: 'weekly' },
    { url: '/careers', priority: 0.8, changefreq: 'daily' },
    { url: '/blogs', priority: 0.8, changefreq: 'daily' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
  ],
  users: [
    { id: 'usr-1', username: 'admin', role: 'Super Administrator', email: 'admin@axiakairos.com', active: true },
    { id: 'usr-2', username: 'editor', role: 'Content Editor', email: 'editor@axiakairos.com', active: true },
  ],
  services: defaultServicesData,
  caseStudies: defaultCaseStudies,
  blogs: defaultBlogs,
  careers: defaultJobs,
});

/**
 * Loads current CMS data from localStorage, falling back to default code definitions
 */
export function loadCMSData(): CMSData {
  if (typeof window === 'undefined') return getDefaultCMSData();

  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return getDefaultCMSData();

    const parsed = JSON.parse(raw);
    const defaults = getDefaultCMSData();
    return {
      ...defaults,
      ...parsed,
      homePage: {
        ...defaults.homePage,
        ...(parsed.homePage || {}),
        heroSection: {
          ...defaults.homePage.heroSection,
          ...(parsed.homePage?.heroSection || {}),
        },
        aboutAxiaSection: {
          ...defaults.homePage.aboutAxiaSection,
          ...(parsed.homePage?.aboutAxiaSection || {}),
        },
        industriesSection: {
          ...defaults.homePage.industriesSection,
          ...(parsed.homePage?.industriesSection || {}),
        },
        faqSection: {
          ...defaults.homePage.faqSection,
          ...(parsed.homePage?.faqSection || {}),
        },
      },
      aboutPage: {
        ...defaults.aboutPage,
        ...(parsed.aboutPage || {}),
        teamRoster: {
          ...defaults.aboutPage.teamRoster,
          ...(parsed.aboutPage?.teamRoster || {}),
          members:
            parsed.aboutPage?.teamRoster?.members && parsed.aboutPage.teamRoster.members.length > 0
              ? parsed.aboutPage.teamRoster.members
              : defaults.aboutPage.teamRoster.members,
          openRoles:
            parsed.aboutPage?.teamRoster?.openRoles && parsed.aboutPage.teamRoster.openRoles.length > 0
              ? parsed.aboutPage.teamRoster.openRoles
              : defaults.aboutPage.teamRoster.openRoles,
        },
        storySection: {
          ...defaults.aboutPage.storySection,
          ...(parsed.aboutPage?.storySection || {}),
        },
        valuesSection: {
          ...defaults.aboutPage.valuesSection,
          ...(parsed.aboutPage?.valuesSection || {}),
          values:
            parsed.aboutPage?.valuesSection?.values && parsed.aboutPage.valuesSection.values.length > 0
              ? parsed.aboutPage.valuesSection.values
              : defaults.aboutPage.valuesSection.values,
        },
        focusSection: {
          ...defaults.aboutPage.focusSection,
          ...(parsed.aboutPage?.focusSection || {}),
          focusAreas:
            parsed.aboutPage?.focusSection?.focusAreas && parsed.aboutPage.focusSection.focusAreas.length > 0
              ? parsed.aboutPage.focusSection.focusAreas
              : defaults.aboutPage.focusSection.focusAreas,
        },
      },
      navbar: {
        ...defaults.navbar,
        ...(parsed.navbar || {}),
      },
      footer: {
        ...defaults.footer,
        ...(parsed.footer || {}),
      },
      robot: {
        ...defaults.robot,
        ...(parsed.robot || {}),
      },
      llm: {
        ...defaults.llm,
        ...(parsed.llm || {}),
      },
      services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : defaults.services,
      caseStudies:
        Array.isArray(parsed.caseStudies) && parsed.caseStudies.length > 0 ? parsed.caseStudies : defaults.caseStudies,
      careers: Array.isArray(parsed.careers) && parsed.careers.length > 0 ? parsed.careers : defaults.careers,
      blogs: Array.isArray(parsed.blogs) && parsed.blogs.length > 0 ? parsed.blogs : defaults.blogs,
      contactPage: {
        ...defaults.contactPage,
        ...(parsed.contactPage || {}),
        emails: {
          ...defaults.contactPage.emails,
          ...(parsed.contactPage?.emails || {}),
        },
        phones: {
          ...defaults.contactPage.phones,
          ...(parsed.contactPage?.phones || {}),
        },
        offices:
          Array.isArray(parsed.contactPage?.offices) && parsed.contactPage.offices.length > 0
            ? parsed.contactPage.offices
            : defaults.contactPage.offices,
      },
    };
  } catch (err) {
    console.error('Failed to parse CMS data from localStorage:', err);
    return getDefaultCMSData();
  }
}

/**
 * Saves and publishes data to localStorage, dispatching a window event so all components react
 */
export function saveCMSData(data: CMSData): void {
  if (typeof window === 'undefined') return;
  const payload = {
    ...data,
    lastPublished: new Date().toISOString(),
    status: 'published' as const,
  };
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: payload }));
}

/**
 * Resets CMS data to original defaults
 */
export function resetCMSData(): CMSData {
  if (typeof window === 'undefined') return getDefaultCMSData();
  localStorage.removeItem(CMS_STORAGE_KEY);
  const defaults = getDefaultCMSData();
  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: defaults }));
  return defaults;
}

/**
 * Exports all CMS data as a downloadable JSON file
 */
export function exportCMSData(): void {
  const data = loadCMSData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `axiakairos-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Imports CMS data from a JSON string and publishes it
 */
export function importCMSData(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    saveCMSData(parsed);
    return true;
  } catch {
    return false;
  }
}

/**
 * React Hook to subscribe to CMS data changes across the entire app
 */
export function useCMS(): CMSData {
  const [data, setData] = useState<CMSData>(loadCMSData);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setData(e.detail);
      }
    };
    window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
  }, []);

  return data;
}

/**
 * Sync published CMS data from Railway backend to local browser state
 */
export async function syncCMSFromServer(): Promise<CMSData | null> {
  if (typeof window === 'undefined') return null;
  try {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '';
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/content`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.homePage) {
        saveCMSData(json.data);
        return json.data;
      }
    }
  } catch (e) {
    // Graceful offline fallback
  }
  return null;
}

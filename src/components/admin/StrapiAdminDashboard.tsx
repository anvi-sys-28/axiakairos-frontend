import React, { useState, useEffect } from 'react';
import {
  loadCMSData,
  saveCMSData,
  resetCMSData,
  exportCMSData,
  importCMSData,
  DEFAULT_ABOUT_PAGE,
  type CMSData,
} from '@/lib/api';
import {
  LayoutDashboard,
  Feather,
  Image as ImageIcon,
  Boxes,
  Search,
  Settings,
  Mail,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  Plus,
  Link as LinkIcon,
  ExternalLink,
  Save,
  CheckCircle,
  RotateCcw,
  Download,
  Upload,
  ArrowLeft,
  MoreHorizontal,
  X,
  FileText,
  Bot,
  Sparkles,
  Layers,
  Network,
  Inbox,
  Bell,
  Send,
  SendHorizontal,
  Radio,
  MapPin,
  Globe,
  Copy,
  Users,
  Target,
  Compass,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  fetchAdminMessages,
  updateAdminMessageStatus,
  deleteAdminMessage,
  seedTestInquiry,
  fetchAdminCMS,
  saveAdminCMS,
  resetAdminCMS,
  type ContactMessageRecord,
} from '@/lib/api';

interface StrapiAdminDashboardProps {
  token: string;
  user: { username: string; role: string };
  onLogout: () => void;
}

type ActiveView =
  | 'HomePage'
  | 'AboutUsPage'
  | 'blogPage'
  | 'CareerPage'
  | 'caseStudyPage'
  | 'ContactPage'
  | 'footer'
  | 'IndustryPage'
  | 'llm'
  | 'Navbar'
  | 'OurApproachPage'
  | 'PrivacyPolicyPage'
  | 'ProductPage'
  | 'robot'
  | 'service'
  | 'ServicePage'
  | 'TermsAndConditionPage'
  | 'redirect'
  | 'sitemap'
  | 'User'
  | 'inbox'
  | 'notification';

export type MainNavOption =
  | 'content_management'
  | 'sitemaps'
  | 'chatbot'
  | 'incoming_requests'
  | 'send_notification';

interface NotificationHistoryItem {
  id: string;
  title: string;
  target: string;
  type: string;
  sentAt: string;
  status: 'Sent' | 'Scheduled';
  recipientsCount: number;
}

const INITIAL_NOTIFICATIONS: NotificationHistoryItem[] = [
  {
    id: 'notif-1',
    title: 'Q4 Enterprise Digital Transformation Whitepaper Released',
    target: 'All Inquiries & Form Contacts',
    type: 'Announcement',
    sentAt: '2026-10-24 14:30',
    status: 'Sent',
    recipientsCount: 48,
  },
  {
    id: 'notif-2',
    title: 'Scheduled SAP S/4HANA Architecture Briefing Session',
    target: 'Qualified Enterprise Leads',
    type: 'Consultation Follow-up',
    sentAt: '2026-10-22 10:15',
    status: 'Sent',
    recipientsCount: 19,
  },
  {
    id: 'notif-3',
    title: 'Axia Kairos Cloud Resilience & Security Advisory Note',
    target: 'All Inquiries & Form Contacts',
    type: 'Security Advisory',
    sentAt: '2026-10-18 16:45',
    status: 'Sent',
    recipientsCount: 64,
  },
];

const DEFAULT_SITEMAP_ROUTES = [
  { url: '/', title: 'Home - Enterprise Digital Transformation', priority: '1.0', changefreq: 'weekly', status: 'Indexed' },
  { url: '/services', title: 'Services Directory (12 Services)', priority: '0.9', changefreq: 'weekly', status: 'Indexed' },
  { url: '/services/sap-implementation-advisory-and-support', title: 'SAP Implementation, Advisory & Support', priority: '0.8', changefreq: 'monthly', status: 'Indexed' },
  { url: '/services/cloud-platform-modernization', title: 'Cloud Platform Modernization', priority: '0.8', changefreq: 'monthly', status: 'Indexed' },
  { url: '/services/cyber-security-services', title: 'Cyber Security & Resilience Services', priority: '0.8', changefreq: 'monthly', status: 'Indexed' },
  { url: '/services/data-engineering-and-analytics', title: 'Data Engineering & Analytics', priority: '0.8', changefreq: 'monthly', status: 'Indexed' },
  { url: '/services/ai-blockchain-and-io-t-integration', title: 'Enterprise AI, Blockchain & IoT', priority: '0.8', changefreq: 'monthly', status: 'Indexed' },
  { url: '/case-studies', title: 'Case Studies Hub (6 Case Studies)', priority: '0.8', changefreq: 'weekly', status: 'Indexed' },
  { url: '/careers', title: 'Careers & Global Talent Portal', priority: '0.7', changefreq: 'weekly', status: 'Indexed' },
  { url: '/blogs', title: 'Blogs & Executive Insights', priority: '0.7', changefreq: 'daily', status: 'Indexed' },
  { url: '/contact', title: 'Contact Us & Advisory Request', priority: '0.9', changefreq: 'monthly', status: 'Indexed' },
  { url: '/about', title: 'About Axia Kairos & Leadership', priority: '0.7', changefreq: 'monthly', status: 'Indexed' },
  { url: '/privacy-policy', title: 'Privacy Policy & Data Notice', priority: '0.3', changefreq: 'yearly', status: 'Indexed' },
  { url: '/terms-and-conditions', title: 'Terms and Conditions', priority: '0.3', changefreq: 'yearly', status: 'Indexed' },
];

export const CONTENT_SECTIONS: { id: ActiveView; label: string }[] = [
  { id: 'HomePage', label: 'Home page' },
  { id: 'AboutUsPage', label: 'About' },
  { id: 'service', label: 'Services' },
  { id: 'caseStudyPage', label: 'Case Studies' },
  { id: 'CareerPage', label: 'Careers' },
  { id: 'blogPage', label: 'Blogs' },
  { id: 'ContactPage', label: 'Contact' },
];

export default function StrapiAdminDashboard({ token, user, onLogout }: StrapiAdminDashboardProps) {
  const [cmsData, setCmsData] = useState<CMSData>(loadCMSData);
  const [mainNav, setMainNav] = useState<MainNavOption>('content_management');
  const [contentSection, setContentSection] = useState<ActiveView>('HomePage');
  const [activeView, setActiveView] = useState<ActiveView>('HomePage');
  const [activeTab, setActiveTab] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [heroExpanded, setHeroExpanded] = useState(true);
  const [homeSubTab, setHomeSubTab] = useState<'all' | 'hero' | 'about' | 'industries' | 'faqs'>('all');
  const [aboutSubTab, setAboutSubTab] = useState<'all' | 'roster' | 'story' | 'values' | 'focus'>('all');
  const [servicesSearch, setServicesSearch] = useState('');
  const [caseStudiesSearch, setCaseStudiesSearch] = useState('');
  const [caseStudiesIndustryFilter, setCaseStudiesIndustryFilter] = useState('all');
  const [careersSearch, setCareersSearch] = useState('');
  const [careersDeptFilter, setCareersDeptFilter] = useState('all');
  const [careersStatusFilter, setCareersStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [blogsCategoryFilter, setBlogsCategoryFilter] = useState('all');
  const [contactSubTab, setContactSubTab] = useState<'all' | 'header' | 'channels' | 'offices' | 'notice'>('all');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [jsonMode, setJsonMode] = useState(false);

  // Notification state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifTarget, setNotifTarget] = useState('All Inquiries & Form Contacts');
  const [notifType, setNotifType] = useState('Announcement');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifCtaLabel, setNotifCtaLabel] = useState('View Details');
  const [notifCtaUrl, setNotifCtaUrl] = useState('https://axiakairos.com');
  const [notifHistory, setNotifHistory] = useState<NotificationHistoryItem[]>(INITIAL_NOTIFICATIONS);
  const [isSendingNotif, setIsSendingNotif] = useState(false);

  // Sitemap state
  const [sitemapList, setSitemapList] = useState(DEFAULT_SITEMAP_ROUTES);

  // Inquiries state (preserved from previous dashboard)
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    // 1. Load local cache first
    setCmsData(loadCMSData());

    // 2. Fetch fresh published content from backend database
    if (token) {
      fetchAdminCMS(token).then((remote) => {
        if (remote && remote.homePage) {
          saveCMSData(remote);
          setCmsData(remote);
        }
      });
    }
  }, [token]);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleSaveDraft = async () => {
    saveCMSData(cmsData);
    if (token) {
      await saveAdminCMS(token, cmsData);
    }
    triggerToast('Draft saved & persisted to database!');
  };

  const handlePublish = async () => {
    const published = {
      ...cmsData,
      status: 'published' as const,
      lastPublished: new Date().toISOString(),
    };
    saveCMSData(published);
    setCmsData(published);
    if (token) {
      await saveAdminCMS(token, published);
    }
    triggerToast('Published successfully! Live site and AI chatbot updated.');
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all website data to default settings? This will clear custom edits.')) {
      const def = resetCMSData();
      setCmsData(def);
      if (token) {
        await resetAdminCMS(token);
      }
      triggerToast('All content reset to factory defaults.');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importCMSData(content)) {
        setCmsData(loadCMSData());
        triggerToast('CMS data imported and published successfully!');
      } else {
        alert('Invalid CMS backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Load messages when inbox is active
  useEffect(() => {
    if (activeView === 'inbox') {
      setMessagesLoading(true);
      fetchAdminMessages(token)
        .then((res) => {
          if (res?.messages) setMessages(res.messages);
        })
        .finally(() => setMessagesLoading(false));
    }
  }, [activeView, token]);

  const singleTypesList: Array<{ id: ActiveView; label: string }> = [
    { id: 'AboutUsPage', label: 'AboutUsPage' },
    { id: 'blogPage', label: 'blogPage' },
    { id: 'CareerPage', label: 'CareerPage' },
    { id: 'caseStudyPage', label: 'caseStudyPage' },
    { id: 'ContactPage', label: 'ContactPage' },
    { id: 'footer', label: 'footer' },
    { id: 'HomePage', label: 'HomePage' },
    { id: 'IndustryPage', label: 'IndustryPage' },
    { id: 'llm', label: 'llm' },
    { id: 'Navbar', label: 'Navbar' },
    { id: 'OurApproachPage', label: 'OurApproachPage' },
    { id: 'PrivacyPolicyPage', label: 'PrivacyPolicyPage' },
    { id: 'ProductPage', label: 'ProductPage' },
    { id: 'robot', label: 'robot' },
    { id: 'ServicePage', label: 'ServicePage' },
    { id: 'TermsAndConditionPage', label: 'TermsAndConditionPage' },
  ];

  const collectionTypesList: Array<{ id: ActiveView; label: string; count?: number }> = [
    { id: 'redirect', label: 'redirect', count: cmsData.redirect.length },
    { id: 'service', label: 'service', count: cmsData.services.length },
    { id: 'sitemap', label: 'sitemap', count: cmsData.sitemap.length },
    { id: 'User', label: 'User', count: cmsData.users.length },
  ];

  const filteredSingleTypes = singleTypesList.filter((item) =>
    item.label.toLowerCase().includes(sidebarFilter.toLowerCase())
  );
  const filteredCollectionTypes = collectionTypesList.filter((item) =>
    item.label.toLowerCase().includes(sidebarFilter.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#f6f8fb] text-[#272b33] font-sans text-sm select-none">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 right-6 z-50 bg-[#288226] text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ========================================================
          CLEAN MAIN SIDE NAVIGATION (5 Core Options)
          ======================================================== */}
      <aside className="w-[260px] shrink-0 bg-white border-r border-[#e3e7f0] flex flex-col h-full z-20">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-[#e3e7f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4945ff] text-white flex items-center justify-center font-bold text-base shadow-sm">
              A
            </div>
            <div>
              <div className="font-bold text-sm text-[#272b33] tracking-tight">AXIA KAIROS</div>
              <div className="text-[11px] text-[#8c9ba5] font-mono">Admin Portal</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#288226]" title="Database Online" />
        </div>

        {/* The 5 Main Options */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#8c9ba5] px-3 py-1 font-semibold">
            CORE MODULES
          </div>

          {/* 1. Content Management */}
          <div>
            <button
              type="button"
              onClick={() => {
                setMainNav('content_management');
                setActiveView(contentSection || 'HomePage');
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                mainNav === 'content_management'
                  ? 'bg-[#4945ff] text-white shadow-sm'
                  : 'text-[#4a5568] hover:bg-[#f0f3ff] hover:text-[#4945ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Content management</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  mainNav === 'content_management' ? 'rotate-180 text-white/80' : 'text-[#8c9ba5]'
                }`}
              />
            </button>

            {/* Sub-options: Home page, About, Services, Case Studies, Careers, Blogs, Contact */}
            {mainNav === 'content_management' && (
              <div className="mt-1.5 ml-3 pl-3 border-l-2 border-[#e3e7f0] space-y-0.5 py-1 animate-in fade-in duration-150">
                {CONTENT_SECTIONS.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setContentSection(sub.id);
                      setActiveView(sub.id);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11.5px] font-medium transition-colors ${
                      activeView === sub.id
                        ? 'bg-[#f0f3ff] text-[#4945ff] font-bold'
                        : 'text-[#667085] hover:bg-[#f6f8fb] hover:text-[#272b33]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Site maps */}
          <button
            type="button"
            onClick={() => {
              setMainNav('sitemaps');
              setActiveView('sitemap');
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
              mainNav === 'sitemaps'
                ? 'bg-[#4945ff] text-white shadow-sm'
                : 'text-[#4a5568] hover:bg-[#f0f3ff] hover:text-[#4945ff]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4" />
              <span>Site maps</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                mainNav === 'sitemaps' ? 'bg-white/20 text-white' : 'bg-[#edf2f7] text-[#8c9ba5]'
              }`}
            >
              {sitemapList.length}
            </span>
          </button>

          {/* 3. Chatbot Bot */}
          <button
            type="button"
            onClick={() => {
              setMainNav('chatbot');
              setActiveView('llm');
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
              mainNav === 'chatbot'
                ? 'bg-[#4945ff] text-white shadow-sm'
                : 'text-[#4a5568] hover:bg-[#f0f3ff] hover:text-[#4945ff]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4" />
              <span>Chatbot Bot</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                mainNav === 'chatbot' ? 'bg-white/20 text-white' : 'bg-[#edf2f7] text-[#8c9ba5]'
              }`}
            >
              AI
            </span>
          </button>

          {/* 4. Incoming requests from the contact page */}
          <button
            type="button"
            onClick={() => {
              setMainNav('incoming_requests');
              setActiveView('inbox');
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
              mainNav === 'incoming_requests'
                ? 'bg-[#4945ff] text-white shadow-sm'
                : 'text-[#4a5568] hover:bg-[#f0f3ff] hover:text-[#4945ff]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>Incoming requests from the contact page</span>
            </div>
            {messages.length > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  mainNav === 'incoming_requests' ? 'bg-white text-[#4945ff]' : 'bg-[#4945ff] text-white'
                }`}
              >
                {messages.length}
              </span>
            )}
          </button>

          {/* 5. Send notification option */}
          <button
            type="button"
            onClick={() => {
              setMainNav('send_notification');
              setActiveView('notification');
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
              mainNav === 'send_notification'
                ? 'bg-[#4945ff] text-white shadow-sm'
                : 'text-[#4a5568] hover:bg-[#f0f3ff] hover:text-[#4945ff]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4" />
              <span>Send notification option</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                mainNav === 'send_notification' ? 'bg-white/20 text-white' : 'bg-[#edf2f7] text-[#8c9ba5]'
              }`}
            >
              Push
            </span>
          </button>
        </div>

        {/* Sidebar Footer with Administrator Profile & Quick Logout */}
        <div className="p-3 border-t border-[#e3e7f0] bg-[#fcfdfe] space-y-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#4945ff] text-white font-bold text-xs flex items-center justify-center">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-[#272b33] leading-none truncate">{user.username}</div>
                <div className="text-[10px] text-[#8c9ba5] leading-none mt-1">{user.role}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-[11px] text-[#e03131] hover:underline font-semibold"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          3. MAIN CONTENT WORKSPACE (Center Editor)
          ======================================================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f6f8fb]">
        {/* Top Navigation Bar: Back link, Document ID, Published badge, Options */}
        <header className="px-8 pt-5 pb-3 border-b border-[#e3e7f0] bg-white flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMainNav('content_management');
                setActiveView('HomePage');
              }}
              className="text-[#4945ff] hover:underline flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Content Management</span>
            </button>

            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#272b33] tracking-tight">
                {mainNav === 'content_management'
                  ? `Content Management • ${
                      CONTENT_SECTIONS.find((s) => s.id === activeView)?.label || activeView
                    }`
                  : mainNav === 'sitemaps'
                  ? 'Site Maps & Route Governance'
                  : mainNav === 'chatbot'
                  ? 'Chatbot Bot Command Center'
                  : mainNav === 'incoming_requests'
                  ? `Incoming Requests from Contact Page (${messages.length})`
                  : 'Send Notification Option'}
              </h1>
              <span className="bg-[#eafbe7] text-[#288226] border border-[#bbf2b6] text-[11px] font-semibold px-2.5 py-0.5 rounded">
                Published & Live
              </span>
            </div>

            {/* DRAFT / PUBLISHED Tabs */}
            <div className="flex items-center gap-6 mt-1 border-b border-transparent">
              <button
                type="button"
                onClick={() => setActiveTab('DRAFT')}
                className={`text-xs font-bold pb-1.5 relative transition-colors ${
                  activeTab === 'DRAFT'
                    ? 'text-[#4945ff] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#4945ff]'
                    : 'text-[#667085] hover:text-[#272b33]'
                }`}
              >
                DRAFT
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('PUBLISHED')}
                className={`text-xs font-bold pb-1.5 relative transition-colors ${
                  activeTab === 'PUBLISHED'
                    ? 'text-[#4945ff] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#4945ff]'
                    : 'text-[#667085] hover:text-[#272b33]'
                }`}
              >
                PUBLISHED
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setJsonMode(!jsonMode)}
              className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                jsonMode
                  ? 'bg-[#4945ff] text-white border-[#4945ff]'
                  : 'bg-white text-[#4a5568] border-[#e3e7f0] hover:bg-[#f6f8fb]'
              }`}
              title="Toggle between Visual Form Editor and raw JSON Code Mode"
            >
              {jsonMode ? 'Visual Mode' : 'JSON Mode'}
            </button>
            <button
              type="button"
              onClick={() => setShowOptionsModal(!showOptionsModal)}
              className="p-1.5 rounded hover:bg-[#f6f8fb] border border-[#e3e7f0] text-[#667085]"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Management Sub-Sections Bar */}
        {mainNav === 'content_management' && (
          <div className="bg-white border-b border-[#e3e7f0] px-8 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c9ba5] mr-1 shrink-0">
              Active Section:
            </span>
            {CONTENT_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setContentSection(sec.id);
                  setActiveView(sec.id);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 transition-all ${
                  activeView === sec.id
                    ? 'bg-[#4945ff] text-white shadow-xs'
                    : 'bg-[#f6f8fb] text-[#4a5568] hover:bg-[#edf2f7] hover:text-[#272b33]'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* ========================================================
              VIEW 1: HomePage (Comprehensive 4 Sections Management)
              ======================================================== */}
          {activeView === 'HomePage' && (
            <div className="space-y-6 max-w-[1020px]">
              {/* Home Page Section Quick Navigation Bar */}
              <div className="bg-white border border-[#e3e7f0] rounded-lg p-3 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[11px] font-bold text-[#8c9ba5] uppercase tracking-wider mr-2 shrink-0">
                    Home Sections:
                  </span>
                  {[
                    { id: 'all', label: 'All Sections (4)' },
                    { id: 'hero', label: '1. Hero Section' },
                    { id: 'about', label: '2. About Axia Kairos' },
                    { id: 'industries', label: '3. Industries We Serve' },
                    { id: 'faqs', label: "4. FAQ'S Section" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setHomeSubTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 transition-colors ${
                        homeSubTab === tab.id
                          ? 'bg-[#4945ff] text-white shadow-xs'
                          : 'bg-[#f6f8fb] text-[#4a5568] hover:bg-[#edf2f7] hover:text-[#272b33]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] font-mono text-[#288226] bg-[#eafbe7] border border-[#bbf2b6] px-2 py-0.5 rounded font-medium shrink-0">
                  Live Synced
                </span>
              </div>

              {/* ========================================================
                  SECTION 1: Hero Section
                  ======================================================== */}
              {(homeSubTab === 'all' || homeSubTab === 'hero') && (
                <div className="rounded-lg border border-[#e3e7f0] bg-white shadow-xs overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#e3e7f0] bg-[#fcfdfe] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4945ff]" />
                      <span className="font-bold text-xs text-[#272b33] uppercase tracking-wider">
                        1. Hero Showcase & Header Section
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8c9ba5] font-mono">
                      Viewport Hero & Slides
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                          Header Line 1
                        </label>
                        <input
                          type="text"
                          value={cmsData.homePage.heroSection.header1}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              homePage: {
                                ...cmsData.homePage,
                                heroSection: { ...cmsData.homePage.heroSection, header1: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                          Header Line 2 (Highlighted Gradient)
                        </label>
                        <input
                          type="text"
                          value={cmsData.homePage.heroSection.header2}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              homePage: {
                                ...cmsData.homePage,
                                heroSection: { ...cmsData.homePage.heroSection, header2: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                          Eyebrow Badge Text
                        </label>
                        <input
                          type="text"
                          value={cmsData.homePage.heroSection.eyebrow}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              homePage: {
                                ...cmsData.homePage,
                                heroSection: { ...cmsData.homePage.heroSection, eyebrow: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                          Search Bar Placeholder Text
                        </label>
                        <input
                          type="text"
                          value={cmsData.homePage.heroSection.searchPlaceholder || 'Search for a service...'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              homePage: {
                                ...cmsData.homePage,
                                heroSection: { ...cmsData.homePage.heroSection, searchPlaceholder: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                          Subtext Line 1
                        </label>
                        <input
                          type="text"
                          value={cmsData.homePage.heroSection.subtext1 || 'We help organisations navigate complexity,'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              homePage: {
                                ...cmsData.homePage,
                                heroSection: { ...cmsData.homePage.heroSection, subtext1: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                          Subtext Line 2
                        </label>
                        <input
                          type="text"
                          value={cmsData.homePage.heroSection.subtext2 || 'make confident decisions and build lasting progress.'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              homePage: {
                                ...cmsData.homePage,
                                heroSection: { ...cmsData.homePage.heroSection, subtext2: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Hero Section Full Enterprise Description
                      </label>
                      <textarea
                        rows={3}
                        value={cmsData.homePage.heroSection.description}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              heroSection: { ...cmsData.homePage.heroSection, description: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                          Background Hero Image URL / Asset Path
                        </label>
                        <input
                          type="text"
                          value={cmsData.homePage.heroSection.heroImage}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              homePage: {
                                ...cmsData.homePage,
                                heroSection: { ...cmsData.homePage.heroSection, heroImage: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                          Vertical Floating Labels (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={(cmsData.homePage.heroSection.verticalLabels || []).join(', ')}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              homePage: {
                                ...cmsData.homePage,
                                heroSection: {
                                  ...cmsData.homePage.heroSection,
                                  verticalLabels: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Trusted-By Strip Heading
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.trustedByHeading || 'TRUSTED BY LEADING ENTERPRISES'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: { ...cmsData.homePage, trustedByHeading: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  SECTION 2: About Axia Kairos Section
                  ======================================================== */}
              {(homeSubTab === 'all' || homeSubTab === 'about') && (
                <div className="rounded-lg border border-[#e3e7f0] bg-white shadow-xs overflow-hidden space-y-5 p-5">
                  <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c2a675]" />
                      <span className="font-bold text-xs text-[#272b33] uppercase tracking-wider">
                        2. About Axia Kairos Section
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8c9ba5] font-mono">
                      Sticky Media & Pillars
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Section Category Tag
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.aboutAxiaSection?.categoryTag || 'About Axia Kairos'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: {
                                ...(cmsData.homePage.aboutAxiaSection || {} as any),
                                categoryTag: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.aboutAxiaSection?.badgeText || 'ABOUT AXIA KAIROS'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: {
                                ...(cmsData.homePage.aboutAxiaSection || {} as any),
                                badgeText: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Main Section Title / Headline
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.aboutAxiaSection?.title || 'Global IT Transformation Partner'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: {
                                ...(cmsData.homePage.aboutAxiaSection || {} as any),
                                title: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Primary Corporate Narrative
                      </label>
                      <textarea
                        rows={3}
                        value={cmsData.homePage.aboutAxiaSection?.description || ''}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: {
                                ...(cmsData.homePage.aboutAxiaSection || {} as any),
                                description: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Secondary Strategic Description
                      </label>
                      <textarea
                        rows={3}
                        value={cmsData.homePage.aboutAxiaSection?.descriptionSecondary || ''}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: {
                                ...(cmsData.homePage.aboutAxiaSection || {} as any),
                                descriptionSecondary: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Video MP4 Stream URL
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.aboutAxiaSection?.videoUrl || ''}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: {
                                ...(cmsData.homePage.aboutAxiaSection || {} as any),
                                videoUrl: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] font-mono text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Video Poster Image URL
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.aboutAxiaSection?.posterUrl || ''}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: {
                                ...(cmsData.homePage.aboutAxiaSection || {} as any),
                                posterUrl: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Key Metrics Manager */}
                  <div className="pt-2 border-t border-[#e3e7f0] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#272b33]">
                        Key Performance Metrics ({(cmsData.homePage.aboutAxiaSection?.metrics || []).length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const val = prompt('Enter metric value (e.g. 500+):') || '500+';
                          const lbl = prompt('Enter metric label (e.g. ENTERPRISE ENGAGEMENTS):') || 'ENTERPRISE ENGAGEMENTS';
                          const updated = [...(cmsData.homePage.aboutAxiaSection?.metrics || []), { value: val, label: lbl }];
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), metrics: updated },
                            },
                          });
                          triggerToast('Metric added!');
                        }}
                        className="px-2.5 py-1 rounded bg-[#4945ff] text-white text-[11px] font-semibold hover:bg-[#3d38ee] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Metric</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {(cmsData.homePage.aboutAxiaSection?.metrics || []).map((m, mIdx) => (
                        <div key={mIdx} className="p-3 rounded-lg border border-[#e3e7f0] bg-[#fcfdfe] relative group space-y-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (cmsData.homePage.aboutAxiaSection?.metrics || []).filter((_, i) => i !== mIdx);
                              setCmsData({
                                ...cmsData,
                                homePage: {
                                  ...cmsData.homePage,
                                  aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), metrics: updated },
                                },
                              });
                            }}
                            className="absolute top-2 right-2 text-[#8c9ba5] hover:text-red-600 p-0.5"
                            title="Delete metric"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <label className="text-[10px] font-bold text-[#8c9ba5] uppercase block">Value</label>
                          <input
                            type="text"
                            value={m.value}
                            onChange={(e) => {
                              const updated = [...(cmsData.homePage.aboutAxiaSection?.metrics || [])];
                              updated[mIdx] = { ...updated[mIdx], value: e.target.value };
                              setCmsData({
                                ...cmsData,
                                homePage: {
                                  ...cmsData.homePage,
                                  aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), metrics: updated },
                                },
                              });
                            }}
                            className="w-full px-2 py-1 text-xs font-bold rounded border border-[#e3e7f0]"
                          />
                          <label className="text-[10px] font-bold text-[#8c9ba5] uppercase block">Label</label>
                          <input
                            type="text"
                            value={m.label}
                            onChange={(e) => {
                              const updated = [...(cmsData.homePage.aboutAxiaSection?.metrics || [])];
                              updated[mIdx] = { ...updated[mIdx], label: e.target.value };
                              setCmsData({
                                ...cmsData,
                                homePage: {
                                  ...cmsData.homePage,
                                  aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), metrics: updated },
                                },
                              });
                            }}
                            className="w-full px-2 py-1 text-[11px] rounded border border-[#e3e7f0]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capabilities / Transformation Pillars */}
                  <div className="pt-2 border-t border-[#e3e7f0] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#272b33]">
                        Core Transformation Pillars ({(cmsData.homePage.aboutAxiaSection?.capabilities || []).length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const title = prompt('Enter capability title:') || 'New Transformation Capability';
                          const tag = prompt('Enter tag (e.g. CLOUD & AI):') || 'ENTERPRISE SOLUTION';
                          const desc = prompt('Enter description:') || 'Strategic advisory and architecture modernization.';
                          const newCap = {
                            id: `cap-${Date.now()}`,
                            tag,
                            title,
                            description: desc,
                          };
                          const updated = [...(cmsData.homePage.aboutAxiaSection?.capabilities || []), newCap];
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), capabilities: updated },
                            },
                          });
                          triggerToast('Capability added!');
                        }}
                        className="px-2.5 py-1 rounded bg-[#4945ff] text-white text-[11px] font-semibold hover:bg-[#3d38ee] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Capability</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(cmsData.homePage.aboutAxiaSection?.capabilities || []).map((cap, cIdx) => (
                        <div key={cap.id || cIdx} className="p-3.5 rounded-lg border border-[#e3e7f0] bg-[#fcfdfe] relative space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase bg-[#f0f3ff] text-[#4945ff] px-2 py-0.5 rounded font-semibold">
                              Pillar {cIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (cmsData.homePage.aboutAxiaSection?.capabilities || []).filter((_, i) => i !== cIdx);
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), capabilities: updated },
                                  },
                                });
                              }}
                              className="text-[#8c9ba5] hover:text-red-600 p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={cap.tag}
                              placeholder="Tag (e.g. ENTERPRISE ERP)"
                              onChange={(e) => {
                                const updated = [...(cmsData.homePage.aboutAxiaSection?.capabilities || [])];
                                updated[cIdx] = { ...updated[cIdx], tag: e.target.value };
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), capabilities: updated },
                                  },
                                });
                              }}
                              className="w-full px-2 py-1 text-[11px] rounded border border-[#e3e7f0] font-mono"
                            />
                            <input
                              type="text"
                              value={cap.title}
                              placeholder="Title"
                              onChange={(e) => {
                                const updated = [...(cmsData.homePage.aboutAxiaSection?.capabilities || [])];
                                updated[cIdx] = { ...updated[cIdx], title: e.target.value };
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), capabilities: updated },
                                  },
                                });
                              }}
                              className="w-full px-2 py-1 text-xs font-semibold rounded border border-[#e3e7f0]"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={cap.description}
                            placeholder="Description"
                            onChange={(e) => {
                              const updated = [...(cmsData.homePage.aboutAxiaSection?.capabilities || [])];
                              updated[cIdx] = { ...updated[cIdx], description: e.target.value };
                              setCmsData({
                                ...cmsData,
                                homePage: {
                                  ...cmsData.homePage,
                                  aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), capabilities: updated },
                                },
                              });
                            }}
                            className="w-full px-2 py-1 text-xs rounded border border-[#e3e7f0]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="pt-2 border-t border-[#e3e7f0] grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">CTA Headline</label>
                      <input
                        type="text"
                        value={cmsData.homePage.aboutAxiaSection?.ctaHeadline || ''}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), ctaHeadline: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e3e7f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">CTA Subtext</label>
                      <input
                        type="text"
                        value={cmsData.homePage.aboutAxiaSection?.ctaSubtext || ''}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), ctaSubtext: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e3e7f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">CTA Button Label</label>
                      <input
                        type="text"
                        value={cmsData.homePage.aboutAxiaSection?.ctaButtonText || ''}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              aboutAxiaSection: { ...(cmsData.homePage.aboutAxiaSection || {} as any), ctaButtonText: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e3e7f0]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  SECTION 3: Industries We Serve Section
                  ======================================================== */}
              {(homeSubTab === 'all' || homeSubTab === 'industries') && (
                <div className="rounded-lg border border-[#e3e7f0] bg-white shadow-xs overflow-hidden space-y-5 p-5">
                  <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#288226]" />
                      <span className="font-bold text-xs text-[#272b33] uppercase tracking-wider">
                        3. Industries We Serve Section
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8c9ba5] font-mono">
                      Elastic Reel & Synced Showcase
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Section Eyebrow
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.industriesSection?.eyebrow || 'INDUSTRIES WE SERVE'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              industriesSection: {
                                ...(cmsData.homePage.industriesSection || {} as any),
                                eyebrow: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Main Section Heading
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.industriesSection?.heading || 'Specialized Transformation for Mission-Critical Sectors'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              industriesSection: {
                                ...(cmsData.homePage.industriesSection || {} as any),
                                heading: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                      Section Lead Description
                    </label>
                    <textarea
                      rows={2}
                      value={cmsData.homePage.industriesSection?.description || ''}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          homePage: {
                            ...cmsData.homePage,
                            industriesSection: {
                              ...(cmsData.homePage.industriesSection || {} as any),
                              description: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>

                  {/* Industries Items Management */}
                  <div className="pt-2 border-t border-[#e3e7f0] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#272b33]">
                          Industries Showcase ({(cmsData.homePage.industriesSection?.items || []).length} Sectors)
                        </h4>
                        <p className="text-[11px] text-[#8c9ba5]">
                          Add, modify, or remove industries featured in the homepage elastic reel and synchronized description dock.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const title = prompt('Enter Industry Title (e.g. Renewable Energy):');
                          if (!title) return;
                          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          const newInd: any = {
                            id,
                            title,
                            tag: 'EMERGING SECTOR',
                            headline: `${title} Architecture & Transformation`,
                            shortDescription: `Purpose-built enterprise cloud and automation for ${title}.`,
                            longDescription: `Accelerating modernization, risk resilience, and operational excellence for global ${title} enterprises.`,
                            focusAreas: ['Cloud Modernization', 'Process Automation', 'Data Intelligence'],
                            impactMetric: { value: '35%', label: 'Efficiency gain' },
                            image: '/assets/card_sunset.webp',
                          };
                          const updated = [...(cmsData.homePage.industriesSection?.items || []), newInd];
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                            },
                          });
                          triggerToast(`Industry "${title}" added!`);
                        }}
                        className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Industry</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(cmsData.homePage.industriesSection?.items || []).map((ind, indIdx) => (
                        <div key={ind.id || indIdx} className="border border-[#e3e7f0] rounded-lg bg-[#fcfdfe] p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase bg-[#eafbe7] text-[#288226] border border-[#bbf2b6] px-2 py-0.5 rounded font-semibold">
                                {ind.tag || 'SECTOR'}
                              </span>
                              <span className="text-xs font-bold text-[#272b33]">
                                {ind.title}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete industry "${ind.title}"?`)) {
                                  const updated = (cmsData.homePage.industriesSection?.items || []).filter((_, i) => i !== indIdx);
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                  triggerToast('Industry removed.');
                                }
                              }}
                              className="text-[#8c9ba5] hover:text-red-600 p-1"
                              title="Delete industry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">Title</label>
                              <input
                                type="text"
                                value={ind.title}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.industriesSection?.items || [])];
                                  updated[indIdx] = { ...updated[indIdx], title: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e3e7f0] bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">Tag / Category</label>
                              <input
                                type="text"
                                value={ind.tag}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.industriesSection?.items || [])];
                                  updated[indIdx] = { ...updated[indIdx], tag: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e3e7f0] bg-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">Hero Headline</label>
                              <input
                                type="text"
                                value={ind.headline}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.industriesSection?.items || [])];
                                  updated[indIdx] = { ...updated[indIdx], headline: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 text-xs rounded border border-[#e3e7f0] bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">Short Description</label>
                              <textarea
                                rows={2}
                                value={ind.shortDescription}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.industriesSection?.items || [])];
                                  updated[indIdx] = { ...updated[indIdx], shortDescription: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1 text-xs rounded border border-[#e3e7f0] bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">Long Description</label>
                              <textarea
                                rows={2}
                                value={ind.longDescription}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.industriesSection?.items || [])];
                                  updated[indIdx] = { ...updated[indIdx], longDescription: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1 text-xs rounded border border-[#e3e7f0] bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">Impact Metric Value</label>
                              <input
                                type="text"
                                value={ind.impactMetric?.value || ''}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.industriesSection?.items || [])];
                                  updated[indIdx] = {
                                    ...updated[indIdx],
                                    impactMetric: { ...updated[indIdx].impactMetric, value: e.target.value },
                                  };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1 text-xs rounded border border-[#e3e7f0] bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">Impact Metric Label</label>
                              <input
                                type="text"
                                value={ind.impactMetric?.label || ''}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.industriesSection?.items || [])];
                                  updated[indIdx] = {
                                    ...updated[indIdx],
                                    impactMetric: { ...updated[indIdx].impactMetric, label: e.target.value },
                                  };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1 text-xs rounded border border-[#e3e7f0] bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">Focus Areas (comma-separated)</label>
                              <input
                                type="text"
                                value={(ind.focusAreas || []).join(', ')}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.industriesSection?.items || [])];
                                  updated[indIdx] = {
                                    ...updated[indIdx],
                                    focusAreas: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                                  };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      industriesSection: { ...(cmsData.homePage.industriesSection || {} as any), items: updated },
                                    },
                                  });
                                }}
                                className="w-full px-2.5 py-1 text-xs rounded border border-[#e3e7f0] bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  SECTION 4: FAQ'S Section
                  ======================================================== */}
              {(homeSubTab === 'all' || homeSubTab === 'faqs') && (
                <div className="rounded-lg border border-[#e3e7f0] bg-white shadow-xs overflow-hidden space-y-5 p-5">
                  <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#e03131]" />
                      <span className="font-bold text-xs text-[#272b33] uppercase tracking-wider">
                        4. FAQ'S Section
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8c9ba5] font-mono">
                      Accordions & Knowledge
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        FAQ Eyebrow
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.faqSection?.eyebrow || "FAQ'S"}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              faqSection: { ...(cmsData.homePage.faqSection || {} as any), eyebrow: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.faqSection?.title || 'Looking for answer?'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              faqSection: { ...(cmsData.homePage.faqSection || {} as any), title: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                        Showcase Image URL
                      </label>
                      <input
                        type="text"
                        value={cmsData.homePage.faqSection?.imageSrc || '/assets/careers_team.webp'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              faqSection: { ...(cmsData.homePage.faqSection || {} as any), imageSrc: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                      Section Description
                    </label>
                    <textarea
                      rows={2}
                      value={cmsData.homePage.faqSection?.description || ''}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          homePage: {
                            ...cmsData.homePage,
                            faqSection: { ...(cmsData.homePage.faqSection || {} as any), description: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>

                  {/* FAQ Items List with Add & Delete */}
                  <div className="pt-2 border-t border-[#e3e7f0] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#272b33]">
                          Questions & Answers ({(cmsData.homePage.faqSection?.faqs || []).length} Items)
                        </h4>
                        <p className="text-[11px] text-[#8c9ba5]">
                          Every question and answer can be edited, added, or deleted. Changes persist live on the home page.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const q = prompt('Enter FAQ Question:') || 'What is your transformation delivery timeline?';
                          const a = prompt('Enter FAQ Answer:') || 'Engagements typically deliver architecture value in 6 to 12 weeks.';
                          const updated = [...(cmsData.homePage.faqSection?.faqs || []), { question: q, answer: a }];
                          setCmsData({
                            ...cmsData,
                            homePage: {
                              ...cmsData.homePage,
                              faqSection: { ...(cmsData.homePage.faqSection || {} as any), faqs: updated },
                            },
                          });
                          triggerToast('New FAQ added!');
                        }}
                        className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New FAQ</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(cmsData.homePage.faqSection?.faqs || []).map((faq, fIdx) => (
                        <div key={fIdx} className="border border-[#e3e7f0] rounded-lg bg-[#fcfdfe] p-4 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1">
                              <label className="block text-[11px] font-bold text-[#4945ff] uppercase">
                                Question {fIdx + 1}
                              </label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => {
                                  const updated = [...(cmsData.homePage.faqSection?.faqs || [])];
                                  updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      faqSection: { ...(cmsData.homePage.faqSection || {} as any), faqs: updated },
                                    },
                                  });
                                }}
                                className="w-full px-3 py-1.5 text-xs font-bold rounded border border-[#e3e7f0] bg-white focus:outline-none focus:border-[#4945ff]"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete question "${faq.question}"?`)) {
                                  const updated = (cmsData.homePage.faqSection?.faqs || []).filter((_, i) => i !== fIdx);
                                  setCmsData({
                                    ...cmsData,
                                    homePage: {
                                      ...cmsData.homePage,
                                      faqSection: { ...(cmsData.homePage.faqSection || {} as any), faqs: updated },
                                    },
                                  });
                                  triggerToast('FAQ item deleted.');
                                }
                              }}
                              className="text-[#8c9ba5] hover:text-red-600 p-1 mt-5"
                              title="Delete question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#4a5568] mb-1">
                              Answer / Response Text
                            </label>
                            <textarea
                              rows={3}
                              value={faq.answer}
                              onChange={(e) => {
                                const updated = [...(cmsData.homePage.faqSection?.faqs || [])];
                                updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    faqSection: { ...(cmsData.homePage.faqSection || {} as any), faqs: updated },
                                  },
                                });
                              }}
                              className="w-full px-3 py-1.5 text-xs rounded border border-[#e3e7f0] bg-white focus:outline-none focus:border-[#4945ff]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW: AboutUsPage (Comprehensive 4 Sections Management)
              ======================================================== */}
          {activeView === 'AboutUsPage' && !jsonMode && (() => {
            const about = cmsData.aboutPage || DEFAULT_ABOUT_PAGE;
            const roster = about.teamRoster || DEFAULT_ABOUT_PAGE.teamRoster;
            const story = about.storySection || DEFAULT_ABOUT_PAGE.storySection;
            const values = about.valuesSection || DEFAULT_ABOUT_PAGE.valuesSection;
            const focus = about.focusSection || DEFAULT_ABOUT_PAGE.focusSection;

            const updateAbout = (updater: (prev: typeof about) => typeof about) => {
              setCmsData((prev) => {
                const current = prev.aboutPage || DEFAULT_ABOUT_PAGE;
                return {
                  ...prev,
                  aboutPage: updater(current),
                };
              });
            };

            return (
              <div className="space-y-6 max-w-[1020px]">
                {/* About Page Section Quick Navigation Bar */}
                <div className="bg-white border border-[#e3e7f0] rounded-lg p-3 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[11px] font-bold text-[#8c9ba5] uppercase tracking-wider mr-2 shrink-0">
                      About Sections:
                    </span>
                    {[
                      { id: 'all', label: 'All Sections (4)' },
                      { id: 'roster', label: `1. Team & Leadership (${roster.members?.length || 0})` },
                      { id: 'story', label: '2. Story, Mission & Vision' },
                      { id: 'values', label: `3. Core Values (${values.values?.length || 0})` },
                      { id: 'focus', label: `4. Focus Areas (${focus.focusAreas?.length || 0})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setAboutSubTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold shrink-0 transition-colors ${
                          aboutSubTab === tab.id
                            ? 'bg-[#4945ff] text-white shadow-xs'
                            : 'bg-[#f6f8fb] text-[#4a5568] hover:bg-[#edf2f7] hover:text-[#272b33]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-[#288226] bg-[#eafbe7] border border-[#bbf2b6] px-2 py-0.5 rounded font-medium shrink-0">
                    Live Component: /about
                  </span>
                </div>

                {/* ----------------------------------------------------
                    SECTION 1: Leadership & Team Roster (First section)
                    ---------------------------------------------------- */}
                {(aboutSubTab === 'all' || aboutSubTab === 'roster') && (
                  <div className="space-y-5">
                    {/* Section Header Card */}
                    <div className="p-6 border border-[#e3e7f0] rounded-lg bg-white shadow-xs space-y-5">
                      <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-md bg-[#f0f3ff] text-[#4945ff] flex items-center justify-center font-bold text-xs">
                            01
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-[#272b33]">
                              First Section: Duotone Team & Leadership Roster
                            </h3>
                            <p className="text-xs text-[#8c9ba5] mt-0.5">
                              Hero interactive drift columns of team portraits, bios, craft tags, and open hiring roles.
                            </p>
                          </div>
                        </div>

                        {/* Toggle Show Photos */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#4a5568]">Display:</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: {
                                  ...prev.teamRoster,
                                  showPhotos: !prev.teamRoster.showPhotos,
                                },
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                              roster.showPhotos
                                ? 'bg-[#eafbe7] text-[#288226] border-[#bbf2b6]'
                                : 'bg-[#fff4e6] text-[#d9730d] border-[#ffd8a8]'
                            }`}
                          >
                            {roster.showPhotos ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Duotone Photos ON</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Monogram Plates ON</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Section Eyebrow
                          </label>
                          <input
                            type="text"
                            value={roster.eyebrow || ''}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, eyebrow: e.target.value },
                              }))
                            }
                            placeholder="LEADERSHIP · EXPERTISE · VALUES"
                            className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Display Title (Use \n for line break)
                          </label>
                          <input
                            type="text"
                            value={roster.title || ''}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, title: e.target.value },
                              }))
                            }
                            placeholder="The\nminds"
                            className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden font-mono"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Intro / Corporate Subtext
                          </label>
                          <textarea
                            rows={2}
                            value={roster.intro || ''}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, intro: e.target.value },
                              }))
                            }
                            className="w-full text-xs p-3 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Primary CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={roster.ctaLabel || ''}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, ctaLabel: e.target.value },
                              }))
                            }
                            placeholder="Join the team"
                            className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Primary CTA Link
                          </label>
                          <input
                            type="text"
                            value={roster.ctaHref || ''}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, ctaHref: e.target.value },
                              }))
                            }
                            placeholder="/careers"
                            className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Secondary CTA Label
                          </label>
                          <input
                            type="text"
                            value={roster.secondaryCtaLabel || ''}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, secondaryCtaLabel: e.target.value },
                              }))
                            }
                            placeholder="Our Approach →"
                            className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Secondary CTA Link
                          </label>
                          <input
                            type="text"
                            value={roster.secondaryCtaHref || ''}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, secondaryCtaHref: e.target.value },
                              }))
                            }
                            placeholder="/services"
                            className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Roster Desktop Columns (2 - 4)
                          </label>
                          <input
                            type="number"
                            min={2}
                            max={4}
                            value={roster.columns || 3}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, columns: Number(e.target.value) || 3 },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                            Drift Speed Seconds (Lower is faster)
                          </label>
                          <input
                            type="number"
                            min={8}
                            max={60}
                            value={roster.driftSeconds || 22}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                teamRoster: { ...prev.teamRoster, driftSeconds: Number(e.target.value) || 22 },
                              }))
                            }
                            className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Team Members List Card */}
                    <div className="p-6 border border-[#e3e7f0] rounded-lg bg-white shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#4945ff]" />
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#272b33]">
                            Team Members Roster ({roster.members?.length || 0})
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newId = 'tm-' + Date.now();
                            const newMember = {
                              id: newId,
                              name: 'New Leadership Member',
                              role: 'Principal Consultant',
                              craft: 'Advisory',
                              bio: 'Strategic leader driving transformative enterprise results and digital operating models.',
                              photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                              href: 'mailto:contact@axiakairos.com',
                              linkLabel: 'Connect',
                              focus: '50% 25%',
                            };
                            updateAbout((prev) => ({
                              ...prev,
                              teamRoster: {
                                ...prev.teamRoster,
                                members: [...(prev.teamRoster.members || []), newMember],
                              },
                            }));
                            triggerToast('New team member added! You can now configure their details & photo.');
                          }}
                          className="px-3 py-1.5 rounded-md bg-[#4945ff] hover:bg-[#3833e6] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Team Member</span>
                        </button>
                      </div>

                      <div className="space-y-4 pt-1">
                        {(roster.members || []).map((member, index) => (
                          <div
                            key={member.id || index}
                            className="p-4 border border-[#e3e7f0] rounded-lg bg-[#fcfdfe] hover:border-[#4945ff]/40 transition-colors space-y-3"
                          >
                            {/* Member header bar */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-[#0b192c]">
                                  {member.photo ? (
                                    <img
                                      src={member.photo}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    member.name.slice(0, 2).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <span className="font-bold text-xs text-[#272b33]">
                                    {member.name || `Member #${index + 1}`}
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] text-[#4a5568]">
                                      {member.role || 'No role set'}
                                    </span>
                                    {member.craft && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#eef1ff] text-[#4945ff]">
                                        {member.craft}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete ${member.name || 'this member'}?`)) {
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.filter((_, i) => i !== index),
                                      },
                                    }));
                                  }
                                }}
                                className="p-1.5 text-[#8c9ba5] hover:text-[#e03131] hover:bg-[#fff5f5] rounded-md transition-colors"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Inputs grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[#f0f3f6]">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.map((m, i) =>
                                          i === index ? { ...m, name: e.target.value } : m
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                                  Role / Corporate Title
                                </label>
                                <input
                                  type="text"
                                  value={member.role}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.map((m, i) =>
                                          i === index ? { ...m, role: e.target.value } : m
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                                  Craft / Domain Tag
                                </label>
                                <input
                                  type="text"
                                  value={member.craft}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.map((m, i) =>
                                          i === index ? { ...m, craft: e.target.value } : m
                                        ),
                                      },
                                    }))
                                  }
                                  placeholder="e.g. Cognitive AI"
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                                  Portrait Image URL
                                </label>
                                <input
                                  type="text"
                                  value={member.photo || ''}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.map((m, i) =>
                                          i === index ? { ...m, photo: e.target.value } : m
                                        ),
                                      },
                                    }))
                                  }
                                  placeholder="https://... or /assets/..."
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                                  Portrait Focus Point
                                </label>
                                <input
                                  type="text"
                                  value={member.focus || '50% 25%'}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.map((m, i) =>
                                          i === index ? { ...m, focus: e.target.value } : m
                                        ),
                                      },
                                    }))
                                  }
                                  placeholder="50% 25%"
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden font-mono"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                                  Bio / Professional Narrative (Unfolds on Card Hover/Tap)
                                </label>
                                <textarea
                                  rows={2}
                                  value={member.bio || ''}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.map((m, i) =>
                                          i === index ? { ...m, bio: e.target.value } : m
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full text-xs p-2.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                                  Contact Link URL
                                </label>
                                <input
                                  type="text"
                                  value={member.href || ''}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.map((m, i) =>
                                          i === index ? { ...m, href: e.target.value } : m
                                        ),
                                      },
                                    }))
                                  }
                                  placeholder="mailto:contact@axiakairos.com or LinkedIn"
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                                  Link Button Text
                                </label>
                                <input
                                  type="text"
                                  value={member.linkLabel || 'Connect'}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        members: prev.teamRoster.members.map((m, i) =>
                                          i === index ? { ...m, linkLabel: e.target.value } : m
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Open Hiring Roles Card */}
                    <div className="p-6 border border-[#e3e7f0] rounded-lg bg-white shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#4945ff]" />
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#272b33]">
                            Open Roles in Roster ({roster.openRoles?.length || 0})
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newRole = {
                              id: 'role-' + Date.now(),
                              title: 'Senior Enterprise Architect',
                              craft: 'Enterprise Cloud',
                              note: 'Lead cloud modernization initiatives for Fortune 500 enterprises.',
                              href: '/careers',
                              mark: 'You?',
                              linkLabel: 'Explore Role',
                            };
                            updateAbout((prev) => ({
                              ...prev,
                              teamRoster: {
                                ...prev.teamRoster,
                                openRoles: [...(prev.teamRoster.openRoles || []), newRole],
                              },
                            }));
                          }}
                          className="px-3 py-1.5 rounded-md bg-[#4945ff] hover:bg-[#3833e6] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Open Role</span>
                        </button>
                      </div>

                      <div className="space-y-3 pt-1">
                        {(roster.openRoles || []).map((role, rIndex) => (
                          <div
                            key={role.id || rIndex}
                            className="p-3.5 border border-[#e3e7f0] rounded-lg bg-[#fcfdfe] space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#272b33]">
                                {role.title || `Open Role #${rIndex + 1}`}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  updateAbout((prev) => ({
                                    ...prev,
                                    teamRoster: {
                                      ...prev.teamRoster,
                                      openRoles: prev.teamRoster.openRoles.filter((_, i) => i !== rIndex),
                                    },
                                  }));
                                }}
                                className="p-1 text-[#8c9ba5] hover:text-[#e03131] rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase mb-0.5">
                                  Role Title
                                </label>
                                <input
                                  type="text"
                                  value={role.title}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        openRoles: prev.teamRoster.openRoles.map((r, i) =>
                                          i === rIndex ? { ...r, title: e.target.value } : r
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase mb-0.5">
                                  Craft Tag
                                </label>
                                <input
                                  type="text"
                                  value={role.craft}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        openRoles: prev.teamRoster.openRoles.map((r, i) =>
                                          i === rIndex ? { ...r, craft: e.target.value } : r
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase mb-0.5">
                                  Career Page Link
                                </label>
                                <input
                                  type="text"
                                  value={role.href}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        openRoles: prev.teamRoster.openRoles.map((r, i) =>
                                          i === rIndex ? { ...r, href: e.target.value } : r
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                                />
                              </div>

                              <div className="md:col-span-3">
                                <label className="block text-[11px] font-semibold text-[#4a5568] uppercase mb-0.5">
                                  Role Note / Description
                                </label>
                                <textarea
                                  rows={1}
                                  value={role.note}
                                  onChange={(e) =>
                                    updateAbout((prev) => ({
                                      ...prev,
                                      teamRoster: {
                                        ...prev.teamRoster,
                                        openRoles: prev.teamRoster.openRoles.map((r, i) =>
                                          i === rIndex ? { ...r, note: e.target.value } : r
                                        ),
                                      },
                                    }))
                                  }
                                  className="w-full text-xs p-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------
                    SECTION 2: Story, Mission & Vision
                    ---------------------------------------------------- */}
                {(aboutSubTab === 'all' || aboutSubTab === 'story') && (
                  <div className="p-6 border border-[#e3e7f0] rounded-lg bg-white shadow-xs space-y-5">
                    <div className="flex items-center gap-2.5 border-b border-[#e3e7f0] pb-4">
                      <div className="w-8 h-8 rounded-md bg-[#f0f3ff] text-[#4945ff] flex items-center justify-center font-bold text-xs">
                        02
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#272b33]">
                          Second Section: Origin, Mission & Vision
                        </h3>
                        <p className="text-xs text-[#8c9ba5] mt-0.5">
                          Enterprise transformation overview, corporate vision, mission statement, and global locations.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Eyebrow Tag
                        </label>
                        <input
                          type="text"
                          value={story.eyebrow || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              storySection: { ...prev.storySection, eyebrow: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Main Headline Title
                        </label>
                        <input
                          type="text"
                          value={story.title || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              storySection: { ...prev.storySection, title: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Subtitle / Tagline
                        </label>
                        <input
                          type="text"
                          value={story.tagline || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              storySection: { ...prev.storySection, tagline: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Full Corporate Overview Narrative
                        </label>
                        <textarea
                          rows={4}
                          value={story.overview || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              storySection: { ...prev.storySection, overview: e.target.value },
                            }))
                          }
                          className="w-full text-xs p-3 border border-[#dcdfe6] rounded-md focus:border-[#4945ff] leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Mission Statement
                        </label>
                        <textarea
                          rows={3}
                          value={story.mission || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              storySection: { ...prev.storySection, mission: e.target.value },
                            }))
                          }
                          className="w-full text-xs p-3 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Vision Statement
                        </label>
                        <textarea
                          rows={3}
                          value={story.vision || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              storySection: { ...prev.storySection, vision: e.target.value },
                            }))
                          }
                          className="w-full text-xs p-3 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Headquarters Description
                        </label>
                        <input
                          type="text"
                          value={story.headquarters || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              storySection: { ...prev.storySection, headquarters: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Global Locations (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={(story.locations || []).join(', ')}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              storySection: {
                                ...prev.storySection,
                                locations: e.target.value
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              },
                            }))
                          }
                          placeholder="Canada, India, USA, UAE"
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------
                    SECTION 3: Core Enterprise Values
                    ---------------------------------------------------- */}
                {(aboutSubTab === 'all' || aboutSubTab === 'values') && (
                  <div className="p-6 border border-[#e3e7f0] rounded-lg bg-white shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-[#f0f3ff] text-[#4945ff] flex items-center justify-center font-bold text-xs">
                          03
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#272b33]">
                            Third Section: Core Enterprise Values ({values.values?.length || 0})
                          </h3>
                          <p className="text-xs text-[#8c9ba5] mt-0.5">
                            Institutional principles and ethics that anchor client engagements.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newVal = {
                            id: 'val-' + Date.now(),
                            name: 'New Principle',
                            description: 'Description of the guiding enterprise standard and ethics.',
                          };
                          updateAbout((prev) => ({
                            ...prev,
                            valuesSection: {
                              ...prev.valuesSection,
                              values: [...(prev.valuesSection.values || []), newVal],
                            },
                          }));
                        }}
                        className="px-3 py-1.5 rounded-md bg-[#4945ff] hover:bg-[#3833e6] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Core Value</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Section Eyebrow
                        </label>
                        <input
                          type="text"
                          value={values.eyebrow || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              valuesSection: { ...prev.valuesSection, eyebrow: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={values.title || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              valuesSection: { ...prev.valuesSection, title: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Section Description
                        </label>
                        <input
                          type="text"
                          value={values.description || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              valuesSection: { ...prev.valuesSection, description: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {(values.values || []).map((val, vIdx) => (
                        <div
                          key={val.id || vIdx}
                          className="p-3.5 border border-[#e3e7f0] rounded-lg bg-[#fcfdfe] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#4945ff]">
                              Value #{vIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                updateAbout((prev) => ({
                                  ...prev,
                                  valuesSection: {
                                    ...prev.valuesSection,
                                    values: prev.valuesSection.values.filter((_, i) => i !== vIdx),
                                  },
                                }));
                              }}
                              className="p-1 text-[#8c9ba5] hover:text-[#e03131] rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#4a5568] uppercase mb-0.5">
                                Principle Name
                              </label>
                              <input
                                type="text"
                                value={val.name}
                                onChange={(e) =>
                                  updateAbout((prev) => ({
                                    ...prev,
                                    valuesSection: {
                                      ...prev.valuesSection,
                                      values: prev.valuesSection.values.map((v, i) =>
                                        i === vIdx ? { ...v, name: e.target.value } : v
                                      ),
                                    },
                                  }))
                                }
                                className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-[11px] font-semibold text-[#4a5568] uppercase mb-0.5">
                                Description
                              </label>
                              <input
                                type="text"
                                value={val.description}
                                onChange={(e) =>
                                  updateAbout((prev) => ({
                                    ...prev,
                                    valuesSection: {
                                      ...prev.valuesSection,
                                      values: prev.valuesSection.values.map((v, i) =>
                                        i === vIdx ? { ...v, description: e.target.value } : v
                                      ),
                                    },
                                  }))
                                }
                                className="w-full text-xs px-2.5 py-1.5 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------
                    SECTION 4: Strategic Focus Areas
                    ---------------------------------------------------- */}
                {(aboutSubTab === 'all' || aboutSubTab === 'focus') && (
                  <div className="p-6 border border-[#e3e7f0] rounded-lg bg-white shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-[#f0f3ff] text-[#4945ff] flex items-center justify-center font-bold text-xs">
                          04
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#272b33]">
                            Fourth Section: Practice Capabilities & Focus Areas ({focus.focusAreas?.length || 0})
                          </h3>
                          <p className="text-xs text-[#8c9ba5] mt-0.5">
                            Targeted technology competencies (SAP, Cloud, Data, Cyber, Automation).
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updateAbout((prev) => ({
                            ...prev,
                            focusSection: {
                              ...prev.focusSection,
                              focusAreas: [...(prev.focusSection.focusAreas || []), 'New Focus Domain Area'],
                            },
                          }));
                        }}
                        className="px-3 py-1.5 rounded-md bg-[#4945ff] hover:bg-[#3833e6] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Focus Area</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Section Eyebrow
                        </label>
                        <input
                          type="text"
                          value={focus.eyebrow || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              focusSection: { ...prev.focusSection, eyebrow: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={focus.title || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              focusSection: { ...prev.focusSection, title: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                          Section Description
                        </label>
                        <input
                          type="text"
                          value={focus.description || ''}
                          onChange={(e) =>
                            updateAbout((prev) => ({
                              ...prev,
                              focusSection: { ...prev.focusSection, description: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-2 border border-[#dcdfe6] rounded-md focus:border-[#4945ff]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                      {(focus.focusAreas || []).map((area, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 p-2.5 border border-[#e3e7f0] rounded-md bg-[#fcfdfe]"
                        >
                          <input
                            type="text"
                            value={area}
                            onChange={(e) =>
                              updateAbout((prev) => ({
                                ...prev,
                                focusSection: {
                                  ...prev.focusSection,
                                  focusAreas: prev.focusSection.focusAreas.map((f, i) =>
                                    i === fIdx ? e.target.value : f
                                  ),
                                },
                              }))
                            }
                            className="flex-1 text-xs px-2.5 py-1 border border-[#dcdfe6] rounded focus:border-[#4945ff]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateAbout((prev) => ({
                                ...prev,
                                focusSection: {
                                  ...prev.focusSection,
                                  focusAreas: prev.focusSection.focusAreas.filter((_, i) => i !== fIdx),
                                },
                              }));
                            }}
                            className="p-1 text-[#8c9ba5] hover:text-[#e03131] rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ========================================================
              VIEW 2: service (Collection Type - Add & Edit Services)
              ======================================================== */}
          {activeView === 'service' && (() => {
            const servicesList = cmsData.services || [];
            const filteredServices = servicesList.filter((s) => {
              if (!servicesSearch.trim()) return true;
              const q = servicesSearch.toLowerCase();
              return s.title.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q) || (s.shortDescription || '').toLowerCase().includes(q);
            });

            return (
              <div className="space-y-6 max-w-[1020px]">
                {/* Top Quick Bar */}
                <div className="bg-white border border-[#e3e7f0] rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#8c9ba5] uppercase tracking-wider">
                      Services ({servicesList.length})
                    </span>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={servicesSearch}
                        onChange={(e) => setServicesSearch(e.target.value)}
                        className="pl-8 pr-3 py-1 text-xs border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden w-48"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#288226] bg-[#eafbe7] border border-[#bbf2b6] px-2 py-0.5 rounded font-medium">
                      Live Component: /services
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const title = prompt('Enter new service title:');
                        if (!title) return;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        const newSvc: any = {
                          slug,
                          title,
                          shortDescription: 'Comprehensive enterprise advisory and digital architecture transformation.',
                          seo: {
                            title: `${title} | Axia Kairos`,
                            description: 'Enterprise consulting, architecture transformation, and implementation.',
                          },
                          hero: {
                            tagline: 'Strategic Enterprise Capability',
                          },
                          intro: {
                            paragraphs: ['Accelerating transformation across modern enterprise ecosystems.'],
                            image: '/assets/blogs/top-5-challenges-in-sap-migration-and-how-to-overcome-them.webp',
                          },
                          whyItMatters: {
                            lead: 'Why this service matters to enterprise leaders:',
                            items: [
                              { title: 'Strategic Velocity', text: 'Accelerate organizational readiness and time-to-market.' },
                              { title: 'Scalable Architecture', text: 'Built on robust engineering and zero-trust principles.' },
                            ],
                          },
                          portfolio: {
                            lead: 'Key Practice Capabilities:',
                            items: [
                              { title: 'Architecture Assessment', text: 'Diagnostic review and target-state blueprinting.', bullets: [] },
                              { title: 'Enterprise Modernization', text: 'Agile execution and end-to-end integration.', bullets: [] },
                            ],
                          },
                          methodology: {
                            lead: 'Our 4-Phase Delivery Framework:',
                            steps: [
                              { title: 'Phase 1: Discover & Align', text: 'Stakeholder discovery and technical assessment.' },
                              { title: 'Phase 2: Blueprint & Architect', text: 'Target architecture design and roadmap governance.' },
                              { title: 'Phase 3: Execute & Migrate', text: 'Disciplined sprint-based rollout with zero downtime.' },
                              { title: 'Phase 4: Optimize & Scale', text: 'Continuous performance enhancement and monitoring.' },
                            ],
                          },
                          caseStudySlugs: [],
                        };
                        setCmsData({
                          ...cmsData,
                          services: [newSvc, ...cmsData.services],
                        });
                        triggerToast(`Service "${title}" added! Remember to click Save / Publish.`);
                      }}
                      className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Create Service</span>
                    </button>
                  </div>
                </div>

                {/* Services List Cards */}
                <div className="space-y-5">
                  {filteredServices.map((svc, idx) => {
                    const originalIdx = cmsData.services.findIndex((s) => s.slug === svc.slug);
                    const actualIdx = originalIdx >= 0 ? originalIdx : idx;

                    return (
                      <div
                        key={svc.slug || idx}
                        className="border border-[#e3e7f0] rounded-lg bg-white p-6 shadow-xs space-y-4 hover:border-[#4945ff]/40 transition-colors"
                      >
                        {/* Header bar */}
                        <div className="flex items-start justify-between border-b border-[#e3e7f0] pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase bg-[#f0f3ff] text-[#4945ff] px-2 py-0.5 rounded font-bold">
                                {svc.hero?.tagline || 'Enterprise Service'}
                              </span>
                              <span className="text-xs font-mono text-[#8c9ba5]">
                                /services/{svc.slug}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[#272b33]">
                              {svc.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`/services/${svc.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-[#4945ff] hover:bg-slate-50 rounded"
                              title="Preview Live Service"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete service "${svc.title}"?`)) {
                                  setCmsData({
                                    ...cmsData,
                                    services: cmsData.services.filter((_, i) => i !== actualIdx),
                                  });
                                  triggerToast(`Service "${svc.title}" removed.`);
                                }
                              }}
                              className="p-1.5 text-[#8c9ba5] hover:text-[#e03131] hover:bg-[#fff5f5] rounded transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Core Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Service Title
                            </label>
                            <input
                              type="text"
                              value={svc.title}
                              onChange={(e) => {
                                const updated = [...cmsData.services];
                                updated[actualIdx] = { ...updated[actualIdx], title: e.target.value };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              URL Slug
                            </label>
                            <input
                              type="text"
                              value={svc.slug}
                              onChange={(e) => {
                                const updated = [...cmsData.services];
                                updated[actualIdx] = { ...updated[actualIdx], slug: e.target.value };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Hero Tagline Badge
                            </label>
                            <input
                              type="text"
                              value={svc.hero?.tagline || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.services];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  hero: { ...updated[actualIdx].hero, tagline: e.target.value },
                                };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Hero Background Image URL
                            </label>
                            <input
                              type="text"
                              value={svc.intro?.image || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.services];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  intro: { ...updated[actualIdx].intro, image: e.target.value },
                                };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              placeholder="/assets/blogs/... or https://..."
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              SEO Meta Title
                            </label>
                            <input
                              type="text"
                              value={svc.seo?.title || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.services];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  seo: { ...updated[actualIdx].seo, title: e.target.value },
                                };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Short Description (Shown on /services Index)
                            </label>
                            <textarea
                              rows={2}
                              value={svc.shortDescription || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.services];
                                updated[actualIdx] = { ...updated[actualIdx], shortDescription: e.target.value };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Introductory Paragraph (Shown on /services/{svc.slug} Detail Page)
                            </label>
                            <textarea
                              rows={3}
                              value={(svc.intro?.paragraphs || []).join('\n\n')}
                              onChange={(e) => {
                                const updated = [...cmsData.services];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  intro: {
                                    ...updated[actualIdx].intro,
                                    paragraphs: e.target.value.split('\n\n').filter(Boolean),
                                  },
                                };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* Why It Matters items */}
                        <div className="p-4 rounded-lg bg-[#f8f9fb] border border-[#e3e7f0] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#272b33] uppercase tracking-wider">
                              Why This Service Matters ({svc.whyItMatters?.items?.length || 0})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...cmsData.services];
                                const items = updated[actualIdx].whyItMatters?.items || [];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  whyItMatters: {
                                    lead: updated[actualIdx].whyItMatters?.lead || 'Why this service matters:',
                                    items: [...items, { title: 'New Impact Point', text: 'Strategic outcome description.' }],
                                  },
                                };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              className="text-[11px] font-semibold text-[#4945ff] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Point</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(svc.whyItMatters?.items || []).map((wItem, wIdx) => (
                              <div key={wIdx} className="p-3 bg-white rounded border border-[#e3e7f0] space-y-1.5 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...cmsData.services];
                                    const items = (updated[actualIdx].whyItMatters?.items || []).filter((_, i) => i !== wIdx);
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      whyItMatters: { ...updated[actualIdx].whyItMatters, items },
                                    };
                                    setCmsData({ ...cmsData, services: updated });
                                  }}
                                  className="absolute right-2 top-2 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="text"
                                  value={wItem.title}
                                  onChange={(e) => {
                                    const updated = [...cmsData.services];
                                    const items = [...(updated[actualIdx].whyItMatters?.items || [])];
                                    items[wIdx] = { ...items[wIdx], title: e.target.value };
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      whyItMatters: { ...updated[actualIdx].whyItMatters, items },
                                    };
                                    setCmsData({ ...cmsData, services: updated });
                                  }}
                                  placeholder="Point Title"
                                  className="w-full text-xs font-semibold px-2 py-1 border border-[#e3e7f0] rounded pr-6"
                                />
                                <textarea
                                  rows={2}
                                  value={wItem.text}
                                  onChange={(e) => {
                                    const updated = [...cmsData.services];
                                    const items = [...(updated[actualIdx].whyItMatters?.items || [])];
                                    items[wIdx] = { ...items[wIdx], text: e.target.value };
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      whyItMatters: { ...updated[actualIdx].whyItMatters, items },
                                    };
                                    setCmsData({ ...cmsData, services: updated });
                                  }}
                                  placeholder="Point Description"
                                  className="w-full text-xs p-2 border border-[#e3e7f0] rounded"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Practice Capabilities / Portfolio Items */}
                        <div className="p-4 rounded-lg bg-[#f8f9fb] border border-[#e3e7f0] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#272b33] uppercase tracking-wider">
                              Practice Capabilities & Solutions ({svc.portfolio?.items?.length || 0})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...cmsData.services];
                                const items = updated[actualIdx].portfolio?.items || [];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  portfolio: {
                                    lead: updated[actualIdx].portfolio?.lead || 'Key Practice Offerings:',
                                    items: [...items, { title: 'New Architecture Offering', text: 'Detailed delivery and operational execution.' }],
                                  },
                                };
                                setCmsData({ ...cmsData, services: updated });
                              }}
                              className="text-[11px] font-semibold text-[#4945ff] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Capability</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(svc.portfolio?.items || []).map((pItem, pIdx) => (
                              <div key={pIdx} className="p-3 bg-white rounded border border-[#e3e7f0] space-y-1.5 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...cmsData.services];
                                    const items = (updated[actualIdx].portfolio?.items || []).filter((_, i) => i !== pIdx);
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      portfolio: { ...updated[actualIdx].portfolio, items },
                                    };
                                    setCmsData({ ...cmsData, services: updated });
                                  }}
                                  className="absolute right-2 top-2 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="text"
                                  value={pItem.title}
                                  onChange={(e) => {
                                    const updated = [...cmsData.services];
                                    const items = [...(updated[actualIdx].portfolio?.items || [])];
                                    items[pIdx] = { ...items[pIdx], title: e.target.value };
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      portfolio: { ...updated[actualIdx].portfolio, items },
                                    };
                                    setCmsData({ ...cmsData, services: updated });
                                  }}
                                  placeholder="Capability Title"
                                  className="w-full text-xs font-semibold px-2 py-1 border border-[#e3e7f0] rounded pr-6"
                                />
                                <textarea
                                  rows={2}
                                  value={pItem.text}
                                  onChange={(e) => {
                                    const updated = [...cmsData.services];
                                    const items = [...(updated[actualIdx].portfolio?.items || [])];
                                    items[pIdx] = { ...items[pIdx], text: e.target.value };
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      portfolio: { ...updated[actualIdx].portfolio, items },
                                    };
                                    setCmsData({ ...cmsData, services: updated });
                                  }}
                                  placeholder="Capability Overview"
                                  className="w-full text-xs p-2 border border-[#e3e7f0] rounded"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ========================================================
              VIEW 3: blogPage (Add & Edit Blogs)
              ======================================================== */}
          {activeView === 'blogPage' && (() => {
            const blogsList = cmsData.blogs || [];
            const filteredBlogs = blogsList.filter((b) => {
              if (!sidebarFilter.trim()) return true;
              const q = sidebarFilter.toLowerCase();
              return b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q) || (b.excerpt || '').toLowerCase().includes(q);
            });

            return (
              <div className="space-y-6 max-w-[1020px]">
                {/* Top Quick Bar */}
                <div className="bg-white border border-[#e3e7f0] rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#8c9ba5] uppercase tracking-wider">
                      Blog Articles ({blogsList.length})
                    </span>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={sidebarFilter}
                        onChange={(e) => setSidebarFilter(e.target.value)}
                        className="pl-8 pr-3 py-1 text-xs border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden w-48"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#288226] bg-[#eafbe7] border border-[#bbf2b6] px-2 py-0.5 rounded font-medium">
                      Live Component: /blogs
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const title = prompt('Enter new blog post title:');
                        if (!title) return;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        const newBlog: any = {
                          slug,
                          title,
                          excerpt: 'Executive insights on enterprise transformation and strategic agility.',
                          date: new Date().toISOString(),
                          formattedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                          readingTimeMinutes: 5,
                          coverImage: '/assets/blogs/top-5-challenges-in-sap-migration-and-how-to-overcome-them.webp',
                          seo: { title: `${title} | Axia Kairos Insights`, description: 'Insights from Axia Kairos consultants.' },
                          body: [
                            { type: 'p', text: 'Enterprise transformation begins with clear strategic alignment and disciplined architecture.' },
                          ],
                        };
                        setCmsData({
                          ...cmsData,
                          blogs: [newBlog, ...cmsData.blogs],
                        });
                        triggerToast(`Blog post "${title}" created! Click Save / Publish.`);
                      }}
                      className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Create Article</span>
                    </button>
                  </div>
                </div>

                {/* Articles List */}
                <div className="space-y-5">
                  {filteredBlogs.map((b, idx) => {
                    const originalIdx = cmsData.blogs.findIndex((item) => item.slug === b.slug);
                    const actualIdx = originalIdx >= 0 ? originalIdx : idx;

                    return (
                      <div
                        key={b.slug || idx}
                        className="border border-[#e3e7f0] rounded-lg bg-white p-6 shadow-xs space-y-4 hover:border-[#4945ff]/40 transition-colors"
                      >
                        {/* Header bar */}
                        <div className="flex items-start justify-between border-b border-[#e3e7f0] pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase bg-[#f0f3ff] text-[#4945ff] px-2 py-0.5 rounded font-bold">
                                {b.formattedDate || b.date}
                              </span>
                              <span className="text-[11px] font-mono text-[#8c9ba5]">
                                {b.readingTimeMinutes || 5} min read
                              </span>
                              <span className="text-xs font-mono text-[#8c9ba5]">
                                /blogs/{b.slug}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[#272b33]">
                              {b.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`/blogs/${b.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-[#4945ff] hover:bg-slate-50 rounded"
                              title="Preview Article"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete post "${b.title}"?`)) {
                                  setCmsData({
                                    ...cmsData,
                                    blogs: cmsData.blogs.filter((_, i) => i !== actualIdx),
                                  });
                                  triggerToast(`Article "${b.title}" removed.`);
                                }
                              }}
                              className="p-1.5 text-[#8c9ba5] hover:text-[#e03131] hover:bg-[#fff5f5] rounded transition-colors"
                              title="Delete post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Article Title
                            </label>
                            <input
                              type="text"
                              value={b.title}
                              onChange={(e) => {
                                const updated = [...cmsData.blogs];
                                updated[actualIdx] = { ...updated[actualIdx], title: e.target.value };
                                setCmsData({ ...cmsData, blogs: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              URL Slug
                            </label>
                            <input
                              type="text"
                              value={b.slug}
                              onChange={(e) => {
                                const updated = [...cmsData.blogs];
                                updated[actualIdx] = { ...updated[actualIdx], slug: e.target.value };
                                setCmsData({ ...cmsData, blogs: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-mono"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Cover Image URL
                            </label>
                            <input
                              type="text"
                              value={b.coverImage || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.blogs];
                                updated[actualIdx] = { ...updated[actualIdx], coverImage: e.target.value };
                                setCmsData({ ...cmsData, blogs: updated });
                              }}
                              placeholder="/assets/blogs/... or https://..."
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Reading Time (Minutes)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={b.readingTimeMinutes || 5}
                              onChange={(e) => {
                                const updated = [...cmsData.blogs];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  readingTimeMinutes: parseInt(e.target.value, 10) || 5,
                                };
                                setCmsData({ ...cmsData, blogs: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Executive Excerpt / Teaser
                            </label>
                            <textarea
                              rows={2}
                              value={b.excerpt}
                              onChange={(e) => {
                                const updated = [...cmsData.blogs];
                                updated[actualIdx] = { ...updated[actualIdx], excerpt: e.target.value };
                                setCmsData({ ...cmsData, blogs: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Article Content Body (Paragraphs)
                            </label>
                            <textarea
                              rows={5}
                              value={(b.body || [])
                                .map((block: any) => block.text || (block.items ? block.items.join('\n- ') : ''))
                                .filter(Boolean)
                                .join('\n\n')}
                              onChange={(e) => {
                                const paragraphs = e.target.value.split('\n\n').filter(Boolean);
                                const updated = [...cmsData.blogs];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  body: paragraphs.map((p) => ({ type: 'p', text: p })),
                                };
                                setCmsData({ ...cmsData, blogs: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden leading-relaxed font-mono"
                              placeholder="Write article paragraphs separated by double enter..."
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ========================================================
              VIEW 4: Navbar
              ======================================================== */}
          {activeView === 'Navbar' && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4">
                <h3 className="font-semibold text-xs text-[#4a5568] uppercase tracking-wider">
                  Brand Logo & Top Navigation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Brand Text
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.brand}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, brand: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Sub Brand
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.sub}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, sub: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-bold text-[#c2a675]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Trademark Symbol
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.trademark}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, trademark: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.ctaLabel}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, ctaLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      CTA Destination URL
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.ctaHref}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, ctaHref: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 5: robot (Chatbot Configuration with c.webp)
              ======================================================== */}
          {activeView === 'robot' && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#d8e0ff] bg-slate-900 flex items-center justify-center">
                    <img
                      src={cmsData.robot.avatarUrl}
                      alt="Chatbot Avatar"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#272b33]">
                      AI Chatbot Assistant Profile
                    </h3>
                    <p className="text-xs text-[#8c9ba5]">
                      Managed robot avatar, greeting, status, and system prompts.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Assistant Display Name
                    </label>
                    <input
                      type="text"
                      value={cmsData.robot.name}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          robot: { ...cmsData.robot, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Avatar Image Path
                    </label>
                    <input
                      type="text"
                      value={cmsData.robot.avatarUrl}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          robot: { ...cmsData.robot, avatarUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                    Welcome Greeting Message
                  </label>
                  <textarea
                    rows={3}
                    value={cmsData.robot.welcomeMessage}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        robot: { ...cmsData.robot, welcomeMessage: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 6: Inquiries (Contact Messages Manager)
              ======================================================== */}
          {activeView === 'inbox' && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#272b33]">
                    Client Inquiries & Contact Submissions ({messages.length})
                  </h2>
                  <p className="text-xs text-[#8c9ba5] mt-0.5">
                    Real-time management for website form submissions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await seedTestInquiry(token);
                    if (res && typeof res === 'object' && 'id' in res) {
                      setMessages([(res as unknown) as ContactMessageRecord, ...messages]);
                      triggerToast('Sample test inquiry generated!');
                    }
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Seed Test Inquiry</span>
                </button>
              </div>

              {messagesLoading ? (
                <div className="p-8 text-center text-xs text-[#8c9ba5]">
                  Loading inquiries...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-[#e3e7f0] rounded-lg bg-white">
                  <Mail className="w-8 h-8 text-[#8c9ba5] mx-auto mb-2" />
                  <p className="text-xs text-[#8c9ba5]">No inquiries received yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="border border-[#e3e7f0] rounded-lg bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#272b33]">
                            {msg.fullName || 'Anonymous Client'}
                          </span>
                          <span className="text-[11px] text-[#4945ff] font-medium">
                            {msg.email}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                              msg.status === 'unread'
                                ? 'bg-amber-100 text-amber-800'
                                : msg.status === 'replied'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#4a5568]">{msg.message}</p>
                        <span className="text-[10px] font-mono text-[#8c9ba5]">
                          {msg.company ? `${msg.company} · ` : ''}
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={msg.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as any;
                            await updateAdminMessageStatus(token, msg.id, newStatus);
                            setMessages(
                              messages.map((m) => (m.id === msg.id ? { ...m, status: newStatus } : m))
                            );
                            triggerToast(`Status updated to "${newStatus}"`);
                          }}
                          className="text-xs px-2.5 py-1.5 rounded border border-[#e3e7f0] bg-white font-medium"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm('Delete message?')) {
                              await deleteAdminMessage(token, msg.id);
                              setMessages(messages.filter((m) => m.id !== msg.id));
                              triggerToast('Message deleted.');
                            }
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-[#8c9ba5] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 7: LLM & AI Assistant Configuration
              ======================================================== */}
          {activeView === 'llm' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#eafbe7] border border-[#bbf2b6] flex items-center justify-center text-[#288226]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#272b33]">
                        AI Intelligence & LLM Model Settings
                      </h3>
                      <p className="text-xs text-[#8c9ba5]">
                        Configure OpenAI ChatGPT provider, model tier, search groundedness, and token parameters.
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#eafbe7] text-[#288226] border border-[#bbf2b6] text-xs font-bold px-2.5 py-1 rounded">
                    OpenAI ChatGPT Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      AI Provider & Model ID
                    </label>
                    <select
                      value={cmsData.llm.model || 'gpt-4o-mini'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, model: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-medium focus:outline-none focus:border-[#4945ff]"
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini (Recommended · OpenAI ChatGPT High Speed & Accuracy)</option>
                      <option value="gpt-4o">gpt-4o (OpenAI ChatGPT Full Reasoning Model)</option>
                      <option value="claude-haiku-5-5">claude-haiku-5-5 (Anthropic Claude Haiku)</option>
                      <option value="claude-sonnet-5-5">claude-sonnet-5-5 (Anthropic Claude Sonnet)</option>
                    </select>
                    <p className="text-[11px] text-[#8c9ba5] mt-1">
                      Selects the LLM that interprets queries and executes search & handoff tools.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Temperature ({cmsData.llm.temperature ?? 0.2})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={cmsData.llm.temperature ?? 0.2}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, temperature: parseFloat(e.target.value) },
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-[#8c9ba5] mt-0.5">
                      <span>Strict / Grounded (0.0)</span>
                      <span>Balanced (0.5)</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Max Completion Tokens per Turn
                    </label>
                    <input
                      type="number"
                      value={cmsData.llm.maxTokens || 400}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, maxTokens: parseInt(e.target.value) || 400 },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-mono"
                    />
                    <p className="text-[11px] text-[#8c9ba5] mt-1">
                      Target response length is under 120 words (~400 tokens) for crisp answers.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Groundedness Score Threshold
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={cmsData.llm.groundednessThreshold ?? 0.85}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, groundednessThreshold: parseFloat(e.target.value) || 0.85 },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-mono"
                    />
                    <p className="text-[11px] text-[#8c9ba5] mt-1">
                      Rejects hallucinated unverified claims below this threshold.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      OpenAI API Secret Key
                    </label>
                    <input
                      type="password"
                      placeholder="sk-proj-..."
                      value={cmsData.llm.apiKey || ''}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, apiKey: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-mono"
                    />
                    <p className="text-[11px] text-[#8c9ba5] mt-1">
                      Configure custom OpenAI API key for live chatbot inference. Falls back to server environment variable if left blank.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#f6f8ff] border border-[#d8e0ff] rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#272b33] block">
                      Enterprise Knowledge Base RAG Search
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      Enables semantic BM25 search over verified services, case studies, and corporate policies.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cmsData.llm.searchEnabled ?? true}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        llm: { ...cmsData.llm, searchEnabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-[#4945ff] rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 8: caseStudyPage (Case Studies Collection)
              ======================================================== */}
          {activeView === 'caseStudyPage' && !jsonMode && (() => {
            const caseStudiesList = cmsData.caseStudies || [];
            const filteredStudies = caseStudiesList.filter((cs) => {
              if (caseStudiesIndustryFilter !== 'all' && cs.industry !== caseStudiesIndustryFilter) {
                return false;
              }
              if (!caseStudiesSearch.trim()) return true;
              const q = caseStudiesSearch.toLowerCase();
              return cs.title.toLowerCase().includes(q) || cs.slug.toLowerCase().includes(q) || (cs.summary || '').toLowerCase().includes(q);
            });

            return (
              <div className="space-y-6 max-w-[1020px]">
                {/* Top Quick Bar */}
                <div className="bg-white border border-[#e3e7f0] rounded-lg p-3 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#8c9ba5] uppercase tracking-wider">
                        Case Studies ({caseStudiesList.length})
                      </span>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search case studies..."
                          value={caseStudiesSearch}
                          onChange={(e) => setCaseStudiesSearch(e.target.value)}
                          className="pl-8 pr-3 py-1 text-xs border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden w-48"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#288226] bg-[#eafbe7] border border-[#bbf2b6] px-2 py-0.5 rounded font-medium">
                        Live Component: /case-studies
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const title = prompt('Enter case study title:');
                          if (!title) return;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          const newCs: any = {
                            slug,
                            title,
                            industry: 'BFSI',
                            publishedOn: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                            image: '/assets/case-studies/sap-s-4-hana-migration-and-data-governance-modernization-for-a-global-energy-and-utilities-enterprise.webp',
                            summary: 'Strategic enterprise transformation delivering accelerated execution, automated workflows, and operational resilience.',
                            pullQuote: '"A flawless transformation that modernized core enterprise capabilities with zero disruption to active operations."',
                            technologies: ['SAP S/4HANA', 'AWS Cloud', 'SAP BTP', 'Kubernetes'],
                            results: {
                              lead: 'Verified Business Outcomes:',
                              items: [
                                { title: 'System Reliability', text: 'Zero unplanned downtime during global multi-region transition.', metric: '99.98%' },
                                { title: 'Process Acceleration', text: 'Reduction in reporting and operational financial closing cycles.', metric: '45%' },
                              ],
                            },
                            businessChallenge: {
                              lead: 'Key Enterprise Challenges:',
                              points: [
                                'Siloed data repositories limiting executive visibility.',
                                'Legacy architecture unable to scale with transactional volumes.',
                              ],
                            },
                            solution: {
                              lead: 'Engineered Solution Architecture:',
                              items: [
                                { title: 'Cloud-Native Backbone', text: 'Automated CI/CD deployment across enterprise cloud environments.' },
                                { title: 'Real-Time Telemetry', text: 'Integrated reporting dashboards with unified data governance.' },
                              ],
                            },
                          };
                          setCmsData({
                            ...cmsData,
                            caseStudies: [newCs, ...cmsData.caseStudies],
                          });
                          triggerToast(`Case study "${title}" added! Remember to click Save / Publish.`);
                        }}
                        className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Create Case Study</span>
                      </button>
                    </div>
                  </div>

                  {/* Industry filter pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#f0f3f6]">
                    <span className="text-[10px] font-bold text-[#8c9ba5] uppercase mr-1 shrink-0">Industry:</span>
                    {[
                      { id: 'all', label: 'All Industries' },
                      { id: 'BFSI', label: 'BFSI' },
                      { id: 'Healthcare & Life Sciences', label: 'Healthcare' },
                      { id: 'Manufacturing & Automotive', label: 'Manufacturing' },
                      { id: 'Energy & Utilities', label: 'Energy' },
                      { id: 'E-Commerce & Retail', label: 'Retail' },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setCaseStudiesIndustryFilter(pill.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-colors ${
                          caseStudiesIndustryFilter === pill.id
                            ? 'bg-[#4945ff] text-white'
                            : 'bg-[#f6f8fb] text-[#4a5568] hover:bg-[#edf2f7]'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Case Studies Cards List */}
                <div className="space-y-5">
                  {filteredStudies.map((cs, idx) => {
                    const originalIdx = cmsData.caseStudies.findIndex((item) => item.slug === cs.slug);
                    const actualIdx = originalIdx >= 0 ? originalIdx : idx;

                    return (
                      <div
                        key={cs.slug || idx}
                        className="border border-[#e3e7f0] rounded-lg bg-white p-6 shadow-xs space-y-4 hover:border-[#4945ff]/40 transition-colors"
                      >
                        {/* Header bar */}
                        <div className="flex items-start justify-between border-b border-[#e3e7f0] pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase bg-[#f0f3ff] text-[#4945ff] px-2 py-0.5 rounded font-bold">
                                {cs.industry || (cs as any).clientSector || 'Enterprise'}
                              </span>
                              <span className="text-xs font-mono text-[#8c9ba5]">
                                /case-studies/{cs.slug}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[#272b33]">
                              {cs.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`/case-studies/${cs.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-[#4945ff] hover:bg-slate-50 rounded"
                              title="Preview Case Study"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete case study "${cs.title}"?`)) {
                                  setCmsData({
                                    ...cmsData,
                                    caseStudies: cmsData.caseStudies.filter((_, i) => i !== actualIdx),
                                  });
                                  triggerToast(`Case study "${cs.title}" removed.`);
                                }
                              }}
                              className="p-1.5 text-[#8c9ba5] hover:text-[#e03131] hover:bg-[#fff5f5] rounded transition-colors"
                              title="Delete case study"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Form Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Case Study Title
                            </label>
                            <input
                              type="text"
                              value={cs.title}
                              onChange={(e) => {
                                const updated = [...cmsData.caseStudies];
                                updated[actualIdx] = { ...updated[actualIdx], title: e.target.value };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              URL Slug
                            </label>
                            <input
                              type="text"
                              value={cs.slug}
                              onChange={(e) => {
                                const updated = [...cmsData.caseStudies];
                                updated[actualIdx] = { ...updated[actualIdx], slug: e.target.value };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Industry Sector
                            </label>
                            <input
                              type="text"
                              value={cs.industry || (cs as any).clientSector || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.caseStudies];
                                updated[actualIdx] = { ...updated[actualIdx], industry: e.target.value };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Cover / Showcase Image URL
                            </label>
                            <input
                              type="text"
                              value={cs.image || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.caseStudies];
                                updated[actualIdx] = { ...updated[actualIdx], image: e.target.value };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              placeholder="/assets/case-studies/... or https://..."
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-mono"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Technologies Used (Comma Separated)
                            </label>
                            <input
                              type="text"
                              value={(cs.technologies || []).join(', ')}
                              onChange={(e) => {
                                const updated = [...cmsData.caseStudies];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                                };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              placeholder="SAP S/4HANA, AWS, Kubernetes, BTP..."
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Executive Summary Narrative
                            </label>
                            <textarea
                              rows={3}
                              value={cs.summary || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.caseStudies];
                                updated[actualIdx] = { ...updated[actualIdx], summary: e.target.value };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden leading-relaxed"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Client Executive Quote / Testimonial
                            </label>
                            <input
                              type="text"
                              value={cs.pullQuote || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.caseStudies];
                                updated[actualIdx] = { ...updated[actualIdx], pullQuote: e.target.value };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              placeholder='"A transformative partnership delivering extraordinary agility."'
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-serif"
                            />
                          </div>
                        </div>

                        {/* Verified Impact Metrics */}
                        <div className="p-4 rounded-lg bg-[#f8f9fb] border border-[#e3e7f0] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#272b33] uppercase tracking-wider">
                              Verified Impact Metrics ({cs.results?.items?.length || 0})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...cmsData.caseStudies];
                                const items = updated[actualIdx].results?.items || [];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  results: {
                                    lead: updated[actualIdx].results?.lead || 'Verified Outcomes:',
                                    items: [...items, { title: 'Operational Efficiency', metric: '40%', text: 'Acceleration in enterprise throughput.' }],
                                  },
                                };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              className="text-[11px] font-semibold text-[#4945ff] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Metric</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(cs.results?.items || []).map((mItem, mIdx) => (
                              <div key={mIdx} className="p-3 bg-white rounded border border-[#e3e7f0] space-y-1.5 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...cmsData.caseStudies];
                                    const items = (updated[actualIdx].results?.items || []).filter((_, i) => i !== mIdx);
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      results: { ...updated[actualIdx].results, items },
                                    };
                                    setCmsData({ ...cmsData, caseStudies: updated });
                                  }}
                                  className="absolute right-2 top-2 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={mItem.metric || ''}
                                    onChange={(e) => {
                                      const updated = [...cmsData.caseStudies];
                                      const items = [...(updated[actualIdx].results?.items || [])];
                                      items[mIdx] = { ...items[mIdx], metric: e.target.value };
                                      updated[actualIdx] = {
                                        ...updated[actualIdx],
                                        results: { ...updated[actualIdx].results, items },
                                      };
                                      setCmsData({ ...cmsData, caseStudies: updated });
                                    }}
                                    placeholder="Value (e.g. 99.9%)"
                                    className="text-xs font-bold px-2 py-1 border border-[#e3e7f0] rounded text-[#4945ff]"
                                  />
                                  <input
                                    type="text"
                                    value={mItem.title}
                                    onChange={(e) => {
                                      const updated = [...cmsData.caseStudies];
                                      const items = [...(updated[actualIdx].results?.items || [])];
                                      items[mIdx] = { ...items[mIdx], title: e.target.value };
                                      updated[actualIdx] = {
                                        ...updated[actualIdx],
                                        results: { ...updated[actualIdx].results, items },
                                      };
                                      setCmsData({ ...cmsData, caseStudies: updated });
                                    }}
                                    placeholder="Metric Label"
                                    className="text-xs font-semibold px-2 py-1 border border-[#e3e7f0] rounded"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={mItem.text}
                                  onChange={(e) => {
                                    const updated = [...cmsData.caseStudies];
                                    const items = [...(updated[actualIdx].results?.items || [])];
                                    items[mIdx] = { ...items[mIdx], text: e.target.value };
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      results: { ...updated[actualIdx].results, items },
                                    };
                                    setCmsData({ ...cmsData, caseStudies: updated });
                                  }}
                                  placeholder="Context description"
                                  className="w-full text-xs px-2 py-1 border border-[#e3e7f0] rounded text-slate-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Business Challenge & Problem Statement */}
                        <div className="p-4 rounded-lg bg-[#fff8f8] border border-[#f5c6cb] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#b02a37] uppercase tracking-wider">
                              Business Challenges ({cs.businessChallenge?.points?.length || 0})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...cmsData.caseStudies];
                                const currentPts = updated[actualIdx].businessChallenge?.points || [];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  businessChallenge: {
                                    lead: updated[actualIdx].businessChallenge?.lead || 'Key enterprise friction points addressed:',
                                    points: [...currentPts, 'Operational bottlenecks impacting execution velocity.'],
                                  },
                                };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              className="text-[11px] font-semibold text-[#b02a37] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Challenge Point</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(cs.businessChallenge?.points || []).map((pt, ptIdx) => (
                              <div key={ptIdx} className="flex items-center gap-2 bg-white p-2 rounded border border-[#f5c6cb]">
                                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                                  !
                                </span>
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => {
                                    const updated = [...cmsData.caseStudies];
                                    const points = [...(updated[actualIdx].businessChallenge?.points || [])];
                                    points[ptIdx] = e.target.value;
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      businessChallenge: {
                                        lead: updated[actualIdx].businessChallenge?.lead || 'Key enterprise friction points addressed:',
                                        points,
                                      },
                                    };
                                    setCmsData({ ...cmsData, caseStudies: updated });
                                  }}
                                  className="w-full text-xs px-2 py-1 border border-[#e3e7f0] rounded text-slate-700"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...cmsData.caseStudies];
                                    const points = (updated[actualIdx].businessChallenge?.points || []).filter((_, i) => i !== ptIdx);
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      businessChallenge: {
                                        lead: updated[actualIdx].businessChallenge?.lead || 'Key enterprise friction points addressed:',
                                        points,
                                      },
                                    };
                                    setCmsData({ ...cmsData, caseStudies: updated });
                                  }}
                                  className="text-slate-400 hover:text-red-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Engineered Solutions Implemented */}
                        <div className="p-4 rounded-lg bg-[#f0f9ff] border border-[#bae6fd] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">
                              Solution Architecture ({cs.solution?.items?.length || 0})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...cmsData.caseStudies];
                                const currentItems = updated[actualIdx].solution?.items || [];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  solution: {
                                    lead: updated[actualIdx].solution?.lead || 'Engineered multi-phase solution architecture:',
                                    items: [...currentItems, { title: 'Modern Architecture Pillar', text: 'Scalable cloud infrastructure rollout with automated failover.' }],
                                  },
                                };
                                setCmsData({ ...cmsData, caseStudies: updated });
                              }}
                              className="text-[11px] font-semibold text-[#0369a1] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Solution Pillar</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(cs.solution?.items || []).map((sItem, sIdx) => (
                              <div key={sIdx} className="p-3 bg-white rounded border border-[#bae6fd] space-y-1.5 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...cmsData.caseStudies];
                                    const items = (updated[actualIdx].solution?.items || []).filter((_, i) => i !== sIdx);
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      solution: {
                                        lead: updated[actualIdx].solution?.lead || 'Engineered multi-phase solution architecture:',
                                        items,
                                      },
                                    };
                                    setCmsData({ ...cmsData, caseStudies: updated });
                                  }}
                                  className="absolute right-2 top-2 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="text"
                                  value={sItem.title}
                                  onChange={(e) => {
                                    const updated = [...cmsData.caseStudies];
                                    const items = [...(updated[actualIdx].solution?.items || [])];
                                    items[sIdx] = { ...items[sIdx], title: e.target.value };
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      solution: { ...updated[actualIdx].solution, items },
                                    };
                                    setCmsData({ ...cmsData, caseStudies: updated });
                                  }}
                                  placeholder="Solution Component Title"
                                  className="w-full text-xs font-semibold px-2 py-1 border border-[#e3e7f0] rounded pr-6"
                                />
                                <textarea
                                  rows={2}
                                  value={sItem.text}
                                  onChange={(e) => {
                                    const updated = [...cmsData.caseStudies];
                                    const items = [...(updated[actualIdx].solution?.items || [])];
                                    items[sIdx] = { ...items[sIdx], text: e.target.value };
                                    updated[actualIdx] = {
                                      ...updated[actualIdx],
                                      solution: { ...updated[actualIdx].solution, items },
                                    };
                                    setCmsData({ ...cmsData, caseStudies: updated });
                                  }}
                                  placeholder="Architecture and implementation details..."
                                  className="w-full text-xs p-2 border border-[#e3e7f0] rounded"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ========================================================
              VIEW 9: CareerPage (Jobs & Hiring Openings)
              ======================================================== */}
          {activeView === 'CareerPage' && !jsonMode && (() => {
            const careersList = cmsData.careers || [];
            const openCount = careersList.filter((j) => j.status === 'open').length;
            const filteredCareers = careersList.filter((job) => {
              if (careersStatusFilter !== 'all' && job.status !== careersStatusFilter) return false;
              if (careersDeptFilter !== 'all' && job.department.toLowerCase() !== careersDeptFilter.toLowerCase()) return false;
              if (!careersSearch.trim()) return true;
              const q = careersSearch.toLowerCase();
              return (
                job.title.toLowerCase().includes(q) ||
                job.slug.toLowerCase().includes(q) ||
                job.location.toLowerCase().includes(q) ||
                (job.summary || '').toLowerCase().includes(q)
              );
            });

            return (
              <div className="space-y-6 max-w-[1020px]">
                {/* Top Quick Bar */}
                <div className="bg-white border border-[#e3e7f0] rounded-lg p-3 shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#8c9ba5] uppercase tracking-wider">
                        Careers ({openCount} Open · {careersList.length} Total)
                      </span>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search positions..."
                          value={careersSearch}
                          onChange={(e) => setCareersSearch(e.target.value)}
                          className="pl-8 pr-3 py-1 text-xs border border-[#dcdfe6] rounded-md focus:border-[#4945ff] focus:outline-hidden w-48"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#288226] bg-[#eafbe7] border border-[#bbf2b6] px-2 py-0.5 rounded font-medium">
                        Live Component: /careers
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const title = prompt('Enter new Job Title:');
                          if (!title) return;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          const newJob: any = {
                            slug,
                            title,
                            department: 'Technology Consulting',
                            location: 'Toronto, Canada / Remote',
                            employmentType: 'Full-Time',
                            experience: '5+ Years',
                            publishedOn: new Date().toISOString(),
                            status: 'open',
                            summary: 'Axia Kairos is seeking an experienced specialist to partner with client leaders and guide enterprise transformation roadmaps.',
                            sections: [
                              {
                                heading: 'The Role & Key Responsibilities',
                                paragraphs: ['In this role, you will lead high-impact client engagements, translating enterprise requirements into scalable modern architectures.'],
                                bullets: [
                                  'Partner directly with C-suite and technology executives.',
                                  'Architect and implement scalable cloud and enterprise solutions.',
                                  'Mentor high-performing distributed engineering teams.',
                                ],
                              },
                              {
                                heading: 'Qualifications & What You Bring',
                                paragraphs: ['We look for individuals with proven domain expertise and relentless commitment to delivery excellence.'],
                                bullets: [
                                  '5+ years in management or technology consulting.',
                                  'Deep hands-on experience in cloud platforms (AWS, Azure, GCP or SAP BTP).',
                                  'Outstanding executive presence and communication skills.',
                                ],
                              },
                            ],
                          };
                          setCmsData({
                            ...cmsData,
                            careers: [newJob, ...cmsData.careers],
                          });
                          triggerToast(`Job opening "${title}" created! Remember to click Save / Publish.`);
                        }}
                        className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Create Job Opening</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Pills (Department & Status) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f0f3f6]">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-[10px] font-bold text-[#8c9ba5] uppercase mr-1 shrink-0">Department:</span>
                      {[
                        { id: 'all', label: 'All Departments' },
                        { id: 'Technology Consulting', label: 'Tech Consulting' },
                        { id: 'Digital Transformation', label: 'Digital Transformation' },
                        { id: 'Enterprise Architecture', label: 'Architecture' },
                        { id: 'Data & AI', label: 'Data & AI' },
                        { id: 'Strategic Advisory', label: 'Strategy' },
                      ].map((pill) => (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => setCareersDeptFilter(pill.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-colors ${
                            careersDeptFilter === pill.id
                              ? 'bg-[#4945ff] text-white'
                              : 'bg-[#f6f8fb] text-[#4a5568] hover:bg-[#edf2f7]'
                          }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-[#8c9ba5] uppercase mr-1">Status:</span>
                      {(['all', 'open', 'closed'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setCareersStatusFilter(st)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                            careersStatusFilter === st
                              ? 'bg-[#272b33] text-white'
                              : 'bg-[#f6f8fb] text-[#4a5568] hover:bg-[#edf2f7]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Careers Job Cards List */}
                <div className="space-y-5">
                  {filteredCareers.map((job, idx) => {
                    const originalIdx = cmsData.careers.findIndex((item) => item.slug === job.slug);
                    const actualIdx = originalIdx >= 0 ? originalIdx : idx;

                    return (
                      <div
                        key={job.slug || idx}
                        className="border border-[#e3e7f0] rounded-lg bg-white p-6 shadow-xs space-y-4 hover:border-[#4945ff]/40 transition-colors"
                      >
                        {/* Header bar */}
                        <div className="flex items-start justify-between border-b border-[#e3e7f0] pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {/* Status Toggle Pill */}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...cmsData.careers];
                                  const nextStatus = updated[actualIdx].status === 'open' ? 'closed' : 'open';
                                  updated[actualIdx] = { ...updated[actualIdx], status: nextStatus };
                                  setCmsData({ ...cmsData, careers: updated });
                                  triggerToast(`Position status changed to ${nextStatus.toUpperCase()}`);
                                }}
                                className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                                  job.status === 'open'
                                    ? 'bg-[#eafbe7] text-[#288226] border border-[#bbf2b6] hover:bg-[#daf8d5]'
                                    : 'bg-[#f1f3f5] text-[#868e96] border border-[#ced4da] hover:bg-[#e9ecef]'
                                }`}
                                title="Click to toggle Open / Closed"
                              >
                                {job.status === 'open' ? '● OPEN / ACTIVE' : '○ CLOSED'}
                              </button>
                              <span className="text-[10px] font-mono uppercase bg-[#f0f3ff] text-[#4945ff] px-2 py-0.5 rounded font-bold">
                                {job.department}
                              </span>
                              <span className="text-xs font-mono text-[#8c9ba5]">
                                /careers/{job.slug}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[#272b33]">
                              {job.title}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`/careers/${job.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-[#4945ff] hover:bg-slate-50 rounded"
                              title="Preview Job Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete job opening "${job.title}"?`)) {
                                  setCmsData({
                                    ...cmsData,
                                    careers: cmsData.careers.filter((_, i) => i !== actualIdx),
                                  });
                                  triggerToast(`Job "${job.title}" removed.`);
                                }
                              }}
                              className="p-1.5 text-[#8c9ba5] hover:text-[#e03131] hover:bg-[#fff5f5] rounded transition-colors"
                              title="Delete position"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Core Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={job.title}
                              onChange={(e) => {
                                const updated = [...cmsData.careers];
                                updated[actualIdx] = { ...updated[actualIdx], title: e.target.value };
                                setCmsData({ ...cmsData, careers: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              URL Slug
                            </label>
                            <input
                              type="text"
                              value={job.slug}
                              onChange={(e) => {
                                const updated = [...cmsData.careers];
                                updated[actualIdx] = { ...updated[actualIdx], slug: e.target.value };
                                setCmsData({ ...cmsData, careers: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Department
                            </label>
                            <input
                              type="text"
                              value={job.department}
                              onChange={(e) => {
                                const updated = [...cmsData.careers];
                                updated[actualIdx] = { ...updated[actualIdx], department: e.target.value };
                                setCmsData({ ...cmsData, careers: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={job.location}
                              onChange={(e) => {
                                const updated = [...cmsData.careers];
                                updated[actualIdx] = { ...updated[actualIdx], location: e.target.value };
                                setCmsData({ ...cmsData, careers: updated });
                              }}
                              placeholder="Toronto, Canada / Remote"
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Employment Type & Experience
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={job.employmentType}
                                onChange={(e) => {
                                  const updated = [...cmsData.careers];
                                  updated[actualIdx] = { ...updated[actualIdx], employmentType: e.target.value };
                                  setCmsData({ ...cmsData, careers: updated });
                                }}
                                placeholder="Full-Time"
                                className="w-full px-2.5 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                              />
                              <input
                                type="text"
                                value={job.experience || ''}
                                onChange={(e) => {
                                  const updated = [...cmsData.careers];
                                  updated[actualIdx] = { ...updated[actualIdx], experience: e.target.value };
                                  setCmsData({ ...cmsData, careers: updated });
                                }}
                                placeholder="4+ Years"
                                className="w-full px-2.5 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-1">
                              Role Summary / Teaser (Shown on Careers Landing)
                            </label>
                            <textarea
                              rows={2}
                              value={job.summary || ''}
                              onChange={(e) => {
                                const updated = [...cmsData.careers];
                                updated[actualIdx] = { ...updated[actualIdx], summary: e.target.value };
                                setCmsData({ ...cmsData, careers: updated });
                              }}
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#dcdfe6] focus:border-[#4945ff] focus:outline-hidden leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* Detailed Job Sections (Responsibilities, Requirements, Benefits) */}
                        <div className="p-4 rounded-lg bg-[#f8f9fb] border border-[#e3e7f0] space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#272b33] uppercase tracking-wider">
                              Detailed Job Description Sections ({job.sections?.length || 0})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...cmsData.careers];
                                const currentSections = updated[actualIdx].sections || [];
                                updated[actualIdx] = {
                                  ...updated[actualIdx],
                                  sections: [
                                    ...currentSections,
                                    {
                                      heading: 'New Section Heading',
                                      paragraphs: ['Detailed overview of this section.'],
                                      bullets: ['Key expectation or requirement point.'],
                                    },
                                  ],
                                };
                                setCmsData({ ...cmsData, careers: updated });
                              }}
                              className="text-[11px] font-semibold text-[#4945ff] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Section</span>
                            </button>
                          </div>

                          <div className="space-y-4">
                            {(job.sections || []).map((sec, secIdx) => (
                              <div key={secIdx} className="p-3 bg-white rounded-lg border border-[#e3e7f0] space-y-3 relative">
                                <div className="flex items-center justify-between border-b border-[#f0f3f6] pb-2">
                                  <input
                                    type="text"
                                    value={sec.heading}
                                    onChange={(e) => {
                                      const updated = [...cmsData.careers];
                                      const sections = [...(updated[actualIdx].sections || [])];
                                      sections[secIdx] = { ...sections[secIdx], heading: e.target.value };
                                      updated[actualIdx] = { ...updated[actualIdx], sections };
                                      setCmsData({ ...cmsData, careers: updated });
                                    }}
                                    placeholder="Section Heading (e.g. Responsibilities, Qualifications)"
                                    className="font-bold text-xs text-[#272b33] border-b border-transparent focus:border-[#4945ff] focus:outline-hidden flex-1 mr-4"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...cmsData.careers];
                                      const sections = (updated[actualIdx].sections || []).filter((_, i) => i !== secIdx);
                                      updated[actualIdx] = { ...updated[actualIdx], sections };
                                      setCmsData({ ...cmsData, careers: updated });
                                    }}
                                    className="text-slate-400 hover:text-red-600 p-1"
                                    title="Delete Section"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-[#8c9ba5] uppercase mb-1">
                                    Section Paragraphs
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={(sec.paragraphs || []).join('\n\n')}
                                    onChange={(e) => {
                                      const updated = [...cmsData.careers];
                                      const sections = [...(updated[actualIdx].sections || [])];
                                      sections[secIdx] = {
                                        ...sections[secIdx],
                                        paragraphs: e.target.value.split('\n\n').filter(Boolean),
                                      };
                                      updated[actualIdx] = { ...updated[actualIdx], sections };
                                      setCmsData({ ...cmsData, careers: updated });
                                    }}
                                    placeholder="Section narrative paragraphs..."
                                    className="w-full text-xs p-2 border border-[#e3e7f0] rounded focus:border-[#4945ff] focus:outline-hidden"
                                  />
                                </div>

                                {/* Bullets */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-[#8c9ba5] uppercase">
                                      Bullet Points ({sec.bullets?.length || 0})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...cmsData.careers];
                                        const sections = [...(updated[actualIdx].sections || [])];
                                        const bullets = [...(sections[secIdx].bullets || []), 'New key responsibility point'];
                                        sections[secIdx] = { ...sections[secIdx], bullets };
                                        updated[actualIdx] = { ...updated[actualIdx], sections };
                                        setCmsData({ ...cmsData, careers: updated });
                                      }}
                                      className="text-[10px] font-semibold text-[#4945ff] hover:underline"
                                    >
                                      + Add Bullet
                                    </button>
                                  </div>

                                  {(sec.bullets || []).map((bullet, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#4945ff] shrink-0" />
                                      <input
                                        type="text"
                                        value={bullet}
                                        onChange={(e) => {
                                          const updated = [...cmsData.careers];
                                          const sections = [...(updated[actualIdx].sections || [])];
                                          const bullets = [...(sections[secIdx].bullets || [])];
                                          bullets[bIdx] = e.target.value;
                                          sections[secIdx] = { ...sections[secIdx], bullets };
                                          updated[actualIdx] = { ...updated[actualIdx], sections };
                                          setCmsData({ ...cmsData, careers: updated });
                                        }}
                                        className="w-full text-xs px-2 py-1 border border-[#e3e7f0] rounded"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...cmsData.careers];
                                          const sections = [...(updated[actualIdx].sections || [])];
                                          const bullets = (sections[secIdx].bullets || []).filter((_, i) => i !== bIdx);
                                          sections[secIdx] = { ...sections[secIdx], bullets };
                                          updated[actualIdx] = { ...updated[actualIdx], sections };
                                          setCmsData({ ...cmsData, careers: updated });
                                        }}
                                        className="text-slate-400 hover:text-red-600 p-1 shrink-0"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ========================================================
              VIEW 10: ContactPage (Contact Management)
              ======================================================== */}
          {activeView === 'ContactPage' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              {/* Header & Inquiries Overview */}
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#272b33]">
                      Contact Page Header & Interactive Globe
                    </h3>
                    <p className="text-xs text-[#8c9ba5]">
                      Manage public contact titles, advisory narrative, and direct communication channels.
                    </p>
                  </div>
                  <span className="bg-[#eafbe7] text-[#288226] border border-[#bbf2b6] text-[11px] font-semibold px-2 py-0.5 rounded">
                    Live Component: /contact
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Hero Headline / Title
                    </label>
                    <input
                      type="text"
                      value={cmsData.contactPage?.title || "Let's build what's next."}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          contactPage: { ...cmsData.contactPage, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-hidden focus:border-[#4945ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Hero Badge / Subtitle
                    </label>
                    <input
                      type="text"
                      value={cmsData.contactPage?.subtitle || 'CONTACT AXIA KAIROS'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          contactPage: { ...cmsData.contactPage, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-hidden focus:border-[#4945ff]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Editorial Description (Interactive Globe Section)
                    </label>
                    <textarea
                      rows={2}
                      value={
                        (cmsData.contactPage as any)?.description ||
                        'Reach our global advisory team across North America, EMEA, and APAC. Connect with a principal consultant to discuss your strategic enterprise initiatives.'
                      }
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          contactPage: { ...(cmsData.contactPage as any), description: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-hidden focus:border-[#4945ff] leading-relaxed"
                    />
                  </div>
                </div>

                {/* Direct Email Routing Channels */}
                <div className="pt-2 border-t border-[#f0f3f6]">
                  <span className="block text-xs font-bold text-[#272b33] uppercase tracking-wider mb-3">
                    Direct Communication Channels
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                        General Inquiries Email
                      </label>
                      <input
                        type="email"
                        value={cmsData.contactPage?.emails?.general || 'contact@axiakairos.com'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            contactPage: {
                              ...cmsData.contactPage,
                              emails: { ...cmsData.contactPage?.emails, general: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                        Sales & Client Advisory Email
                      </label>
                      <input
                        type="email"
                        value={cmsData.contactPage?.emails?.sales || 'sales@axiakairos.com'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            contactPage: {
                              ...cmsData.contactPage,
                              emails: { ...cmsData.contactPage?.emails, sales: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                        Careers & Talent Email
                      </label>
                      <input
                        type="email"
                        value={cmsData.contactPage?.emails?.careers || 'careers@axiakairos.com'}
                        onChange={(e) =>
                          setCmsData({
                            ...cmsData,
                            contactPage: {
                              ...cmsData.contactPage,
                              emails: { ...cmsData.contactPage?.emails, careers: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & HQ Notice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#f0f3f6]">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Direct Advisory Phone
                    </label>
                    <input
                      type="text"
                      value={cmsData.contactPage?.phones?.general || '+1 (800) 321-4321'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          contactPage: {
                            ...cmsData.contactPage,
                            phones: { ...cmsData.contactPage?.phones, general: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Corporate Office Visits & Address Notice
                    </label>
                    <textarea
                      rows={2}
                      value={cmsData.contactPage?.noteOnStreetAddresses || 'Specific facility street addresses and appointments are coordinated directly through our client engagement team.'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          contactPage: {
                            ...cmsData.contactPage,
                            noteOnStreetAddresses: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Global Operating Hubs Manager */}
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#272b33]">
                      Global Corporate Operating Hubs ({cmsData.contactPage?.offices?.length || 0})
                    </h3>
                    <p className="text-xs text-[#8c9ba5]">
                      Manage physical executive offices, regional locations, flags, and operational summaries.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(cmsData.contactPage?.offices || [])];
                      updated.push({
                        country: 'New Operating Hub',
                        region: 'Regional Operating Center',
                        flag: '🌐',
                        status: 'Active Operations',
                        note: 'Strategic advisory and client delivery hub.',
                      });
                      setCmsData({
                        ...cmsData,
                        contactPage: { ...cmsData.contactPage, offices: updated },
                      });
                      triggerToast('New office hub added! Click Save / Publish.');
                    }}
                    className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Office Hub</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(cmsData.contactPage?.offices || []).map((office, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-[#e3e7f0] bg-[#fcfdfe] space-y-3 relative hover:border-[#4945ff]/40 transition-colors">
                      <div className="flex items-center justify-between border-b border-[#f0f3f6] pb-2">
                        <div className="flex items-center gap-2 flex-1 mr-3">
                          <input
                            type="text"
                            value={office.flag}
                            onChange={(e) => {
                              const updated = [...(cmsData.contactPage?.offices || [])];
                              updated[idx] = { ...updated[idx], flag: e.target.value };
                              setCmsData({
                                ...cmsData,
                                contactPage: { ...cmsData.contactPage, offices: updated },
                              });
                            }}
                            className="w-10 text-center text-lg px-1 py-0.5 border border-[#e3e7f0] rounded bg-white"
                            title="Flag Emoji"
                          />
                          <input
                            type="text"
                            value={office.country}
                            onChange={(e) => {
                              const updated = [...(cmsData.contactPage?.offices || [])];
                              updated[idx] = { ...updated[idx], country: e.target.value };
                              setCmsData({
                                ...cmsData,
                                contactPage: { ...cmsData.contactPage, offices: updated },
                              });
                            }}
                            className="font-bold text-xs text-[#272b33] px-2 py-1 border border-[#e3e7f0] rounded bg-white flex-1"
                            placeholder="Country Name"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete office hub "${office.country}"?`)) {
                              const updated = (cmsData.contactPage?.offices || []).filter((_, i) => i !== idx);
                              setCmsData({
                                ...cmsData,
                                contactPage: { ...cmsData.contactPage, offices: updated },
                              });
                              triggerToast('Office hub removed.');
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Delete Office Hub"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#8c9ba5] uppercase mb-1">
                            Region / City
                          </label>
                          <input
                            type="text"
                            value={office.region}
                            onChange={(e) => {
                              const updated = [...(cmsData.contactPage?.offices || [])];
                              updated[idx] = { ...updated[idx], region: e.target.value };
                              setCmsData({
                                ...cmsData,
                                contactPage: { ...cmsData.contactPage, offices: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded border border-[#e3e7f0] bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[#8c9ba5] uppercase mb-1">
                            Status Badge
                          </label>
                          <input
                            type="text"
                            value={office.status}
                            onChange={(e) => {
                              const updated = [...(cmsData.contactPage?.offices || [])];
                              updated[idx] = { ...updated[idx], status: e.target.value };
                              setCmsData({
                                ...cmsData,
                                contactPage: { ...cmsData.contactPage, offices: updated },
                              });
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded border border-[#e3e7f0] bg-white text-[#288226] font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8c9ba5] uppercase mb-1">
                          Operational Scope / Note
                        </label>
                        <textarea
                          rows={2}
                          value={office.note}
                          onChange={(e) => {
                            const updated = [...(cmsData.contactPage?.offices || [])];
                            updated[idx] = { ...updated[idx], note: e.target.value };
                            setCmsData({
                              ...cmsData,
                              contactPage: { ...cmsData.contactPage, offices: updated },
                            });
                          }}
                          className="w-full px-2.5 py-1 text-xs rounded border border-[#e3e7f0] bg-white text-[#667085] leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 12: Site Maps & Route Governance
              ======================================================== */}
          {activeView === 'sitemap' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              {/* Header card with metrics */}
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f0f3ff] border border-[#d8e0ff] flex items-center justify-center text-[#4945ff]">
                    <Network className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#272b33]">
                      Site Maps & Route Governance ({sitemapList.length} Routes)
                    </h2>
                    <p className="text-xs text-[#8c9ba5]">
                      Canonical domain: <span className="font-mono text-[#4945ff]">https://axiakairos.com</span> · XML endpoint: <span className="font-mono text-[#288226]">/sitemap.xml</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapList
                        .map(
                          (r) =>
                            `  <url>\n    <loc>https://axiakairos.com${r.url}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
                        )
                        .join('\n')}\n</urlset>`;
                      const blob = new Blob([xml], { type: 'application/xml' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'sitemap.xml';
                      a.click();
                      triggerToast('sitemap.xml exported successfully!');
                    }}
                    className="px-3 py-1.5 rounded-md border border-[#e3e7f0] hover:bg-[#f6f8fb] text-[#4a5568] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8c9ba5]" />
                    <span>Download XML</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newUrl = prompt('Enter new route path (e.g. /insights/new-whitepaper):');
                      if (!newUrl) return;
                      const newTitle = prompt('Enter route title:') || 'Custom Route';
                      setSitemapList([
                        ...sitemapList,
                        { url: newUrl.startsWith('/') ? newUrl : `/${newUrl}`, title: newTitle, priority: '0.7', changefreq: 'monthly', status: 'Indexed' },
                      ]);
                      triggerToast(`Route "${newUrl}" added to sitemap!`);
                    }}
                    className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Route</span>
                  </button>
                </div>
              </div>

              {/* Sitemap table */}
              <div className="border border-[#e3e7f0] rounded-lg bg-white overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fcfdfe] border-b border-[#e3e7f0] text-[11px] font-bold text-[#8c9ba5] uppercase">
                      <th className="py-3 px-4">Route Path</th>
                      <th className="py-3 px-4">Page Title</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Change Frequency</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e7f0] text-xs">
                    {sitemapList.map((route) => (
                      <tr key={route.url} className="hover:bg-[#f8faff] transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-[#4945ff]">
                          {route.url}
                        </td>
                        <td className="py-3 px-4 text-[#272b33] font-medium">
                          {route.title}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                              Number(route.priority) >= 0.9
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : Number(route.priority) >= 0.7
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {route.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#667085] capitalize">
                          {route.changefreq}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[#288226] text-[11px] font-semibold bg-[#eafbe7] border border-[#bbf2b6] px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#288226]" />
                            {route.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`https://axiakairos.com${route.url}`);
                              triggerToast(`Copied: https://axiakairos.com${route.url}`);
                            }}
                            className="p-1 text-[#8c9ba5] hover:text-[#4945ff] rounded transition-colors"
                            title="Copy Canonical URL"
                          >
                            <Copy className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 13: Send Notification Option
              ======================================================== */}
          {activeView === 'notification' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              {/* Notification Composer */}
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#fff4e6] border border-[#ffd8a8] flex items-center justify-center text-[#d9480f]">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#272b33]">
                        Send Notification & Client Broadcast
                      </h2>
                      <p className="text-xs text-[#8c9ba5]">
                        Dispatch push updates, announcements, and advisory alerts to client contacts and website visitors.
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#f0f3ff] text-[#4945ff] border border-[#d8e0ff] text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#4945ff] animate-pulse" />
                    Broadcast Dispatcher Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Target Audience / Recipient Segment
                    </label>
                    <select
                      value={notifTarget}
                      onChange={(e) => setNotifTarget(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-medium focus:outline-none focus:border-[#4945ff]"
                    >
                      <option value="All Inquiries & Form Contacts">All Inquiries & Form Contacts ({messages.length} Active Records)</option>
                      <option value="Enterprise Leads">Qualified Enterprise Leads</option>
                      <option value="Advisory Inquirers">Executive Advisory Inquirers</option>
                      <option value="All Visitors">Live Portal Visitors (Global Scrim Banner)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Notification Category
                    </label>
                    <select
                      value={notifType}
                      onChange={(e) => setNotifType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-medium focus:outline-none focus:border-[#4945ff]"
                    >
                      <option value="Announcement">Enterprise Announcement</option>
                      <option value="Consultation Follow-up">Consultation Follow-up</option>
                      <option value="Security Advisory">Security & Architecture Advisory</option>
                      <option value="Service Launch">Service & Capability Update</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Notification Subject / Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Axia Kairos Releases 2026 Cloud Resilience Framework"
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Broadcast Message Body
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter detailed message text to be dispatched..."
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                        Call-to-Action (CTA) Label
                      </label>
                      <input
                        type="text"
                        value={notifCtaLabel}
                        onChange={(e) => setNotifCtaLabel(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                        CTA Destination URL
                      </label>
                      <input
                        type="text"
                        value={notifCtaUrl}
                        onChange={(e) => setNotifCtaUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={isSendingNotif || !notifTitle.trim()}
                    onClick={() => {
                      if (!notifTitle.trim()) {
                        alert('Please enter a notification subject');
                        return;
                      }
                      setIsSendingNotif(true);
                      setTimeout(() => {
                        const newEntry: NotificationHistoryItem = {
                          id: `notif-${Date.now()}`,
                          title: notifTitle,
                          target: notifTarget,
                          type: notifType,
                          sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                          status: 'Sent',
                          recipientsCount: messages.length > 0 ? messages.length : 24,
                        };
                        setNotifHistory([newEntry, ...notifHistory]);
                        setNotifTitle('');
                        setNotifMessage('');
                        setIsSendingNotif(false);
                        triggerToast(`Notification "${newEntry.title}" sent successfully to ${newEntry.target}!`);
                      }, 700);
                    }}
                    className={`px-4 py-2 rounded-md bg-[#4945ff] hover:bg-[#3d38ee] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors ${
                      isSendingNotif || !notifTitle.trim() ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <SendHorizontal className="w-3.5 h-3.5" />
                    <span>{isSendingNotif ? 'Dispatching Broadcast...' : 'Send Notification Now'}</span>
                  </button>
                </div>
              </div>

              {/* Notification History */}
              <div className="border border-[#e3e7f0] rounded-lg bg-white overflow-hidden shadow-xs">
                <div className="px-5 py-3 border-b border-[#e3e7f0] bg-[#fcfdfe] flex items-center justify-between">
                  <span className="font-bold text-xs text-[#272b33]">
                    Sent Broadcast History ({notifHistory.length})
                  </span>
                  <span className="text-[11px] text-[#8c9ba5]">Dispatched via Admin Service</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fcfdfe] border-b border-[#e3e7f0] text-[11px] font-bold text-[#8c9ba5] uppercase">
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Target Audience</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Dispatched At</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e7f0] text-xs">
                    {notifHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f8faff] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#272b33]">
                          {item.title}
                        </td>
                        <td className="py-3 px-4 text-[#4a5568]">
                          {item.target} ({item.recipientsCount} contacts)
                        </td>
                        <td className="py-3 px-4 text-[#667085]">
                          {item.type}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#8c9ba5]">
                          {item.sentAt}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[#288226] text-[11px] font-semibold bg-[#eafbe7] border border-[#bbf2b6] px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#288226]" />
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              FALLBACK / JSON MODE: For remaining views or when JSON mode is toggled
              ======================================================== */}
          {(jsonMode ||
            !['HomePage', 'service', 'blogPage', 'Navbar', 'robot', 'inbox', 'llm', 'caseStudyPage', 'CareerPage', 'ContactPage', 'AboutUsPage', 'sitemap', 'notification'].includes(
              activeView
            )) && (
            <div className="p-8 border border-[#e3e7f0] rounded-lg bg-white shadow-xs space-y-4 max-w-[1020px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#4945ff]" />
                  <h3 className="font-bold text-sm text-[#272b33]">
                    {activeView} Model Data ({jsonMode ? 'JSON Mode Active' : 'Model View'})
                  </h3>
                </div>
                <span className="text-[11px] text-[#8c9ba5] font-mono">
                  Real-time sync to DB
                </span>
              </div>
              <p className="text-xs text-[#8c9ba5]">
                Raw JSON configuration for {activeView}. All edits save directly to the PostgreSQL database and update the live website and chatbot.
              </p>
              <textarea
                rows={16}
                value={JSON.stringify(
                  activeView === 'AboutUsPage'
                    ? cmsData.aboutUsPage
                    : activeView === 'ContactPage'
                    ? cmsData.contactPage
                    : activeView === 'footer'
                    ? cmsData.footer
                    : activeView === 'IndustryPage'
                    ? cmsData.industryPage
                    : activeView === 'llm'
                    ? cmsData.llm
                    : activeView === 'OurApproachPage'
                    ? cmsData.ourApproachPage
                    : activeView === 'PrivacyPolicyPage'
                    ? cmsData.privacyPolicyPage
                    : activeView === 'TermsAndConditionPage'
                    ? cmsData.termsAndConditionPage
                    : activeView === 'caseStudyPage'
                    ? cmsData.caseStudies
                    : activeView === 'CareerPage'
                    ? cmsData.careers
                    : activeView === 'redirect'
                    ? cmsData.redirect
                    : activeView === 'sitemap'
                    ? cmsData.sitemap
                    : activeView === 'User'
                    ? cmsData.users
                    : {},
                  null,
                  2
                )}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    const updated = { ...cmsData };
                    if (activeView === 'AboutUsPage') updated.aboutUsPage = parsed;
                    else if (activeView === 'ContactPage') updated.contactPage = parsed;
                    else if (activeView === 'footer') updated.footer = parsed;
                    else if (activeView === 'IndustryPage') updated.industryPage = parsed;
                    else if (activeView === 'llm') updated.llm = parsed;
                    else if (activeView === 'OurApproachPage') updated.ourApproachPage = parsed;
                    else if (activeView === 'PrivacyPolicyPage') updated.privacyPolicyPage = parsed;
                    else if (activeView === 'TermsAndConditionPage') updated.termsAndConditionPage = parsed;
                    else if (activeView === 'caseStudyPage') updated.caseStudies = parsed;
                    else if (activeView === 'CareerPage') updated.careers = parsed;
                    else if (activeView === 'redirect') updated.redirect = parsed;
                    else if (activeView === 'sitemap') updated.sitemap = parsed;
                    else if (activeView === 'User') updated.users = parsed;
                    setCmsData(updated);
                  } catch {}
                }}
                className="w-full p-3 font-mono text-xs rounded border border-[#e3e7f0] bg-[#fcfdfe] focus:outline-none focus:border-[#4945ff] leading-relaxed"
              />
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          4. RIGHT SIDEBAR (Entry Actions & Preview)
          ======================================================== */}
      <aside className="w-[260px] shrink-0 bg-[#ffffff] border-l border-[#e3e7f0] p-4 flex flex-col gap-5 z-20">
        {/* ENTRY Card (Matches screenshot) */}
        <div className="space-y-2.5">
          <div className="text-[10.5px] font-bold text-[#8c9ba5] uppercase tracking-wider">
            ENTRY
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePublish}
              className="flex-1 py-2 px-3 rounded-md bg-[#e3e7f0] hover:bg-[#d8e0ff] hover:text-[#4945ff] text-[#4a5568] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4945ff]" />
              <span>Publish</span>
            </button>
            <button
              type="button"
              onClick={() => setShowOptionsModal(!showOptionsModal)}
              className="p-2 rounded-md bg-[#e3e7f0] text-[#4a5568] hover:bg-[#d8e0ff] transition-colors"
              title="More entry options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full py-2 px-3 rounded-md bg-[#e3e7f0] hover:bg-[#4945ff] hover:text-white text-[#4a5568] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>

        {/* PREVIEW Card (Matches screenshot) */}
        <div className="space-y-2.5">
          <div className="text-[10.5px] font-bold text-[#8c9ba5] uppercase tracking-wider">
            PREVIEW
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-md border border-[#e3e7f0] hover:bg-[#f6f8fb] text-[#272b33] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Set up preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8c9ba5]" />
          </a>
        </div>

        {/* DATA BACKUP & RESET */}
        <div className="space-y-2.5 pt-2 border-t border-[#e3e7f0]">
          <div className="text-[10.5px] font-bold text-[#8c9ba5] uppercase tracking-wider">
            BACKUP & SYNC
          </div>
          <button
            type="button"
            onClick={exportCMSData}
            className="w-full py-1.5 px-3 rounded-md border border-[#e3e7f0] hover:bg-[#f6f8fb] text-[#4a5568] text-xs font-medium flex items-center justify-between"
          >
            <span>Export JSON</span>
            <Download className="w-3.5 h-3.5 text-[#8c9ba5]" />
          </button>

          <label className="w-full py-1.5 px-3 rounded-md border border-[#e3e7f0] hover:bg-[#f6f8fb] text-[#4a5568] text-xs font-medium flex items-center justify-between cursor-pointer">
            <span>Import JSON</span>
            <Upload className="w-3.5 h-3.5 text-[#8c9ba5]" />
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="w-full py-1.5 px-3 rounded-md hover:bg-red-50 text-red-600 text-xs font-medium flex items-center justify-between transition-colors"
          >
            <span>Reset Defaults</span>
            <RotateCcw className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </aside>

      {/* Options Dropdown Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-[#e3e7f0] w-80 p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
              <h4 className="text-xs font-bold text-[#272b33]">Entry Options</h4>
              <button
                type="button"
                onClick={() => setShowOptionsModal(false)}
                className="text-[#8c9ba5] hover:text-[#272b33]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  handlePublish();
                  setShowOptionsModal(false);
                }}
                className="w-full text-left p-2 rounded hover:bg-[#f0f3ff] text-[#4945ff] font-medium"
              >
                Publish immediately
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveDraft();
                  setShowOptionsModal(false);
                }}
                className="w-full text-left p-2 rounded hover:bg-[#f6f8fb] text-[#4a5568]"
              >
                Save as draft only
              </button>
              <button
                type="button"
                onClick={() => {
                  exportCMSData();
                  setShowOptionsModal(false);
                }}
                className="w-full text-left p-2 rounded hover:bg-[#f6f8fb] text-[#4a5568]"
              >
                Download entry backup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

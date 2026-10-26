import React, { Suspense, lazy, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { ScrollToTop } from './components/ScrollToTop';
import { Preloader } from './components/Preloader';
import { syncCMSFromServer } from './lib/cmsStore';
import './styles/index.css';

// Sync latest published content from backend on launch
syncCMSFromServer().catch(() => {});

// Resilience: Auto-recover from stale chunks when a new version is deployed on Vercel
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error: any) {
      console.warn('Dynamic chunk fetch failed. Refreshing bundle for latest assets...', error);
      const retryKey = 'chunk_retry_' + window.location.pathname;
      const alreadyRetried = sessionStorage.getItem(retryKey);
      if (!alreadyRetried) {
        sessionStorage.setItem(retryKey, 'true');
        window.location.reload();
        return new Promise(() => {});
      }
      sessionStorage.removeItem(retryKey);
      throw error;
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    window.location.reload();
  });
}

const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'));
const ServicesIndexPage = lazyWithRetry(() => import('./pages/ServicesIndexPage'));
const ServiceDetailPage = lazyWithRetry(() => import('./pages/ServiceDetailPage'));
const CaseStudiesIndexPage = lazyWithRetry(() => import('./pages/CaseStudiesIndexPage'));
const CaseStudyDetailPage = lazyWithRetry(() => import('./pages/CaseStudyDetailPage'));
const BlogsIndexPage = lazyWithRetry(() => import('./pages/BlogsIndexPage'));
const BlogPostDetailPage = lazyWithRetry(() => import('./pages/BlogPostDetailPage'));
const CareersLandingPage = lazyWithRetry(() => import('./pages/CareersLandingPage'));
const JobDetailPage = lazyWithRetry(() => import('./pages/JobDetailPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const AssistantPage = lazyWithRetry(() => import('./features/assistant/AssistantPage'));
const AdminPage = lazyWithRetry(() => import('./pages/AdminPage'));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage'));

// Lazy-load AXIA Assistant chatbot so it loads only after the home page is idle
const AssistantLauncher = lazy(() =>
  import('./features/assistant/AssistantLauncher').then((m) => ({ default: m.AssistantLauncher }))
);

const DeferredAssistantLauncher = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        () => setShouldLoad(true),
        { timeout: 3500 }
      );
      return () => {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
      };
    } else {
      const timer = setTimeout(() => setShouldLoad(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <AssistantLauncher />
    </Suspense>
  );
};

const RouteLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#05080e]">
    <div className="w-8 h-8 rounded-full border-2 border-[#0b192c] dark:border-white border-t-transparent animate-spin" />
  </div>
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Preloader />
      <ScrollToTop />
      <DeferredAssistantLauncher />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesIndexPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/case-studies" element={<CaseStudiesIndexPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="/blogs" element={<BlogsIndexPage />} />
          <Route path="/blogs/:slug" element={<BlogPostDetailPage />} />
          <Route path="/careers" element={<CareersLandingPage />} />
          <Route path="/careers/:slug" element={<JobDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
);

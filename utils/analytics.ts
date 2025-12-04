// Google Analytics 4 integration
// To use: Set VITE_GA_MEASUREMENT_ID in your .env file

import { env } from '../config/env';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = env.gaMeasurementId;

// Initialize GA4
export const initAnalytics = () => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false // We'll handle page views manually
  });
};

// Track page view
export const trackPageView = (path: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title
  });
};

// Track custom event
export const trackEvent = (
  eventName: string,
  eventParams?: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  }
) => {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    ...eventParams,
    event_category: eventParams?.category,
    event_label: eventParams?.label,
    value: eventParams?.value
  });
};

// Common event tracking functions
export const analytics = {
  // Button clicks
  trackButtonClick: (buttonName: string, location?: string) => {
    trackEvent('button_click', {
      category: 'engagement',
      label: buttonName,
      location: location || window.location.pathname
    });
  },

  // Form submissions
  trackFormSubmit: (formName: string, success: boolean) => {
    trackEvent('form_submit', {
      category: 'conversion',
      label: formName,
      success: success
    });
  },

  // Link clicks
  trackLinkClick: (linkText: string, destination: string) => {
    trackEvent('link_click', {
      category: 'navigation',
      label: linkText,
      destination: destination
    });
  },

  // Social shares
  trackSocialShare: (platform: string, contentType: string, contentId?: string) => {
    trackEvent('social_share', {
      category: 'social',
      label: platform,
      content_type: contentType,
      content_id: contentId
    });
  },

  // Search
  trackSearch: (searchTerm: string, resultsCount?: number) => {
    trackEvent('search', {
      category: 'engagement',
      label: searchTerm,
      results_count: resultsCount
    });
  },

  // Newsletter signup
  trackNewsletterSignup: (source: string) => {
    trackEvent('newsletter_signup', {
      category: 'conversion',
      label: source
    });
  },

  // Chat interactions
  trackChatInteraction: (action: string, messageCount?: number) => {
    trackEvent('chat_interaction', {
      category: 'engagement',
      label: action,
      message_count: messageCount
    });
  },

  // Content views
  trackContentView: (contentType: string, contentId: string, contentTitle?: string) => {
    trackEvent('content_view', {
      category: 'engagement',
      label: contentType,
      content_id: contentId,
      content_title: contentTitle
    });
  },

  // Conversion events
  trackConversion: (conversionType: string, value?: number) => {
    trackEvent('conversion', {
      category: 'conversion',
      label: conversionType,
      value: value
    });
  }
};


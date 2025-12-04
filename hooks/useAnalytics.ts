import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, initAnalytics } from '../utils/analytics';

// Initialize analytics on first load
if (typeof window !== 'undefined') {
  initAnalytics();
}

// Hook to track page views on route changes
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.hash);
  }, [location]);
};


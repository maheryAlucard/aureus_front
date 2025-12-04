/**
 * Environment variables configuration
 * All environment variables must be prefixed with VITE_ to be accessible in the browser
 */

export const env = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Gemini AI Configuration
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  
  // Google Analytics Configuration
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
} as const;


// Environment configuration for the application

export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'FanPit Platform',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  },

  // Razorpay Configuration
  razorpay: {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_RHCtm0tnz9yjuE',
  },

  // Feature Flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
    chat: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
  },

  // Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  },

  // Cache Configuration
  cache: {
    ttl: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'), // 5 minutes
    enabled: process.env.NEXT_PUBLIC_ENABLE_CACHE === 'true',
  },

  // Debug Configuration
  debug: {
    enabled: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'debug',
  },

  // Pagination Configuration
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  // Date/Time Configuration
  dateTime: {
    timezone: 'Asia/Kolkata',
    format: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
  },

  // Validation Configuration
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    phone: {
      pattern: /^[6-9]\d{9}$/,
      countryCode: '+91',
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },

  // UI Configuration
  ui: {
    theme: {
      default: 'light',
      options: ['light', 'dark', 'system'],
    },
    language: {
      default: 'en',
      options: ['en', 'hi'],
    },
    currency: {
      default: 'INR',
      symbol: '₹',
    },
  },

  // Security Configuration
  security: {
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // Performance Configuration
  performance: {
    debounceDelay: 300,
    throttleDelay: 1000,
    imageOptimization: true,
    lazyLoading: true,
  },
} as const;

// Type definitions for configuration
export type Config = typeof config;
export type ApiConfig = typeof config.api;
export type AppConfig = typeof config.app;
export type RazorpayConfig = typeof config.razorpay;
export type FeaturesConfig = typeof config.features;
export type UploadConfig = typeof config.upload;
export type CacheConfig = typeof config.cache;
export type DebugConfig = typeof config.debug;
export type PaginationConfig = typeof config.pagination;
export type DateTimeConfig = typeof config.dateTime;
export type ValidationConfig = typeof config.validation;
export type UIConfig = typeof config.ui;
export type SecurityConfig = typeof config.security;
export type PerformanceConfig = typeof config.performance;

// Helper functions
export const isDevelopment = () => config.app.environment === 'development';
export const isProduction = () => config.app.environment === 'production';
export const isStaging = () => config.app.environment === 'staging';

export const getApiUrl = (endpoint: string) => {
  const baseURL = config.api.baseURL.endsWith('/') 
    ? config.api.baseURL.slice(0, -1) 
    : config.api.baseURL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseURL}${cleanEndpoint}`;
};

export const getAssetUrl = (path: string) => {
  if (path.startsWith('http')) return path;
  const baseURL = isProduction() ? 'https://your-cdn-domain.com' : '';
  return `${baseURL}${path}`;
};

export const formatCurrency = (amount: number, currency = config.ui.currency.default) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string, format = config.dateTime.format) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatTime = (date: Date | string, format = config.dateTime.timeFormat) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const validateEmail = (email: string) => {
  return config.validation.email.pattern.test(email);
};

export const validatePhone = (phone: string) => {
  return config.validation.phone.pattern.test(phone);
};

export const validatePassword = (password: string) => {
  const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = config.validation.password;
  
  if (password.length < minLength) return false;
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  if (requireNumbers && !/\d/.test(password)) return false;
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  
  return true;
};

export default config;

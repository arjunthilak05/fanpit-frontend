
// TypeScript interfaces matching NestJS backend schemas

export enum UserRole {
  CONSUMER = 'consumer',
  BRAND_OWNER = 'brand_owner',
  STAFF = 'staff',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export interface Preferences {
  notifications: boolean;
  marketing: boolean;
  language: string;
  timezone: string;
  currency: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  trustedDevices: Date[];
  passwordHistory: string[];
  failedLoginAttempts: number;
  lockedUntil?: Date;
  lastPasswordChange?: Date;
  requirePasswordChange: boolean;
}

export interface Profile {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bio?: string;
  website?: string;
  socialLinks: string[];
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  completionPercentage: number;
}

export interface ActivityLog {
  action: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  metadata?: Record<string, any>;
}

export interface BusinessInfo {
  companyName?: string;
  businessType?: string;
  gstNumber?: string;
  panNumber?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  documents: string[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  organization?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  preferences: Preferences;
  profile: Profile;
  security: SecuritySettings;
  businessInfo?: BusinessInfo;
  activityLog: ActivityLog[];
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  totalBookings: number;
  totalSpending: number;
  loyaltyPoints: number;
  averageRating: number;
  reviewCount: number;
  badges: string[];
  referralCode?: string;
  referredBy?: string;
  referralCount: number;
  stripeCustomerId?: string;
  subscription?: string;
  subscriptionExpires?: Date;
  metadata?: Record<string, any>;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  fullName: string;
  isAccountLocked: boolean;
  isPremium: boolean;
  profileCompletionPercentage: number;
}

// Space interfaces
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PeakHours {
  start: string; // HH:mm format
  end: string; // HH:mm format
  multiplier: number;
}

export interface TimeBlock {
  duration: number; // in hours
  price: number;
  title: string;
}

export interface MonthlyPass {
  price: number;
  unlimited: boolean;
}

export interface SpecialEventPricing {
  date: Date;
  price: number;
}

export interface Pricing {
  basePrice: number;
  priceType: 'hourly' | 'daily' | 'free';
  peakHours?: PeakHours;
  offPeakMultiplier?: number;
  weekendMultiplier?: number;
  timeBlocks?: TimeBlock[];
  monthlyPass?: MonthlyPass;
  specialEventPricing?: SpecialEventPricing[];
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface OperatingHour {
  open: string; // HH:mm format
  close: string; // HH:mm format
  closed: boolean;
}

export interface Space {
  _id: string;
  name: string;
  description: string;
  address: Address;
  capacity: number;
  category: 'coworking' | 'event' | 'meeting' | 'casual';
  amenities: string[];
  images: string[];
  ownerId: string;
  pricing: Pricing;
  promoCodes: PromoCode[];
  operatingHours: {
    monday: OperatingHour;
    tuesday: OperatingHour;
    wednesday: OperatingHour;
    thursday: OperatingHour;
    friday: OperatingHour;
    saturday: OperatingHour;
    sunday: OperatingHour;
  };
  blackoutDates: Date[];
  rating: number;
  reviewCount: number;
  totalBookings: number;
  totalRevenue: number;
  viewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  fullAddress: string;
  isAvailable: boolean;
  occupancyRate: number;
  revenuePerBooking: number;
  ratingStars: string;
  isPopular: boolean;
  isNew: boolean;
  pricePerHourFormatted: string;
  pricePerDayFormatted: string;
  amenitiesList: string;
  hasHighRating: boolean;
  isFullyBooked: boolean;
}

// Booking interfaces
export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  eventPurpose?: string;
  specialRequests?: string;
  guestCount: number;
}

export interface Discount {
  type: 'promo' | 'peak-discount' | 'loyalty' | 'early-bird' | 'bulk';
  amount: number;
  description: string;
}

export interface PricingDetails {
  baseAmount: number;
  discounts: Discount[];
  taxes: number;
  totalAmount: number;
  promoCode?: string;
}

export interface PaymentInfo {
  orderId?: string;
  paymentId?: string;
  signature?: string;
  method?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
}

export interface Booking {
  _id: string;
  bookingCode: string;
  spaceId: string;
  customerId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  customerDetails: CustomerDetails;
  pricing: PricingDetails;
  payment: PaymentInfo;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  cancelledAt?: Date;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  cancellationReason?: string;
  refundAmount?: number;
  notes?: string;
  bufferTime: number;
  reminderSent: boolean;
  reminderSentAt?: Date;
  rating?: number;
  review?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  totalDuration: number;
  isUpcoming: boolean;
  isPast: boolean;
  isToday: boolean;
  canCancel: boolean;
  canModify: boolean;
  totalAmountFormatted: string;
  bookingDateTime: Date;
  endDateTime: Date;
  statusDisplay: string;
  isCompleted: boolean;
  isCancelled: boolean;
  durationFormatted: string;
  timeRange: string;
  totalDiscountAmount: number;
}

// Payment interfaces
export interface Payment {
  _id: string;
  bookingId: string;
  orderId: string;
  paymentId?: string;
  signature?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  method: string;
  gateway: 'razorpay' | 'stripe' | 'paypal';
  gatewayResponse?: Record<string, any>;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Staff Activity interfaces
export interface StaffActivity {
  _id: string;
  staffId: string;
  spaceId: string;
  bookingId?: string;
  action: 'check-in' | 'check-out' | 'no-show' | 'issue-report' | 'maintenance' | 'cleaning' | 'security-check';
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

// Auth interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Search and filter interfaces
export interface SpaceSearchFilters {
  query?: string;
  category?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  amenities?: string[];
  rating?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  date?: string;
  startTime?: string;
  endTime?: string;
  sortBy?: 'price' | 'rating' | 'distance' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BookingFilters {
  status?: string;
  spaceId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Form interfaces
export interface CreateSpaceRequest {
  name: string;
  description: string;
  address: Address;
  capacity: number;
  category: string;
  amenities: string[];
  pricing: Pricing;
  operatingHours: Space['operatingHours'];
  images?: File[];
}

export interface UpdateSpaceRequest extends Partial<CreateSpaceRequest> {
  _id: string;
}

export interface CreateBookingRequest {
  spaceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  customerDetails: CustomerDetails;
  promoCode?: string;
  specialRequests?: string;
}

export interface UpdateBookingRequest {
  bookingId: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  customerDetails?: Partial<CustomerDetails>;
  specialRequests?: string;
}

// Analytics interfaces
export interface SpaceAnalytics {
  spaceId: string;
  period: 'day' | 'week' | 'month' | 'year';
  bookings: {
    total: number;
    confirmed: number;
    cancelled: number;
    noShow: number;
  };
  revenue: {
    total: number;
    average: number;
    growth: number;
  };
  occupancy: {
    rate: number;
    peakHours: string[];
    lowHours: string[];
  };
  ratings: {
    average: number;
    count: number;
    distribution: Record<number, number>;
  };
  popularAmenities: Array<{
    amenity: string;
    count: number;
  }>;
}

export interface UserAnalytics {
  userId: string;
  period: 'day' | 'week' | 'month' | 'year';
  bookings: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  spending: {
    total: number;
    average: number;
    growth: number;
  };
  preferences: {
    topCategories: string[];
    topSpaces: string[];
    averageDuration: number;
  };
  loyalty: {
    points: number;
    tier: string;
    nextTierPoints: number;
  };
}

// Notification interfaces
export interface Notification {
  _id: string;
  userId: string;
  type: 'booking' | 'payment' | 'reminder' | 'promotion' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

// Review interfaces
export interface Review {
  _id: string;
  userId: string;
  spaceId: string;
  bookingId: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// Promo code interfaces
export interface PromoCodeRequest {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  minAmount?: number;
  maxDiscount?: number;
  applicableSpaces?: string[];
  applicableCategories?: string[];
}

export interface ValidatePromoCodeRequest {
  code: string;
  spaceId: string;
  amount: number;
}

export interface ValidatePromoCodeResponse {
  valid: boolean;
  discount: number;
  finalAmount: number;
  message?: string;
}

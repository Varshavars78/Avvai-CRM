
// Enums
export enum ClientStatus {
  LEAD = 'LEAD',
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED'
}

export enum BookingStatus {
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export type UserRole = 'admin' | 'artist' | 'individual';

export type Theme = 'light' | 'dark';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export type PlanTier = 'Free' | 'Basic' | 'Pro' | 'Unlimited';

export type MeetingType = 'Google Meet' | 'Zoom' | 'WhatsApp' | 'Phone' | 'In-Person';

// Interfaces
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  
  // Business Specific
  businessName?: string;
  category?: string;
  phone?: string;
  address?: string;
  website?: string;
  avatarUrl?: string;
  
  // Plan
  planId?: string;
  planName: string;
  planExpiry?: string;
}

// --- SHARED MODULES (Artist & Individual) ---

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  link?: string;
  startTime: string; // ISO
  endTime?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  url: string;
  sizeKB: number;
  type: string;
  uploadedAt: string;
}

// --- ARTIST MODULES ---

export interface FeatureFlags {
  crm_enabled: boolean;
  booking_enabled: boolean;
  bot_enabled: boolean;
  meetings_enabled: boolean;
  tasks_enabled: boolean;
  files_enabled: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  source: 'Bot' | 'Manual';
  createdAt: string;
  notes?: string;
  avatar?: string;
  description?: string;
  venue?: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  date: string; // ISO String
  time: string;
  venue?: string;
  notes?: string;
  status: BookingStatus;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string | number;
  name: string;
  msg: string;
  time: string;
  unread: boolean;
  status: string;
  email: string;
  phone: string;
}

// --- ADMIN TYPES ---

export interface Artist {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  status: 'Active' | 'Inactive';
  verificationStatus: VerificationStatus;
  plan: PlanTier;
  joinedDate: string;
  features: FeatureFlags;
  revenue: number;
  usage: any; // Simplified for brevity
}

export interface PlanConfig {
  id: string;
  name: string;
  roleType: 'artist' | 'individual';
  priceMonthly: number;
  limits: {
    storageMB: number;
    clients?: number;
    meetings?: number;
    bookings?: number;
    botMessages?: number;
  };
  features: FeatureFlags;
  active: boolean;
}

// --- SETTINGS INTERFACES ---

export interface Service {
  id: string;
  name: string;
  price: string;
  description?: string;
}

export interface BotConfig {
  welcomeMessage: string;
  commonQnA: { question: string; answer: string }[];
  pricingInfo: string;
  workHours: string;
  autoReplyStyle: 'Friendly' | 'Professional' | 'Short';
  botName: string;
  botColor: string;
}

export interface BookingConfig {
  workingDays: string[];
  timeSlotInterval: number;
  breakTimes: { start: string; end: string }[];
  advanceNotice: number;
  cancellationPolicy: string;
  paymentRule: 'Full' | 'Advance' | 'None';
  advanceAmount?: number;
}

export interface NotificationConfig {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
  newLeadAlert: boolean;
  bookingUpdateAlert: boolean;
  dailySummary: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  permissions: string[];
}

export interface Integration {
  id: string;
  name: string;
  type: 'Calendar' | 'Social' | 'Payment' | 'Communication';
  icon: string;
  connected: boolean;
}

export interface BrandingConfig {
  primaryColor: string;
  theme: 'Light' | 'Dark' | 'System';
  customDomain?: string;
  removeBranding: boolean;
}

export interface Addon {
  id: string;
  title: string;
  description: string;
  category: AddonCategory;
  price: string;
  isPremium: boolean;
  status: 'active' | 'inactive';
}

export type AddonCategory = 'Productivity' | 'AI' | 'CRM' | 'Booking' | 'Business' | 'Automation' | 'White-label';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  module: string;
}

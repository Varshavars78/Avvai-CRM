
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  UserProfile, FeatureFlags, Client, Booking, Conversation, Theme, Artist, VerificationStatus, PlanTier, Addon,
  Service, BotConfig, BookingConfig, NotificationConfig, TeamMember, Integration, BrandingConfig, PlanConfig, SystemLog,
  Meeting, Task, Note, FileItem
} from './types';
import { MOCK_CLIENTS, MOCK_BOOKINGS, DEFAULT_FEATURES, MOCK_ARTISTS, MOCK_ADDONS } from './constants';

interface AppState {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Features
  features: FeatureFlags;
  toggleFeature: (feature: keyof FeatureFlags) => void;

  // Addons
  addons: Addon[];
  toggleAddon: (id: string) => void;
  updateAddon: (id: string, data: Partial<Addon>) => void;

  // Data - CRM
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  removeClient: (id: string) => void;

  // Data - Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;

  // Data - Bot
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversationStatus: (id: string | number, status: string) => void;

  // Admin Data
  artists: Artist[];
  addArtist: (artist: Artist) => void;
  updateArtistStatus: (id: string, status: 'Active' | 'Inactive') => void;
  updateArtistFeatures: (id: string, features: FeatureFlags) => void;
  updateArtistVerification: (id: string, status: VerificationStatus) => void;
  updateArtistPlan: (id: string, plan: PlanTier) => void;

  planConfigs: PlanConfig[];
  updatePlanConfig: (id: string, data: Partial<PlanConfig>) => void;
  addPlan: (plan: PlanConfig) => void;

  systemLogs: SystemLog[];
  addSystemLog: (log: SystemLog) => void;

  // --- Settings State ---
  services: Service[];
  addService: (service: Service) => void;
  removeService: (id: string) => void;

  botConfig: BotConfig;
  updateBotConfig: (config: Partial<BotConfig>) => void;

  bookingConfig: BookingConfig;
  updateBookingConfig: (config: Partial<BookingConfig>) => void;

  notificationConfig: NotificationConfig;
  toggleNotification: (key: keyof NotificationConfig) => void;

  brandingConfig: BrandingConfig;
  updateBrandingConfig: (config: Partial<BrandingConfig>) => void;

  integrations: Integration[];
  toggleIntegration: (id: string) => void;

  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  removeTeamMember: (id: string) => void;

  // --- PRODUCTIVITY MODULES (Shared) ---
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  removeMeeting: (id: string) => void;

  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;

  notes: Note[];
  addNote: (note: Note) => void;
  removeNote: (id: string) => void;

  files: FileItem[];
  addFile: (file: FileItem) => void;
  removeFile: (id: string) => void;
}

// Helper to get initial theme
const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Initial Mock Data
const INITIAL_SERVICES: Service[] = [
  { id: 's1', name: 'Bridal Makeup', price: '$250', description: 'Full bridal package including hair.' },
  { id: 's2', name: 'Party Makeup', price: '$80', description: 'Light glam for events.' }
];

const INITIAL_BOT_CONFIG: BotConfig = {
  welcomeMessage: 'Hi! I can help you check availability and book an appointment.',
  commonQnA: [
    { question: 'Where are you located?', answer: 'We are located at 123 Main St, Downtown.' },
    { question: 'Do you travel?', answer: 'Yes, we travel for weddings!' }
  ],
  pricingInfo: 'Our packages start at $80.',
  workHours: 'Mon-Fri: 9AM - 6PM',
  autoReplyStyle: 'Friendly',
  botName: 'Avvai Assistant',
  botColor: '#00AEEF'
};

const INITIAL_BOOKING_CONFIG: BookingConfig = {
  workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  timeSlotInterval: 60,
  breakTimes: [{ start: '13:00', end: '14:00' }],
  advanceNotice: 24,
  cancellationPolicy: 'Free cancellation up to 48 hours before.',
  paymentRule: 'Advance',
  advanceAmount: 50
};

const INITIAL_NOTIFICATIONS: NotificationConfig = {
  whatsapp: true,
  email: true,
  sms: false,
  newLeadAlert: true,
  bookingUpdateAlert: true,
  dailySummary: false
};

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 'int1', name: 'WhatsApp', type: 'Communication', icon: 'MessageCircle', connected: false },
  { id: 'int2', name: 'Instagram', type: 'Social', icon: 'Instagram', connected: false },
  { id: 'int3', name: 'Stripe / Razorpay', type: 'Payment', icon: 'CreditCard', connected: false },
  { id: 'int4', name: 'Google Calendar', type: 'Calendar', icon: 'Calendar', connected: false },
];

const INITIAL_TEAM: TeamMember[] = [
  { id: 'tm1', name: 'Jessica', role: 'Assistant', email: 'jess@example.com', permissions: ['read_crm'] }
];

const INITIAL_PLANS: PlanConfig[] = [
  { id: 'p1', name: 'Free Tier', roleType: 'artist', priceMonthly: 0, limits: { bookings: 50, storageMB: 500 }, features: { crm_enabled: true, booking_enabled: false, bot_enabled: false, meetings_enabled: true, tasks_enabled: true, files_enabled: true }, active: true },
  { id: 'p2', name: 'Basic', roleType: 'artist', priceMonthly: 29, limits: { bookings: 200, storageMB: 2048 }, features: { crm_enabled: true, booking_enabled: true, bot_enabled: false, meetings_enabled: true, tasks_enabled: true, files_enabled: true }, active: true },
  { id: 'p3', name: 'Pro', roleType: 'artist', priceMonthly: 59, limits: { bookings: 1000, storageMB: 10240 }, features: { crm_enabled: true, booking_enabled: true, bot_enabled: true, meetings_enabled: true, tasks_enabled: true, files_enabled: true }, active: true },
  { id: 'p4', name: 'Unlimited', roleType: 'artist', priceMonthly: 99, limits: { bookings: 9999, storageMB: 51200 }, features: { crm_enabled: true, booking_enabled: true, bot_enabled: true, meetings_enabled: true, tasks_enabled: true, files_enabled: true }, active: true },
];

const INITIAL_LOGS: SystemLog[] = [
  { id: 'l1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), level: 'INFO', message: 'User login: art_1', module: 'Auth' },
  { id: 'l2', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), level: 'ERROR', message: 'Payment gateway timeout: tx_992', module: 'Billing' },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
    { id: 101, name: 'Priya Sharma', msg: 'What are your bridal charges?', time: '10m', unread: true, status: 'New Lead', email: 'priya@example.com', phone: '+91 98765 43210' },
    { id: 102, name: 'Anjali Desai', msg: 'Is Dec 12 available?', time: '1h', unread: false, status: 'Contacted', email: 'anjali@test.com', phone: '+91 99999 88888' },
];

// MOCK PRODUCTIVITY DATA
const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Update Portfolio', description: 'Upload recent wedding shoots to website', isCompleted: false, dueDate: '2023-11-20' },
  { id: 't2', title: 'Call John regarding invoice', isCompleted: true, dueDate: '2023-11-15' },
  { id: 't3', title: 'Buy new SD cards', isCompleted: false }
];

const INITIAL_MEETINGS: Meeting[] = [
  { id: 'm1', title: 'Client Consultation - Sarah', type: 'Zoom', startTime: new Date(Date.now() + 86400000).toISOString(), link: 'https://zoom.us/j/123456' },
  { id: 'm2', title: 'Team Sync', type: 'Google Meet', startTime: new Date(Date.now() + 172800000).toISOString(), link: 'https://meet.google.com/abc-def-ghi' }
];

const INITIAL_NOTES: Note[] = [
  { id: 'n1', title: 'Marketing Ideas', content: 'Run ads on Instagram for Diwali season.', updatedAt: new Date().toISOString(), category: 'Business' },
  { id: 'n2', title: 'Client Preferences', content: 'Priya prefers subtle makeup, no glitter.', updatedAt: new Date().toISOString(), category: 'Work' }
];

const INITIAL_FILES: FileItem[] = [
  { id: 'f1', name: 'Contract_Template.pdf', sizeKB: 250, type: 'PDF', url: '#', uploadedAt: new Date().toISOString() },
  { id: 'f2', name: 'Logo_HighRes.png', sizeKB: 1200, type: 'Image', url: '#', uploadedAt: new Date().toISOString() }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUserProfile: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),

      theme: getInitialTheme(),
      setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
      },

      features: DEFAULT_FEATURES,
      toggleFeature: (feature) => set((state) => ({
        features: { ...state.features, [feature]: !state.features[feature] }
      })),

      addons: MOCK_ADDONS,
      toggleAddon: (id) => set((state) => ({
        addons: state.addons.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a)
      })),
      updateAddon: (id, data) => set((state) => ({
        addons: state.addons.map(a => a.id === id ? { ...a, ...data } : a)
      })),
      addAddon: (addon) => set((state) => ({ addons: [...state.addons, addon] })),

      clients: MOCK_CLIENTS as Client[],
      addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, data) => set((state) => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      removeClient: (id) => set((state) => ({
        clients: state.clients.filter(c => c.id !== id)
      })),

      bookings: MOCK_BOOKINGS as Booking[],
      addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
      updateBooking: (id, data) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, ...data } : b)
      })),

      conversations: INITIAL_CONVERSATIONS,
      setConversations: (conversations) => set({ conversations }),
      addConversation: (conversation) => set((state) => ({ conversations: [conversation, ...state.conversations] })),
      updateConversationStatus: (id, status) => set((state) => ({
        conversations: state.conversations.map(c => c.id === id ? { ...c, status } : c)
      })),

      // Admin Actions
      artists: MOCK_ARTISTS as Artist[],
      addArtist: (artist) => set((state) => ({ artists: [...state.artists, artist] })),
      updateArtistStatus: (id, status) => set((state) => ({
        artists: state.artists.map(a => a.id === id ? { ...a, status } : a)
      })),
      updateArtistFeatures: (id, features) => set((state) => ({
        artists: state.artists.map(a => a.id === id ? { ...a, features } : a)
      })),
      updateArtistVerification: (id, status) => set((state) => ({
        artists: state.artists.map(a => a.id === id ? { ...a, verificationStatus: status } : a)
      })),
      updateArtistPlan: (id, plan) => set((state) => ({
        artists: state.artists.map(a => a.id === id ? { ...a, plan } : a)
      })),

      planConfigs: INITIAL_PLANS,
      updatePlanConfig: (id, data) => set((state) => ({
        planConfigs: state.planConfigs.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      addPlan: (plan) => set((state) => ({ planConfigs: [...state.planConfigs, plan] })),

      systemLogs: INITIAL_LOGS,
      addSystemLog: (log) => set((state) => ({ systemLogs: [log, ...state.systemLogs] })),

      // --- Settings Implementation ---
      services: INITIAL_SERVICES,
      addService: (service) => set((state) => ({ services: [...state.services, service] })),
      removeService: (id) => set((state) => ({ services: state.services.filter(s => s.id !== id) })),

      botConfig: INITIAL_BOT_CONFIG,
      updateBotConfig: (config) => set((state) => ({ botConfig: { ...state.botConfig, ...config } })),

      bookingConfig: INITIAL_BOOKING_CONFIG,
      updateBookingConfig: (config) => set((state) => ({ bookingConfig: { ...state.bookingConfig, ...config } })),

      notificationConfig: INITIAL_NOTIFICATIONS,
      toggleNotification: (key) => set((state) => ({ notificationConfig: { ...state.notificationConfig, [key]: !state.notificationConfig[key] } })),

      brandingConfig: { primaryColor: '#00AEEF', theme: 'System', removeBranding: false },
      updateBrandingConfig: (config) => set((state) => ({ brandingConfig: { ...state.brandingConfig, ...config } })),

      integrations: INITIAL_INTEGRATIONS,
      toggleIntegration: (id) => set((state) => ({
        integrations: state.integrations.map(i => i.id === id ? { ...i, connected: !i.connected } : i)
      })),

      teamMembers: INITIAL_TEAM,
      addTeamMember: (member) => set((state) => ({ teamMembers: [...state.teamMembers, member] })),
      removeTeamMember: (id) => set((state) => ({ teamMembers: state.teamMembers.filter(t => t.id !== id) })),

      // --- PRODUCTIVITY MODULES ---
      meetings: INITIAL_MEETINGS,
      addMeeting: (meeting) => set((state) => ({ meetings: [...state.meetings, meeting] })),
      removeMeeting: (id) => set((state) => ({ meetings: state.meetings.filter(m => m.id !== id) })),

      tasks: INITIAL_TASKS,
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
      toggleTask: (id) => set((state) => ({ 
        tasks: state.tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t) 
      })),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),

      notes: INITIAL_NOTES,
      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
      removeNote: (id) => set((state) => ({ notes: state.notes.filter(n => n.id !== id) })),

      files: INITIAL_FILES,
      addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
      removeFile: (id) => set((state) => ({ files: state.files.filter(f => f.id !== id) })),
    }),
    {
      name: 'avvai-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        // Persist user data
        clients: state.clients,
        bookings: state.bookings,
        conversations: state.conversations,
        meetings: state.meetings,
        tasks: state.tasks,
        notes: state.notes,
        files: state.files,
        // Persist Settings
        botConfig: state.botConfig,
        services: state.services
      }),
    }
  )
);

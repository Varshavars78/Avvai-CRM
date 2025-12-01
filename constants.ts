
import { Artist, Addon, Booking, Client } from "./types";

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1 555-0123',
    status: 'BOOKED' as any,
    source: 'Manual',
    createdAt: '2023-10-15T10:00:00Z',
    avatar: 'https://picsum.photos/100/100?random=1',
    venue: 'Grand Imperial Hotel',
    description: 'Bridal makeup for 2 days. Preferences: Natural look, allergic to latex.'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+1 555-0199',
    status: 'LEAD' as any,
    source: 'Bot',
    createdAt: '2023-11-02T14:30:00Z',
    avatar: 'https://picsum.photos/100/100?random=2',
    venue: '',
    description: 'Inquired about maternity shoot packages.'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '101',
    clientId: '1',
    clientName: 'Alice Johnson',
    date: new Date().toISOString(),
    time: '14:00',
    venue: 'Grand Imperial Hotel',
    status: 'UPCOMING' as any,
    notes: 'Consultation for web design'
  }
];

export const DEFAULT_FEATURES = {
  crm_enabled: true,
  booking_enabled: true,
  bot_enabled: true,
  meetings_enabled: true,
  tasks_enabled: true,
  files_enabled: true,
};

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'art_1',
    name: 'Sarah Jenkins',
    email: 'sarah@avvai.ai', // Updated to match auth demo
    phone: '+1 555 000 1111',
    businessName: 'Sarah J. Photography',
    category: 'Photography',
    status: 'Active',
    verificationStatus: 'Verified',
    plan: 'Pro',
    joinedDate: '2023-01-15',
    features: { crm_enabled: true, booking_enabled: true, bot_enabled: true, meetings_enabled: true, tasks_enabled: true, files_enabled: true },
    revenue: 12500,
    usage: {
      bookingsUsed: 45,
      bookingsLimit: 100,
      leadsGenerated: 120,
      botMessagesUsed: 2500,
      botMessagesLimit: 5000,
      storageUsedMB: 1024,
      storageLimitMB: 5120
    }
  },
  {
    id: 'art_2',
    name: 'Mike Ross',
    email: 'mike@suits.com',
    phone: '+1 555 000 2222',
    businessName: 'Ross Legal Consulting',
    category: 'Consulting',
    status: 'Inactive',
    verificationStatus: 'Pending',
    plan: 'Basic',
    joinedDate: '2023-03-20',
    features: { crm_enabled: true, booking_enabled: false, bot_enabled: false, meetings_enabled: true, tasks_enabled: true, files_enabled: true },
    revenue: 5200,
    usage: {
      bookingsUsed: 10,
      bookingsLimit: 20,
      leadsGenerated: 5,
      botMessagesUsed: 0,
      botMessagesLimit: 100,
      storageUsedMB: 50,
      storageLimitMB: 1024
    }
  },
  {
    id: 'art_3',
    name: 'Jessica Pearson',
    email: 'jessica@pearson.com',
    phone: '+1 555 000 3333',
    businessName: 'Pearson Styling',
    category: 'Fashion',
    status: 'Active',
    verificationStatus: 'Verified',
    plan: 'Unlimited',
    joinedDate: '2023-05-10',
    features: { crm_enabled: true, booking_enabled: true, bot_enabled: true, meetings_enabled: true, tasks_enabled: true, files_enabled: true },
    revenue: 25000,
    usage: {
      bookingsUsed: 150,
      bookingsLimit: 9999,
      leadsGenerated: 300,
      botMessagesUsed: 800,
      botMessagesLimit: 9999,
      storageUsedMB: 2048,
      storageLimitMB: 51200
    }
  }
];

export const MOCK_ADDONS: Addon[] = [
  { id: 'a1', title: 'WhatsApp Auto-Reply', description: 'Automated replies for WhatsApp Business API.', category: 'AI', price: '$15/mo', isPremium: true, status: 'inactive' },
  { id: 'a2', title: 'Staff Accounts', description: 'Add up to 5 staff members with role control.', category: 'Productivity', price: '$10/mo', isPremium: true, status: 'active' },
  { id: 'a3', title: 'Calendar Sync', description: 'Sync bookings with Google Calendar & Outlook.', category: 'Booking', price: '$5/mo', isPremium: false, status: 'inactive' },
  { id: 'a4', title: 'Portfolio Website', description: 'AI-generated portfolio website from your images.', category: 'AI', price: '$20/mo', isPremium: true, status: 'inactive' },
  { id: 'a5', title: 'Custom Domain', description: 'Use your own domain name for booking links.', category: 'White-label', price: '$12/mo', isPremium: true, status: 'inactive' },
  { id: 'a6', title: 'Invoicing Module', description: 'Generate GST invoices and track payments.', category: 'Business', price: '$8/mo', isPremium: false, status: 'active' },
  { id: 'a7', title: 'Smart Follow-ups', description: 'AI nudges for leads who stopped replying.', category: 'AI', price: '$12/mo', isPremium: true, status: 'inactive' },
  { id: 'a8', title: 'Remove Branding', description: 'Remove "Powered by Avvai" from all widgets.', category: 'White-label', price: '$25/mo', isPremium: true, status: 'inactive' }
];

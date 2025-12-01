
import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Badge, Modal } from '../components/UI';
import { 
  User, Briefcase, ToggleLeft, MessageSquare, Calendar, Bell, CreditCard, Globe, Link, Users, 
  Plus, Trash2, Save, Check, Shield, Edit2, Copy, Code, Instagram, MessageCircle, Smartphone
} from 'lucide-react';
import { Service, TeamMember, FeatureFlags } from '../types';

type SettingsTab = 'profile' | 'services' | 'features' | 'bot' | 'booking' | 'notifications' | 'billing' | 'branding' | 'integrations' | 'team';

export const SettingsPage: React.FC = () => {
  const { user, features, toggleFeature, updateUserProfile } = useStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Data from store
  const { 
    services, addService, removeService,
    botConfig, updateBotConfig,
    bookingConfig, updateBookingConfig,
    notificationConfig, toggleNotification,
    brandingConfig, updateBrandingConfig,
    integrations, toggleIntegration,
    teamMembers, addTeamMember, removeTeamMember
  } = useStore();

  // Local state for forms
  const [newService, setNewService] = useState<Partial<Service>>({ name: '', price: '' });
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  
  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({ name: '', email: '', role: 'Assistant' });
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newService.name && newService.price) {
      addService({ ...newService, id: Date.now().toString() } as Service);
      setNewService({ name: '', price: '' });
      setIsServiceModalOpen(false);
    }
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamMember.name && newTeamMember.email) {
      addTeamMember({ ...newTeamMember, id: Date.now().toString(), permissions: [] } as TeamMember);
      setNewTeamMember({ name: '', email: '', role: 'Assistant' });
      setIsTeamModalOpen(false);
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Business Profile', icon: User },
    { id: 'services', label: 'Service Details', icon: Briefcase },
    { id: 'features', label: 'Feature Control', icon: ToggleLeft },
    { id: 'bot', label: 'Chatbot Settings', icon: MessageSquare },
    { id: 'booking', label: 'Booking Settings', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
    { id: 'branding', label: 'Website & Branding', icon: Globe },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'team', label: 'Team Members', icon: Users },
  ];

  const getIntegrationIcon = (iconName: string) => {
    switch(iconName) {
        case 'Instagram': return <Instagram size={24} className="text-pink-600" />;
        case 'MessageCircle': return <MessageCircle size={24} className="text-green-500" />;
        case 'Calendar': return <Calendar size={24} className="text-blue-500" />;
        case 'CreditCard': return <CreditCard size={24} className="text-indigo-500" />;
        default: return <Link size={24} className="text-gray-500" />;
    }
  };

  // --- RENDER SECTIONS ---

  const renderProfile = () => (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark border-b border-border-light dark:border-border-dark pb-4">Business Profile</h2>
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-txt-secondary-light dark:text-txt-secondary-dark relative group cursor-pointer">
           {user?.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover" /> : <User size={32} />}
           <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <Edit2 className="text-white w-6 h-6" />
           </div>
        </div>
        <div>
          <Button variant="secondary" size="sm">Upload Logo</Button>
          <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-2">Recommended size: 500x500px</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Business Name</label>
          <input type="text" defaultValue={user?.businessName} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Owner Name</label>
          <input type="text" defaultValue={user?.name} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Phone Number</label>
          <input type="tel" defaultValue={user?.phone} placeholder="+1 234 567 890" className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Email Address</label>
          <input type="email" defaultValue={user?.email} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Business Address</label>
          <input type="text" defaultValue={user?.address} placeholder="123 Main St, City, Country" className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Category</label>
          <select defaultValue={user?.category} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark">
            <option>Makeup Artist</option>
            <option>Photographer</option>
            <option>Hair Stylist</option>
            <option>Mehendi Artist</option>
            <option>Nail Artist</option>
            <option>Tattoo Artist</option>
            <option>Videographer</option>
            <option>Choreographer</option>
            <option>Designer / Illustrator</option>
            <option>Content Creator</option>
            <option>Event Planner</option>
            <option>Decorator</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button><Save className="w-4 h-4 mr-2" /> Save Profile</Button>
      </div>
    </Card>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Service Details</h2>
        <Button onClick={() => setIsServiceModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
      </div>
      <div className="grid gap-4">
        {services.map(service => (
          <Card key={service.id} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark">{service.name}</h3>
              <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">{service.description}</p>
              <div className="flex gap-4 mt-1 text-xs font-medium text-primary-600 dark:text-primary-400">
                <span>{service.price}</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => removeService(service.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </Button>
          </Card>
        ))}
      </div>
      <Modal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} title="Add New Service">
        <form onSubmit={handleAddService} className="space-y-4">
          <input type="text" placeholder="Service Name" required className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark outline-none" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
          <div className="flex gap-4">
             <input type="text" placeholder="Price (e.g. $50)" required className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark outline-none" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
          </div>
          <textarea placeholder="Description" className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark outline-none" value={newService.description || ''} onChange={e => setNewService({...newService, description: e.target.value})} />
          <div className="flex justify-end gap-2 pt-2">
             <Button type="button" variant="secondary" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
             <Button type="submit">Add Service</Button>
          </div>
        </form>
      </Modal>
    </div>
  );

  const renderFeatures = () => (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark border-b border-border-light dark:border-border-dark pb-4">Feature Control</h2>
      <div className="space-y-4">
        {[
          { key: 'crm_enabled', label: 'CRM (Client Management)', desc: 'Manage leads, customers, and pipeline.' },
          { key: 'booking_enabled', label: 'Booking System', desc: 'Enable calendar, appointment scheduling.' },
          { key: 'bot_enabled', label: 'AI Inquiry Bot', desc: 'Automated chat responses for new leads.' },
          { key: 'meetings_enabled', label: 'Meetings & Calls', desc: 'Call and meeting scheduler.' },
          { key: 'tasks_enabled', label: 'Tasks & To-Do', desc: 'Manage daily tasks and checklists.' },
          { key: 'files_enabled', label: 'File Storage', desc: 'Upload and manage documents.' },
        ].map(f => (
          <div key={f.key} className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium text-txt-primary-light dark:text-txt-primary-dark">{f.label}</h4>
              <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">{f.desc}</p>
            </div>
            <button 
              onClick={() => toggleFeature(f.key as keyof FeatureFlags)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${features[f.key as keyof FeatureFlags] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${features[f.key as keyof FeatureFlags] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderBot = () => (
    <div className="space-y-6">
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark border-b border-border-light dark:border-border-dark pb-4">Chatbot Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Bot Name</label>
            <input type="text" value={botConfig.botName} onChange={e => updateBotConfig({ botName: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Welcome Message</label>
            <textarea rows={2} value={botConfig.welcomeMessage} onChange={e => updateBotConfig({ welcomeMessage: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Auto-Reply Style</label>
              <select value={botConfig.autoReplyStyle} onChange={e => updateBotConfig({ autoReplyStyle: e.target.value as any })} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark">
                <option>Friendly</option>
                <option>Professional</option>
                <option>Short</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Theme Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={botConfig.botColor} onChange={e => updateBotConfig({ botColor: e.target.value })} className="h-9 w-16 p-1 rounded border border-border-light dark:border-border-dark" />
                <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">{botConfig.botColor}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Work Hours info for Bot</label>
            <input type="text" value={botConfig.workHours} onChange={e => updateBotConfig({ workHours: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button><Save className="w-4 h-4 mr-2" /> Save Bot Settings</Button>
        </div>
      </Card>

      <Card className="p-6 bg-gray-50 dark:bg-white/5 border-dashed border-2 border-primary-200 dark:border-primary-900">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
                 <Code size={20} /> Website Integration
               </h3>
               <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-1">
                 Copy this code and paste it before the closing <code>&lt;/body&gt;</code> tag of your website to add the chat widget.
               </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => alert("Code copied!")}><Copy size={14} className="mr-2" /> Copy Code</Button>
         </div>
         <div className="bg-gray-800 text-gray-300 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            {`<script src="https://cdn.avvai.ai/widget.js" data-id="${user?.id || 'your-id'}"></script>`}
         </div>
      </Card>
    </div>
  );

  const renderBooking = () => (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark border-b border-border-light dark:border-border-dark pb-4">Booking Rules</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-txt-secondary-light dark:text-txt-secondary-dark">Working Days</label>
          <div className="flex flex-wrap gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <button 
                key={day}
                onClick={() => {
                    const days = bookingConfig.workingDays.includes(day) 
                        ? bookingConfig.workingDays.filter(d => d !== day)
                        : [...bookingConfig.workingDays, day];
                    updateBookingConfig({ workingDays: days });
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    bookingConfig.workingDays.includes(day) 
                    ? 'bg-primary-500 text-white border-primary-500' 
                    : 'bg-white dark:bg-[#333] border-border-light dark:border-border-dark text-txt-secondary-light dark:text-txt-secondary-dark'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Slot Interval (mins)</label>
             <input type="number" value={bookingConfig.timeSlotInterval} onChange={e => updateBookingConfig({ timeSlotInterval: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
           </div>
           <div>
             <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Advance Notice (hrs)</label>
             <input type="number" value={bookingConfig.advanceNotice} onChange={e => updateBookingConfig({ advanceNotice: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
           </div>
        </div>
        <div>
           <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Payment Rule</label>
           <select value={bookingConfig.paymentRule} onChange={e => updateBookingConfig({ paymentRule: e.target.value as any })} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark">
             <option value="None">No Advance Payment</option>
             <option value="Advance">Partial Advance</option>
             <option value="Full">Full Payment Required</option>
           </select>
        </div>
        {bookingConfig.paymentRule === 'Advance' && (
           <div>
             <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Advance Amount (%)</label>
             <input type="number" value={bookingConfig.advanceAmount} onChange={e => updateBookingConfig({ advanceAmount: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
           </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button><Save className="w-4 h-4 mr-2" /> Save Rules</Button>
      </div>
    </Card>
  );

  const renderNotifications = () => (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark border-b border-border-light dark:border-border-dark pb-4">Notification Preferences</h2>
      <div className="space-y-4">
        {[
          { key: 'whatsapp', label: 'WhatsApp Notifications' },
          { key: 'email', label: 'Email Notifications' },
          { key: 'sms', label: 'SMS Notifications' },
          { key: 'newLeadAlert', label: 'Alert on New Lead' },
          { key: 'bookingUpdateAlert', label: 'Alert on Booking Changes' },
          { key: 'dailySummary', label: 'Daily Activity Summary' },
        ].map(n => (
           <div key={n.key} className="flex items-center justify-between py-2">
             <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark">{n.label}</span>
             <button 
               onClick={() => toggleNotification(n.key as any)}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationConfig[n.key as keyof typeof notificationConfig] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
             >
               <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationConfig[n.key as keyof typeof notificationConfig] ? 'translate-x-6' : 'translate-x-1'}`} />
             </button>
           </div>
        ))}
      </div>
    </Card>
  );

  const renderBilling = () => (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark border-b border-border-light dark:border-border-dark pb-4">Plan & Billing</h2>
      
      <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-primary-900/30">
        <div className="flex justify-between items-start">
           <div>
             <p className="text-sm text-primary-600 dark:text-primary-400 font-bold uppercase mb-1">Current Plan</p>
             <h3 className="text-3xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Pro Plan</h3>
             <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark mt-2">Renews on Dec 12, 2023</p>
           </div>
           <Badge color="green">Active</Badge>
        </div>
        <div className="mt-6 flex gap-3">
           <Button>Upgrade Plan</Button>
           <Button variant="secondary">View Invoices</Button>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-txt-primary-light dark:text-txt-primary-dark mb-3">Included Features</h4>
        <ul className="grid grid-cols-2 gap-2 text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> CRM Module</li>
           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Booking System</li>
           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> AI Chatbot</li>
           <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1000 Bot Messages</li>
        </ul>
      </div>
    </Card>
  );

  const renderBranding = () => (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark border-b border-border-light dark:border-border-dark pb-4">Website & Branding</h2>
      <div className="space-y-4">
        <div>
           <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Brand Color</label>
           <div className="flex gap-2">
             {['#00AEEF', '#FF6B6B', '#3BCF5A', '#A855F7', '#F59E0B'].map(c => (
               <button 
                 key={c} 
                 onClick={() => updateBrandingConfig({ primaryColor: c })}
                 className={`w-8 h-8 rounded-full border-2 ${brandingConfig.primaryColor === c ? 'border-black dark:border-white' : 'border-transparent'}`}
                 style={{ backgroundColor: c }}
               />
             ))}
           </div>
        </div>
        <div>
           <label className="block text-sm font-medium mb-1 text-txt-secondary-light dark:text-txt-secondary-dark">Custom Domain</label>
           <div className="flex gap-2">
              <input type="text" placeholder="www.mybusiness.com" className="flex-1 px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" />
              <Button variant="secondary">Verify</Button>
           </div>
           <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-1">Requires Pro Plan or higher.</p>
        </div>
        <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium text-txt-primary-light dark:text-txt-primary-dark">Remove "Powered by Avvai"</h4>
              <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">Hide branding from chatbot and forms.</p>
            </div>
            <button 
              onClick={() => updateBrandingConfig({ removeBranding: !brandingConfig.removeBranding })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${brandingConfig.removeBranding ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${brandingConfig.removeBranding ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
      </div>
    </Card>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Integrations</h2>
      <div className="grid gap-4">
        {integrations.map(int => (
          <Card key={int.id} className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center">
                   {getIntegrationIcon(int.icon)}
                </div>
                <div>
                   <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark">{int.name}</h3>
                   <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">{int.type}</p>
                </div>
             </div>
             <Button 
               variant={int.connected ? 'outline' : 'primary'} 
               size="sm"
               onClick={() => toggleIntegration(int.id)}
             >
               {int.connected ? 'Disconnect' : 'Connect'}
             </Button>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Team Members</h2>
        <Button onClick={() => setIsTeamModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
      </div>
      <div className="grid gap-4">
        {teamMembers.map(member => (
           <Card key={member.id} className="p-4 flex justify-between items-center">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                 {member.name[0]}
               </div>
               <div>
                 <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark">{member.name}</h3>
                 <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">{member.role} • {member.email}</p>
               </div>
             </div>
             <Button variant="secondary" size="sm" onClick={() => removeTeamMember(member.id)} className="text-red-500 hover:text-red-700">Remove</Button>
           </Card>
        ))}
      </div>
      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddTeamMember} className="space-y-4">
          <input type="text" placeholder="Name" required className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark outline-none" value={newTeamMember.name} onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark outline-none" value={newTeamMember.email} onChange={e => setNewTeamMember({...newTeamMember, email: e.target.value})} />
          <select className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg text-txt-primary-light dark:text-txt-primary-dark outline-none" value={newTeamMember.role} onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})}>
            <option>Assistant</option>
            <option>Manager</option>
            <option>Staff</option>
          </select>
          <div className="flex justify-end gap-2 pt-2">
             <Button type="button" variant="secondary" onClick={() => setIsTeamModalOpen(false)}>Cancel</Button>
             <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* Settings Navigation Sidebar */}
      <Card className="w-full lg:w-64 flex-shrink-0 h-fit p-2">
         {tabs.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
               activeTab === tab.id 
                 ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                 : 'text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-gray-50 dark:hover:bg-white/5'
             }`}
           >
             <tab.icon size={18} />
             {tab.label}
           </button>
         ))}
      </Card>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'features' && renderFeatures()}
        {activeTab === 'bot' && renderBot()}
        {activeTab === 'booking' && renderBooking()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'branding' && renderBranding()}
        {activeTab === 'integrations' && renderIntegrations()}
        {activeTab === 'team' && renderTeam()}
      </div>
    </div>
  );
};

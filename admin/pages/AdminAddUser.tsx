
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/UI';
import { ArrowLeft, UserPlus, Mail, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../../store';
import { Artist, FeatureFlags, PlanTier } from '../../types';

export const AdminAddUser: React.FC = () => {
  const navigate = useNavigate();
  const { addArtist, artists } = useStore();
  const [mode, setMode] = useState<'manual' | 'invite'>('manual');
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    category: 'Makeup Artist',
    plan: 'Free' as PlanTier
  });

  // Feature State (Initialized with Free tier defaults)
  const [features, setFeatures] = useState<FeatureFlags>({
    crm_enabled: true,
    booking_enabled: false,
    bot_enabled: false,
    meetings_enabled: true,
    tasks_enabled: true,
    files_enabled: true
  });

  const handlePlanChange = (plan: PlanTier) => {
    setFormData({ ...formData, plan });
    // Update default features based on plan
    const defaults = {
        meetings_enabled: true,
        tasks_enabled: true,
        files_enabled: true
    };
    switch (plan) {
      case 'Free':
        setFeatures({ ...defaults, crm_enabled: true, booking_enabled: false, bot_enabled: false });
        break;
      case 'Basic':
        setFeatures({ ...defaults, crm_enabled: true, booking_enabled: true, bot_enabled: false });
        break;
      case 'Pro':
      case 'Unlimited':
        setFeatures({ ...defaults, crm_enabled: true, booking_enabled: true, bot_enabled: true });
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (mode === 'invite') {
      alert(`Invite sent to ${formData.email}`);
      navigate('/admin/artists');
      return;
    }

    // Validation: Check for existing email
    const emailExists = artists.some(a => a.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
        setError("An artist with this email address already exists.");
        return;
    }

    // Create Artist Object
    const newArtist: Artist = {
      id: `art_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      category: formData.category,
      status: 'Active',
      verificationStatus: 'Pending',
      plan: formData.plan,
      joinedDate: new Date().toISOString().split('T')[0],
      features: features,
      revenue: 0,
      usage: {
        bookingsUsed: 0,
        bookingsLimit: formData.plan === 'Free' ? 50 : formData.plan === 'Basic' ? 200 : 9999,
        leadsGenerated: 0,
        botMessagesUsed: 0,
        botMessagesLimit: formData.plan === 'Pro' || formData.plan === 'Unlimited' ? 1000 : 0,
        storageUsedMB: 0,
        storageLimitMB: 1024
      }
    };

    addArtist(newArtist);
    navigate('/admin/artists');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="secondary" onClick={() => navigate('/admin/artists')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Add New Artist</h1>
        <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Create a new user account or send an invitation.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setMode('manual')}
          className={`flex-1 py-3 rounded-lg border text-center font-medium transition-all ${mode === 'manual' ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600' : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-txt-secondary-light'}`}
        >
          <UserPlus className="w-5 h-5 mx-auto mb-1" />
          Manual Creation
        </button>
        <button 
          onClick={() => setMode('invite')}
          className={`flex-1 py-3 rounded-lg border text-center font-medium transition-all ${mode === 'invite' ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600' : 'bg-white dark:bg-card-dark border-border-light dark:border-border-dark text-txt-secondary-light'}`}
        >
          <Mail className="w-5 h-5 mx-auto mb-1" />
          Send Email Invite
        </button>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle size={16} /> {error}
              </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark focus:ring-2 focus:ring-primary-500"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {mode === 'manual' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark focus:ring-2 focus:ring-primary-500"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark focus:ring-2 focus:ring-primary-500"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Business Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark focus:ring-2 focus:ring-primary-500"
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Category</label>
                  <select 
                    className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark focus:ring-2 focus:ring-primary-500"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
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
              </>
            )}
          </div>

          {/* Plan Selection */}
          <div className="pt-6 border-t border-border-light dark:border-border-dark">
            <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Plan & Features</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-2">Assign Plan</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Free', 'Basic', 'Pro', 'Unlimited'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePlanChange(p as PlanTier)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      formData.plan === p 
                        ? 'bg-primary-500 text-white border-primary-500' 
                        : 'bg-white dark:bg-white/5 border-border-light dark:border-border-dark text-txt-primary-light dark:text-txt-primary-dark hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-border-light dark:border-border-dark">
              <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark mb-3">Enabled Modules</p>
              <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'crm_enabled', label: 'CRM System' },
                    { key: 'booking_enabled', label: 'Booking Calendar' },
                    { key: 'bot_enabled', label: 'AI Inquiry Bot' },
                    { key: 'meetings_enabled', label: 'Meetings & Calls' },
                    { key: 'tasks_enabled', label: 'Tasks & To-Do' },
                    { key: 'files_enabled', label: 'File Storage' },
                  ].map((f) => (
                    <label key={f.key} className="flex items-center gap-2 text-sm text-txt-secondary-light dark:text-txt-secondary-dark cursor-pointer">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${features[f.key as keyof FeatureFlags] ? 'bg-primary-500 border-primary-500' : 'border-gray-400'}`}>
                            {features[f.key as keyof FeatureFlags] && <Check size={12} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={features[f.key as keyof FeatureFlags]} onChange={() => setFeatures({...features, [f.key]: !features[f.key as keyof FeatureFlags]})} />
                        {f.label}
                    </label>
                  ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
             <Button type="button" variant="secondary" onClick={() => navigate('/admin/artists')}>Cancel</Button>
             <Button type="submit" size="lg">
               {mode === 'manual' ? 'Create User Account' : 'Send Invitation'}
             </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

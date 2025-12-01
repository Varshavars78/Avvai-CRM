
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { Card, Button, Badge } from '../../components/UI';
import { ArrowLeft, BarChart2, ShieldCheck, Smartphone } from 'lucide-react';
import { FeatureFlags, PlanTier } from '../../types';

export const AdminArtistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artists, updateArtistFeatures, updateArtistVerification, updateArtistPlan } = useStore();
  
  const artist = artists.find(a => a.id === id);

  if (!artist) {
    return <div className="p-8">Artist not found</div>;
  }

  const handleFeatureToggle = (key: keyof FeatureFlags) => {
    const newFeatures = { ...artist.features, [key]: !artist.features[key] };
    updateArtistFeatures(artist.id, newFeatures);
  };

  // Usage Bar Component
  const UsageBar = ({ label, used, limit }: { label: string, used: number, limit: number }) => {
    const percent = Math.min((used / limit) * 100, 100);
    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-txt-primary-light dark:text-txt-primary-dark">{label}</span>
                <span className="text-txt-secondary-light dark:text-txt-secondary-dark">{used} / {limit}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${percent > 90 ? 'bg-red-500' : 'bg-primary-500'}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button variant="secondary" onClick={() => navigate('/admin/artists')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Artists
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
              {artist.name}
              {artist.verificationStatus === 'Verified' && <ShieldCheck className="w-5 h-5 text-blue-500" />}
          </h1>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">{artist.businessName} • {artist.email}</p>
        </div>
        <div className="flex gap-3">
            <Badge color={artist.status === 'Active' ? 'green' : 'red'}>{artist.status}</Badge>
            <Badge color="purple">{artist.plan} Plan</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
             {/* KYC & Verification */}
             <Card className="p-6">
                <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">Verification & KYC</h3>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">Current Status</p>
                        <p className={`font-bold ${artist.verificationStatus === 'Verified' ? 'text-green-600' : artist.verificationStatus === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                            {artist.verificationStatus}
                        </p>
                    </div>
                    {artist.verificationStatus === 'Pending' && (
                        <div className="flex gap-2">
                             <Button size="sm" variant="danger" onClick={() => updateArtistVerification(artist.id, 'Rejected')}>Reject</Button>
                             <Button size="sm" onClick={() => updateArtistVerification(artist.id, 'Verified')}>Approve & Verify</Button>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded border border-border-light dark:border-border-dark">
                        <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Phone Verified</p>
                        <p className="font-medium flex items-center gap-2"><Smartphone size={14}/> {artist.phone || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded border border-border-light dark:border-border-dark">
                        <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Identity Document</p>
                        <a href="#" className="text-primary-500 hover:underline">View Uploaded ID</a>
                    </div>
                </div>
             </Card>

             {/* Usage Statistics */}
             <Card className="p-6">
                <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark flex items-center gap-2">
                    <BarChart2 size={20} />
                    Resource Usage
                </h3>
                <UsageBar label="Bookings Created" used={artist.usage.bookingsUsed} limit={artist.usage.bookingsLimit} />
                <UsageBar label="Leads Generated" used={artist.usage.leadsGenerated} limit={9999} />
                <UsageBar label="Bot Messages" used={artist.usage.botMessagesUsed} limit={artist.usage.botMessagesLimit} />
                <UsageBar label="Storage (MB)" used={artist.usage.storageUsedMB} limit={artist.usage.storageLimitMB} />
             </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
             {/* Plan Management */}
             <Card className="p-6">
                <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Subscription Plan</h3>
                <select 
                    className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-primary-500 outline-none mb-4 text-txt-primary-light dark:text-txt-primary-dark"
                    value={artist.plan}
                    onChange={(e) => updateArtistPlan(artist.id, e.target.value as PlanTier)}
                >
                    <option value="Free">Free</option>
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Unlimited">Unlimited</option>
                </select>
                <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
                    Changing the plan will automatically adjust limits and billing.
                </p>
                <Button variant="outline" className="w-full">Manage Billing</Button>
             </Card>

            {/* Feature Toggles */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Module Access</h3>
                <div className="space-y-4">
                    {[
                    { key: 'crm_enabled', label: 'CRM', desc: 'Client Management' },
                    { key: 'booking_enabled', label: 'Bookings', desc: 'Calendar System' },
                    { key: 'bot_enabled', label: 'AI Bot', desc: 'Automated Chat' },
                    { key: 'meetings_enabled', label: 'Meetings', desc: 'Calls & Conferencing' },
                    { key: 'tasks_enabled', label: 'Tasks', desc: 'To-Do List' },
                    { key: 'files_enabled', label: 'Files', desc: 'Storage Access' },
                    ].map((feature) => (
                    <div key={feature.key} className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-sm text-txt-primary-light dark:text-txt-primary-dark">{feature.label}</h4>
                            <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">{feature.desc}</p>
                        </div>
                        <button 
                            onClick={() => handleFeatureToggle(feature.key as keyof FeatureFlags)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                artist.features[feature.key as keyof FeatureFlags] ? 'bg-success' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                artist.features[feature.key as keyof FeatureFlags] ? 'translate-x-5' : 'translate-x-1'
                            }`} />
                        </button>
                    </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

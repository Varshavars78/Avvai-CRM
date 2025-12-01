import React from 'react';
import { Card } from '../../components/UI';
import { Users, Calendar, Bot, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { useStore } from '../../store';

export const AdminDashboard: React.FC = () => {
  const artists = useStore((state) => state.artists);
  const activeArtists = artists.filter(a => a.status === 'Active').length;
  const pendingVerifications = artists.filter(a => a.verificationStatus === 'Pending').length;
  
  // Mock revenue calc
  const totalRevenue = artists.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-green-600',
    },
    { 
      label: 'Active Artists', 
      value: activeArtists, 
      icon: Users, 
      color: 'bg-blue-600',
    },
    { 
      label: 'Pending KYC', 
      value: pendingVerifications, 
      icon: AlertCircle, 
      color: 'bg-yellow-500',
    },
    { 
      label: 'Total Bot Leads', 
      value: '4,392', 
      icon: Bot, 
      color: 'bg-indigo-600',
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">{stat.label}</p>
              <h2 className="text-3xl font-bold text-txt-primary-light dark:text-txt-primary-dark">{stat.value}</h2>
            </div>
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
              <stat.icon size={24} />
            </div>
          </Card>
        ))}
      </div>

      {/* Mock Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
            <TrendingUp size={20} /> Monthly Growth
          </h3>
          <select className="text-sm bg-transparent border border-border-light dark:border-border-dark rounded-lg px-2 py-1 text-txt-secondary-light dark:text-txt-secondary-dark">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        
        {/* Simple CSS Bar Chart Mockup */}
        <div className="h-64 flex items-end gap-4 justify-between px-2">
          {[40, 65, 45, 80, 55, 90, 100, 120, 110, 135, 150, 180].map((h, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-2 group">
              <div 
                className="w-full bg-primary-200 dark:bg-primary-900/30 rounded-t-lg relative transition-all duration-500 group-hover:bg-primary-500"
                style={{ height: `${Math.min(h / 2, 100)}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded z-10">
                  ${h * 100}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-2 px-2">
            <span>Jan</span><span>Dec</span>
        </div>
      </Card>
    </div>
  );
};
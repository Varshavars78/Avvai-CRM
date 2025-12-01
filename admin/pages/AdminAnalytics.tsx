import React from 'react';
import { Card } from '../../components/UI';
import { useStore } from '../../store';
import { Trophy, Zap, MessageSquare } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { artists } = useStore();

  // Sort artists by revenue for leaderboard
  const topArtists = [...artists].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">System Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trend */}
        <Card className="p-6">
          <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Total Bookings (System-wide)</h3>
          <div className="h-64 flex items-end gap-2">
             {[30, 45, 60, 50, 80, 95, 70, 65, 55, 85, 90, 100].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-200 dark:bg-blue-900/30 rounded-t hover:bg-blue-500 transition-colors relative group" style={{height: `${h}%`}}>
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs p-1 rounded">{h * 10}</div>
               </div>
             ))}
          </div>
          <div className="flex justify-between text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-2">
            <span>Jan</span><span>Dec</span>
          </div>
        </Card>

        {/* AI Usage */}
        <Card className="p-6">
          <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" /> AI Bot Consumption
          </h3>
           <div className="flex h-64 items-center justify-center gap-8">
             {/* Mock Ring Chart */}
             <div className="relative w-40 h-40">
                 <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path className="text-purple-500" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                     <span className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">75%</span>
                     <span className="text-[10px] text-txt-secondary-light dark:text-txt-secondary-dark">Quota Used</span>
                 </div>
             </div>
             <div className="space-y-4">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600">
                         <MessageSquare size={16} />
                     </div>
                     <div>
                         <p className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark">45.2k</p>
                         <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Total Messages</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600">
                         <Zap size={16} />
                     </div>
                     <div>
                         <p className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark">$0.004</p>
                         <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Avg Cost/Msg</p>
                     </div>
                 </div>
             </div>
           </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/10 dark:to-[#262626]">
          <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Artist Leaderboard
          </h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-white/5 text-txt-secondary-light dark:text-txt-secondary-dark">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Artist</th>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Bot Usage</th>
              <th className="px-6 py-3">Revenue Generated</th>
            </tr>
          </thead>
          <tbody className="text-txt-primary-light dark:text-txt-primary-dark">
            {topArtists.map((artist, idx) => (
                <tr key={artist.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4 font-bold">#{idx + 1}</td>
                    <td className="px-6 py-4 font-medium">{artist.businessName}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">{artist.plan}</span></td>
                    <td className="px-6 py-4">{artist.usage.botMessagesUsed.toLocaleString()}</td>
                    <td className="px-6 py-4 text-success font-bold">${artist.revenue.toLocaleString()}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
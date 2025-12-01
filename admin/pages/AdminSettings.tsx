
import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { useStore } from '../../store';
import { Activity, Archive, AlertCircle, Check } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'global' | 'addons' | 'logs'>('global');
  const { addons, updateAddon, systemLogs } = useStore();

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex gap-4 border-b border-border-light dark:border-border-dark">
          <button onClick={() => setActiveSection('global')} className={`pb-2 px-4 font-medium transition-colors ${activeSection === 'global' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-txt-secondary-light dark:text-txt-secondary-dark'}`}>Global Config</button>
          <button onClick={() => setActiveSection('addons')} className={`pb-2 px-4 font-medium transition-colors ${activeSection === 'addons' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-txt-secondary-light dark:text-txt-secondary-dark'}`}>Add-ons Manager</button>
          <button onClick={() => setActiveSection('logs')} className={`pb-2 px-4 font-medium transition-colors ${activeSection === 'logs' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-txt-secondary-light dark:text-txt-secondary-dark'}`}>System Health</button>
      </div>

      {activeSection === 'global' && (
        <>
            <Card className="p-6">
                <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Platform Limits</h3>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Max Bookings Per Month (Free Tier)</label>
                    <input type="number" defaultValue={50} className="w-full max-w-xs px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Bot Message Limit Per Day</label>
                    <input type="number" defaultValue={500} className="w-full max-w-xs px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark focus:ring-2 focus:ring-primary-500" />
                </div>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">Default Feature Configuration</h3>
                <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark mb-4">New artists will have these features enabled by default.</p>
                <div className="space-y-2">
                <label className="flex items-center gap-2 text-txt-primary-light dark:text-txt-primary-dark">
                    <input type="checkbox" defaultChecked className="accent-primary-500 w-4 h-4" /> CRM Module
                </label>
                <label className="flex items-center gap-2 text-txt-primary-light dark:text-txt-primary-dark">
                    <input type="checkbox" defaultChecked className="accent-primary-500 w-4 h-4" /> Booking System
                </label>
                <label className="flex items-center gap-2 text-txt-primary-light dark:text-txt-primary-dark">
                    <input type="checkbox" className="accent-primary-500 w-4 h-4" /> AI Bot (Pro only)
                </label>
                </div>
            </Card>
            <div className="flex justify-end">
                <Button size="lg">Save System Settings</Button>
            </div>
        </>
      )}

      {activeSection === 'addons' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {addons.map(addon => (
                 <Card key={addon.id} className="p-4 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-2">
                            <Badge color="blue">{addon.category}</Badge>
                            <span className="text-xs font-bold text-txt-primary-light dark:text-txt-primary-dark">{addon.price}</span>
                        </div>
                        <h4 className="font-bold text-txt-primary-light dark:text-txt-primary-dark">{addon.title}</h4>
                        <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mb-4">{addon.description}</p>
                     </div>
                     <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center">
                         <span className={`text-xs font-medium ${addon.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}>
                             {addon.status === 'active' ? 'Available' : 'Disabled'}
                         </span>
                         <Button size="sm" variant="outline" onClick={() => updateAddon(addon.id, { status: addon.status === 'active' ? 'inactive' : 'active' })}>
                             Toggle
                         </Button>
                     </div>
                 </Card>
             ))}
         </div>
      )}

      {activeSection === 'logs' && (
          <Card className="overflow-hidden">
              <div className="p-4 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-white/5">
                  <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
                      <Activity size={18} /> System Activity Logs
                  </h3>
              </div>
              <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-white/5 text-txt-secondary-light dark:text-txt-secondary-dark">
                      <tr>
                          <th className="px-6 py-3">Timestamp</th>
                          <th className="px-6 py-3">Module</th>
                          <th className="px-6 py-3">Level</th>
                          <th className="px-6 py-3">Message</th>
                      </tr>
                  </thead>
                  <tbody className="text-txt-primary-light dark:text-txt-primary-dark divide-y divide-border-light dark:divide-border-dark">
                      {systemLogs.map(log => (
                          <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                              <td className="px-6 py-3 text-txt-secondary-light dark:text-txt-secondary-dark font-mono text-xs">
                                  {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="px-6 py-3">{log.module}</td>
                              <td className="px-6 py-3">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                      log.level === 'ERROR' ? 'bg-red-100 text-red-600' :
                                      log.level === 'WARN' ? 'bg-yellow-100 text-yellow-600' :
                                      'bg-blue-100 text-blue-600'
                                  }`}>
                                      {log.level}
                                  </span>
                              </td>
                              <td className="px-6 py-3">{log.message}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </Card>
      )}
    </div>
  );
};

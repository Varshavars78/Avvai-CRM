import React from 'react';
import { Card, Button } from '../../components/UI';
import { MessageSquare, Bell, Send, User } from 'lucide-react';

export const AdminSupport: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Support & Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification Manager */}
          <div className="lg:col-span-2">
              <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light dark:border-border-dark">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
                          <Bell size={20} />
                      </div>
                      <div>
                          <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark">Broadcast Notification</h3>
                          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">Send announcements to all artists</p>
                      </div>
                  </div>
                  <form className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Subject</label>
                          <input type="text" className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" placeholder="e.g., Scheduled Maintenance" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark mb-1">Message Body</label>
                          <textarea rows={4} className="w-full px-3 py-2 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg outline-none text-txt-primary-light dark:text-txt-primary-dark" placeholder="Type your announcement here..." />
                      </div>
                      <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm text-txt-primary-light dark:text-txt-primary-dark">
                              <input type="checkbox" className="w-4 h-4 accent-primary-500" /> Send via Email
                          </label>
                          <label className="flex items-center gap-2 text-sm text-txt-primary-light dark:text-txt-primary-dark">
                              <input type="checkbox" className="w-4 h-4 accent-primary-500" /> Send In-App
                          </label>
                      </div>
                      <div className="flex justify-end">
                          <Button>
                              <Send className="w-4 h-4 mr-2" /> Send Broadcast
                          </Button>
                      </div>
                  </form>
              </Card>
          </div>

          {/* Support Tickets */}
          <div>
              <Card className="h-full flex flex-col">
                  <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                      <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark flex items-center gap-2">
                          <MessageSquare size={18} /> Recent Tickets
                      </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {[1, 2, 3, 4].map(i => (
                          <div key={i} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer border border-transparent hover:border-border-light dark:hover:border-border-dark transition-colors">
                              <div className="flex justify-between mb-1">
                                  <span className="text-xs font-bold text-txt-primary-light dark:text-txt-primary-dark">Ticket #20{i}</span>
                                  <span className="text-[10px] text-txt-secondary-light dark:text-txt-secondary-dark">2h ago</span>
                              </div>
                              <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark mb-1">Billing Issue</p>
                              <div className="flex items-center gap-2 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                                  <User size={12} /> Mike Ross
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="p-4 border-t border-border-light dark:border-border-dark">
                      <Button variant="outline" className="w-full text-xs">View Helpdesk</Button>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};
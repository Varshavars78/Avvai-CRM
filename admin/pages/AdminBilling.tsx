
import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/UI';
import { CreditCard, Download, TrendingUp, DollarSign, Edit2, CheckCircle } from 'lucide-react';
import { useStore } from '../../store';
import { PlanTier } from '../../types';

export const AdminBilling: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'plans'>('transactions');
  const { planConfigs, updatePlanConfig } = useStore();

  const transactions = [
    { id: 'TX-101', artist: 'Sarah J. Photography', plan: 'Pro Plan', amount: 49.99, date: '2023-11-01', status: 'Paid' },
    { id: 'TX-102', artist: 'Ross Legal Consulting', plan: 'Basic Plan', amount: 19.99, date: '2023-11-02', status: 'Paid' },
    { id: 'TX-103', artist: 'Pearson Styling', plan: 'Unlimited', amount: 99.99, date: '2023-11-03', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Billing & Plans</h1>
        <Button variant="secondary" onClick={() => setActiveTab(activeTab === 'transactions' ? 'plans' : 'transactions')}>
            {activeTab === 'transactions' ? 'Manage Plans' : 'View Transactions'}
        </Button>
      </div>

      {activeTab === 'transactions' ? (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
                    <p className="opacity-80 text-sm mb-1">Monthly Recurring Revenue (MRR)</p>
                    <h2 className="text-3xl font-bold mb-4">$12,450</h2>
                    <div className="flex items-center text-sm bg-white/20 w-fit px-2 py-1 rounded">
                        <TrendingUp className="w-4 h-4 mr-1" /> +12.5% vs last month
                    </div>
                </Card>
                <Card className="p-6">
                    <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm mb-1">Active Subscriptions</p>
                    <h2 className="text-3xl font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">842</h2>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[80%]"></div>
                    </div>
                    <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-2">80% Paid Users</p>
                </Card>
                <Card className="p-6">
                    <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-sm mb-1">Churn Rate</p>
                    <h2 className="text-3xl font-bold text-txt-primary-light dark:text-txt-primary-dark mb-4">2.1%</h2>
                    <p className="text-xs text-green-500">Low churn this month</p>
                </Card>
            </div>

            <Card>
                <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                    <h3 className="font-bold text-txt-primary-light dark:text-txt-primary-dark">Recent Transactions</h3>
                    <Button variant="secondary" size="sm">View All</Button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-white/5 text-txt-secondary-light dark:text-txt-secondary-dark">
                        <tr>
                            <th className="px-6 py-3">Invoice ID</th>
                            <th className="px-6 py-3">Artist</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-txt-primary-light dark:text-txt-primary-dark">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5">
                                <td className="px-6 py-4 font-mono text-xs">{tx.id}</td>
                                <td className="px-6 py-4 font-medium">{tx.artist}</td>
                                <td className="px-6 py-4">{tx.plan}</td>
                                <td className="px-6 py-4 text-txt-secondary-light dark:text-txt-secondary-dark">{tx.date}</td>
                                <td className="px-6 py-4 font-bold">${tx.amount}</td>
                                <td className="px-6 py-4">
                                    <Badge color={tx.status === 'Paid' ? 'green' : 'yellow'}>{tx.status}</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-primary-500 hover:underline">Download</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planConfigs.map(plan => (
                <Card key={plan.id} className="p-6 flex flex-col relative overflow-hidden">
                    {plan.active && <div className="absolute top-0 right-0 bg-green-500 w-16 h-16 transform rotate-45 translate-x-8 -translate-y-8"></div>}
                    <h3 className="text-xl font-bold text-txt-primary-light dark:text-txt-primary-dark">{plan.name}</h3>
                    <div className="my-4 flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-txt-primary-light dark:text-txt-primary-dark">${plan.priceMonthly}</span>
                        <span className="text-txt-secondary-light dark:text-txt-secondary-dark">/mo</span>
                    </div>
                    
                    <div className="space-y-3 flex-1 mb-6">
                         <div className="text-sm border-b border-border-light dark:border-border-dark pb-2">
                            <span className="text-txt-secondary-light dark:text-txt-secondary-dark">Bookings: </span>
                            <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark float-right">{plan.limits.bookings}</span>
                         </div>
                         <div className="text-sm border-b border-border-light dark:border-border-dark pb-2">
                            <span className="text-txt-secondary-light dark:text-txt-secondary-dark">Bot Msgs: </span>
                            <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark float-right">{plan.limits.botMessages}</span>
                         </div>
                         <div className="text-sm border-b border-border-light dark:border-border-dark pb-2">
                            <span className="text-txt-secondary-light dark:text-txt-secondary-dark">Storage: </span>
                            <span className="font-medium text-txt-primary-light dark:text-txt-primary-dark float-right">{plan.limits.storageMB} MB</span>
                         </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                             <input 
                                type="number" 
                                className="w-20 px-2 py-1 border rounded text-sm dark:bg-[#333] dark:border-border-dark text-txt-primary-light dark:text-txt-primary-dark" 
                                defaultValue={plan.priceMonthly}
                                onBlur={(e) => updatePlanConfig(plan.id, { priceMonthly: parseFloat(e.target.value) })}
                             />
                             <span className="text-xs flex items-center text-txt-secondary-light dark:text-txt-secondary-dark">Set Price</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">Edit Limits</Button>
                    </div>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
};

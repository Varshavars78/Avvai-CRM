
import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Badge } from '../components/UI';
import { ShoppingBag, Check, Zap, Star, Briefcase, Clock, Layout, Globe } from 'lucide-react';
import { AddonCategory } from '../types';

export const AddonsMarketplace: React.FC = () => {
  const { addons, toggleAddon } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<AddonCategory | 'All'>('All');

  const categories: AddonCategory[] = ['Productivity', 'AI', 'CRM', 'Booking', 'Business', 'Automation', 'White-label'];

  const filteredAddons = selectedCategory === 'All' 
    ? addons 
    : addons.filter(a => a.category === selectedCategory);

  const getCategoryIcon = (cat: AddonCategory) => {
    switch(cat) {
        case 'AI': return <Zap className="w-4 h-4" />;
        case 'Productivity': return <Clock className="w-4 h-4" />;
        case 'CRM': return <Star className="w-4 h-4" />;
        case 'Booking': return <Briefcase className="w-4 h-4" />;
        case 'Business': return <ShoppingBag className="w-4 h-4" />;
        case 'White-label': return <Globe className="w-4 h-4" />;
        default: return <Layout className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">Add-ons Marketplace</h1>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Supercharge your business with premium tools and features.</p>
        </div>
        <div className="flex items-center gap-2 bg-card-light dark:bg-card-dark p-1 rounded-lg border border-border-light dark:border-border-dark">
             <Button size="sm" variant="secondary">My Add-ons</Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-[#333] text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 border border-border-light dark:border-border-dark'
          }`}
        >
          All Items
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === cat
                ? 'bg-primary-500 text-white'
                : 'bg-white dark:bg-[#333] text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 border border-border-light dark:border-border-dark'
            }`}
          >
            {getCategoryIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAddons.map((addon) => (
          <Card key={addon.id} className="p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${
                    addon.category === 'AI' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                    addon.category === 'Productivity' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                    {getCategoryIcon(addon.category)}
                </div>
                {addon.status === 'active' && (
                    <Badge color="green">Active</Badge>
                )}
            </div>
            
            <h3 className="text-lg font-bold text-txt-primary-light dark:text-txt-primary-dark mb-2 line-clamp-1">{addon.title}</h3>
            <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark mb-4 flex-1">{addon.description}</p>
            
            <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Price</span>
                    <span className="font-bold text-txt-primary-light dark:text-txt-primary-dark">{addon.price}</span>
                </div>
                <Button 
                    className="w-full" 
                    variant={addon.status === 'active' ? 'secondary' : 'primary'}
                    onClick={() => toggleAddon(addon.id)}
                >
                    {addon.status === 'active' ? (
                        <span className="flex items-center gap-2"><Check size={16} /> Deactivate</span>
                    ) : (
                        addon.isPremium ? 'Upgrade to Unlock' : 'Activate Free'
                    )}
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

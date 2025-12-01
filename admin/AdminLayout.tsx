
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Sun,
  Moon,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../store';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const logout = useStore((state) => state.logout);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const user = useStore((state) => state.user);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Artists', path: '/admin/artists' },
    { icon: BarChart, label: 'Analytics', path: '/admin/analytics' },
    { icon: CreditCard, label: 'Billing & Plans', path: '/admin/billing' },
    { icon: MessageSquare, label: 'Support Center', path: '/admin/support' },
    { icon: Settings, label: 'Global Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-bg-light dark:bg-bg-dark text-txt-primary-light dark:text-txt-primary-dark overflow-hidden transition-colors duration-200">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={clsx(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r transform transition-all duration-200 ease-in-out lg:transform-none",
        "bg-[#1e293b] text-white border-gray-700", // Dark sidebar for Admin distinct look
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700 bg-[#0f172a]">
          <span className="text-xl font-bold text-primary-400 flex items-center gap-2">
             <Shield className="w-6 h-6" />
             Avvai Admin
          </span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-64px)] justify-between">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary-600 text-white" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 bg-[#0f172a]">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-400 rounded-lg hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-100 dark:bg-[#0a0a0a] transition-colors duration-200">
        {/* Top Header */}
        <header className="bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark h-16 flex items-center justify-between px-4 lg:px-8 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-txt-secondary-light dark:text-txt-secondary-dark"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-medium text-txt-secondary-light dark:text-txt-secondary-dark">Administrator Panel</h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-primary-500 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border-light dark:border-border-dark">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">Admin User</p>
                <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">Super Admin</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bot, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Search,
  Bell,
  Sun,
  Moon,
  Package,
  Video,
  CheckSquare,
  FileText,
  Folder
} from 'lucide-react';
import { useStore } from '../store';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const features = useStore((state) => state.features);
  const logout = useStore((state) => state.logout);
  const user = useStore((state) => state.user);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // DYNAMIC MENU based on Role
  const getNavItems = () => {
    const common = [
       { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', enabled: true },
    ];

    const artistItems = [
       { icon: Users, label: 'Clients (CRM)', path: '/crm', enabled: features.crm_enabled },
       { icon: Calendar, label: 'Bookings', path: '/bookings', enabled: features.booking_enabled },
       { icon: Bot, label: 'AI Assistant', path: '/bot', enabled: features.bot_enabled },
       { icon: Video, label: 'Meetings', path: '/meetings', enabled: true },
       { icon: CheckSquare, label: 'Tasks', path: '/tasks', enabled: true },
       { icon: FileText, label: 'Notes', path: '/notes', enabled: true },
       { icon: Folder, label: 'Files', path: '/files', enabled: true },
       { icon: Package, label: 'Add-ons', path: '/addons', enabled: true },
    ];

    const individualItems = [
       { icon: Video, label: 'Meetings', path: '/meetings', enabled: true },
       { icon: CheckSquare, label: 'Tasks', path: '/tasks', enabled: true },
       { icon: FileText, label: 'Notes', path: '/notes', enabled: true },
       { icon: Folder, label: 'Files', path: '/files', enabled: true },
    ];

    const settings = [
       { icon: Settings, label: 'Settings', path: '/settings', enabled: true },
    ];

    if (user?.role === 'individual') {
        return [...common, ...individualItems, ...settings];
    } else {
        // Default to Artist if not individual (or 'user' legacy role)
        return [...common, ...artistItems, ...settings];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-bg-light dark:bg-bg-dark text-txt-primary-light dark:text-txt-primary-dark overflow-hidden transition-colors duration-200">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r transform transition-all duration-200 ease-in-out lg:transform-none",
        "bg-sidebar-light border-border-light dark:bg-sidebar-dark dark:border-border-dark",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border-light dark:border-border-dark">
          <span className="text-xl font-bold text-primary-500 flex items-center gap-2">
             <Bot className="w-6 h-6" />
             Avvai
          </span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-64px)] justify-between">
          <nav className="p-4 space-y-1 overflow-y-auto">
            {navItems.filter(item => item.enabled).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-500" 
                    : "text-txt-secondary-light dark:text-txt-secondary-dark hover:bg-gray-100 dark:hover:bg-white/5 hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-danger rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-bg-light dark:bg-bg-dark transition-colors duration-200">
        {/* Top Header */}
        <header className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark h-16 flex items-center justify-between px-4 lg:px-8 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#333] border border-border-light dark:border-border-dark rounded-full text-sm text-txt-primary-light dark:text-txt-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-primary-500 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button className="relative p-2 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-white dark:border-card-dark"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border-light dark:border-border-dark">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark capitalize">{user?.role === 'artist' ? user.businessName : 'Individual Account'}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                {user?.name?.[0] || 'U'}
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

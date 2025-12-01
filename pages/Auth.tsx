
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Button } from '../components/UI';
import { Bot, Mail, Lock } from 'lucide-react';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('sarah@avvai.ai');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const artists = useStore((state) => state.artists); // Access the artist database

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Check for Admin
    if (email.toLowerCase().includes('admin')) {
        setTimeout(() => {
            login({
                id: 'admin_1',
                email: email,
                name: 'Admin User',
                businessName: 'Avvai HQ',
                category: 'System',
                role: 'admin',
                planName: 'Unlimited'
            });
            navigate('/admin/dashboard');
        }, 500);
        return;
    }

    // 2. Check for Individual User (Demo)
    if (email.toLowerCase().includes('user')) {
        setTimeout(() => {
            login({
                id: 'ind_1',
                email: email,
                name: 'John Individual',
                role: 'individual',
                planName: 'Free'
            });
            navigate('/dashboard');
        }, 500);
        return;
    }

    // 3. Check for Existing Artist in Database
    const existingArtist = artists.find(a => a.email.toLowerCase() === email.toLowerCase());

    if (existingArtist && isLogin) {
        // Log in as the real artist found in the DB
        setTimeout(() => {
            login({
                id: existingArtist.id,
                email: existingArtist.email,
                name: existingArtist.name,
                businessName: existingArtist.businessName,
                category: existingArtist.category,
                role: 'artist',
                avatarUrl: `https://ui-avatars.com/api/?name=${existingArtist.name}&background=random`,
                planName: existingArtist.plan
            });
            navigate('/dashboard');
        }, 500);
    } else {
        // Fallback / Signup Simulation (Defaults to Artist)
        setTimeout(() => {
            login({
                id: 'new_user_' + Date.now(),
                email: email,
                name: isLogin ? 'Sarah Jenkins' : 'New User',
                businessName: 'Sarah J. Photography',
                category: 'Photography',
                role: 'artist',
                planName: 'Free'
            });
            navigate('/dashboard');
        }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-card-light dark:bg-card-dark rounded-2xl shadow-xl p-8 border border-border-light dark:border-border-dark">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
            <Bot size={24} />
          </div>
          <h1 className="text-2xl font-bold text-txt-primary-light dark:text-txt-primary-dark">
            {isLogin ? 'Welcome to Avvai' : 'Create an account'}
          </h1>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark mt-2">
            {isLogin ? 'Enter your details to access your account' : 'Get started with Avvai today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
             <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2.5 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-txt-primary-light dark:text-txt-primary-dark pl-10"
              />
              <span className="absolute left-3 top-3 text-txt-secondary-light dark:text-txt-secondary-dark">
                 <Bot size={20} /> 
              </span>
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-txt-secondary-light dark:text-txt-secondary-dark" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-txt-primary-light dark:text-txt-primary-dark"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-txt-secondary-light dark:text-txt-secondary-dark" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#333] border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-txt-primary-light dark:text-txt-primary-dark"
              required
            />
          </div>

          <Button type="submit" className="w-full justify-center" size="lg">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 p-3 bg-gray-50 dark:bg-white/5 rounded text-xs text-center text-txt-secondary-light dark:text-txt-secondary-dark border border-border-light dark:border-border-dark">
            <p className="font-semibold mb-1">Demo Login Info:</p>
            <p>Artist: <span className="font-mono text-primary-500">sarah@avvai.ai</span></p>
            <p>Individual: <span className="font-mono text-primary-500">user@avvai.ai</span></p>
            <p>Admin: <span className="font-mono text-primary-500">admin@avvai.ai</span></p>
            <p className="mt-1 text-[10px] opacity-70">Password: any</p>
        </div>
      </div>
    </div>
  );
};

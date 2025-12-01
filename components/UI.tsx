import React from 'react';
import clsx from 'clsx';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm border border-transparent',
    secondary: 'bg-card-light dark:bg-card-dark text-txt-primary-light dark:text-txt-primary-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5 shadow-sm',
    danger: 'bg-danger text-white hover:bg-red-700 shadow-sm border border-transparent',
    outline: 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Card
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx("bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm transition-colors duration-200", className)}>
    {children}
  </div>
);

// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-border-light dark:border-border-dark transition-colors duration-200">
        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <h3 className="text-lg font-semibold text-txt-primary-light dark:text-txt-primary-dark">{title}</h3>
          <button onClick={onClose} className="text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark">&times;</button>
        </div>
        <div className="p-6 text-txt-primary-light dark:text-txt-primary-dark">
          {children}
        </div>
      </div>
    </div>
  );
};

// Badge
export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'blue' }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  return (
    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", colors[color] || colors.gray)}>
      {children}
    </span>
  );
};
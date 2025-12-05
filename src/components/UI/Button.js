import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-400',
    secondary: 'bg-secondary-400/20 hover:bg-secondary-400/30 border border-secondary-400/40 hover:border-secondary-400/60 text-white shadow-lg hover:shadow-xl focus:ring-secondary-400/50',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-green-400',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl focus:ring-yellow-400',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-400',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-transparent hover:border-white/30 focus:ring-white/50',
    outline: 'bg-transparent border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/10 focus:ring-white/50',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 text-white shadow-glass hover:shadow-glass-lg focus:ring-white/50'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-5 text-xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  const iconClasses = `${iconSizes[size]} ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`;

  const LoadingSpinner = () => (
    <div className={`${iconSizes[size]} animate-spin mr-2`}>
      <div className="w-full h-full border-2 border-white/30 border-t-white rounded-full" />
    </div>
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className={iconClasses}>{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconClasses}>{icon}</span>
      )}
    </button>
  );
};

export const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-400',
    secondary: 'bg-secondary-400/20 hover:bg-secondary-400/30 border border-secondary-400/40 hover:border-secondary-400/60 text-white shadow-lg hover:shadow-xl focus:ring-secondary-400/50',
    ghost: 'bg-transparent hover:bg-white/10 text-white focus:ring-white/50',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 text-white shadow-glass hover:shadow-glass-lg focus:ring-white/50'
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  const LoadingSpinner = () => (
    <div className={`${iconSizes[size]} animate-spin`}>
      <div className="w-full h-full border-2 border-white/30 border-t-white rounded-full" />
    </div>
  );

  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? <LoadingSpinner /> : <span className={iconSizes[size]}>{icon}</span>}
    </button>
  );
};

export const FloatingActionButton = ({
  icon,
  onClick,
  className = '',
  size = 'lg',
  ...props
}) => {
  const sizes = {
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8'
  };

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 ${sizes[size]} bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-2xl hover:shadow-glow-lg transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 z-50 ${className}`}
      {...props}
    >
      <span className={iconSizes[size]}>{icon}</span>
    </button>
  );
};

export default Button;

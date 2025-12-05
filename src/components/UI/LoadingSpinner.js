import React from 'react';

const LoadingSpinner = ({ size = 'md', variant = 'default', text = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    default: 'border-white/30 border-t-white',
    primary: 'border-blue-200 border-t-blue-600',
    secondary: 'border-purple-200 border-t-purple-600',
    success: 'border-green-200 border-t-green-600',
    warning: 'border-yellow-200 border-t-yellow-600',
    danger: 'border-red-200 border-t-red-600'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Spinner principal */}
        <div
          className={`${sizeClasses[size]} border-4 rounded-full animate-spin ${variants[variant]}`}
        />
        
        {/* Spinner secundario para efecto de profundidad */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 rounded-full animate-spin ${variants[variant]} opacity-30`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
        
        {/* Punto central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'} bg-white/60 rounded-full animate-pulse`} />
        </div>
      </div>
      
      {text && (
        <div className="text-white/80 text-sm font-medium animate-pulse">
          {text}
        </div>
      )}
    </div>
  );
};

export const LoadingDots = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className="flex space-x-1">
      <div className={`${sizeClasses[size]} bg-white rounded-full animate-bounce`} />
      <div className={`${sizeClasses[size]} bg-white rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }} />
      <div className={`${sizeClasses[size]} bg-white rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }} />
    </div>
  );
};

export const LoadingPulse = ({ children, isLoading = true }) => {
  if (!isLoading) return children;

  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-white/20 rounded w-3/4"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
        <div className="h-4 bg-white/20 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export const LoadingSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-white/20 rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;

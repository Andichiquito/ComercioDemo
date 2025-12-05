import React from 'react';
import { FaArrowUp, FaArrowDown, FaArrowRight, FaChartBar, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const Card = ({
  children,
  variant = 'default',
  hover = false,
  glow = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';

  const variants = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass',
    solid: 'bg-white/95 border border-gray-200 shadow-lg',
    gradient: 'bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 shadow-glass',
    neon: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-neon'
  };

  const hoverClasses = hover ? 'hover:bg-white/15 hover:border-white/30 hover:shadow-glass-lg hover:-translate-y-1 hover:scale-[1.02]' : '';
  const glowClasses = glow ? 'shadow-glow hover:shadow-glow-lg' : '';

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-b border-white/20 ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-t border-white/20 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-bold text-gray-800 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-gray-600 text-sm ${className}`} {...props}>
    {children}
  </p>
);

// Componente de tarjeta con estadísticas
export const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  trend,
  className = '',
  ...props
}) => {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-white/60'
  };

  const trendIcons = {
    up: <FaArrowUp />,
    down: <FaArrowDown />,
    stable: <FaArrowRight />,
    neutral: <FaChartBar />
  };

  return (
    <Card hover glow className={`p-6 ${className}`} {...props}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/10 rounded-xl">
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <span className="text-sm">{trendIcons[trend]}</span>
            {change && (
              <span className={`text-sm font-semibold ${changeColors[changeType]}`}>
                {change}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-white/70 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </Card>
  );
};

// Componente de tarjeta con gráfico
export const ChartCard = ({
  title,
  children,
  actions,
  className = '',
  ...props
}) => (
  <Card hover className={`p-6 ${className}`} {...props}>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      {actions && (
        <div className="flex space-x-2">
          {actions}
        </div>
      )}
    </div>
    <div className="min-h-64 max-h-96 overflow-y-auto">
      {children}
    </div>
  </Card>
);

// Componente de tarjeta de perfil
export const ProfileCard = ({
  name,
  email,
  role,
  avatar,
  stats,
  actions,
  className = '',
  ...props
}) => (
  <Card hover className={`p-6 ${className}`} {...props}>
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
        {avatar || name?.charAt(0)?.toUpperCase()}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm">{email}</p>
        <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700 mt-1">
          {role}
        </span>
      </div>
    </div>
    
    {stats && (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    )}
    
    {actions && (
      <div className="flex space-x-2">
        {actions}
      </div>
    )}
  </Card>
);

// Componente de tarjeta de notificación
export const NotificationCard = ({
  title,
  message,
  type = 'info',
  time,
  onClose,
  className = '',
  ...props
}) => {
  const typeColors = {
    info: 'border-blue-400 bg-blue-500/10',
    success: 'border-green-400 bg-green-500/10',
    warning: 'border-yellow-400 bg-yellow-500/10',
    error: 'border-red-400 bg-red-500/10'
  };

  const typeIcons = {
    info: <FaInfoCircle />,
    success: <FaCheckCircle />,
    warning: <FaExclamationTriangle />,
    error: <FaTimesCircle />
  };

  return (
    <Card className={`p-4 border-l-4 ${typeColors[type]} ${className}`} {...props}>
      <div className="flex items-start space-x-3">
        <span className="text-lg">{typeIcons[type]}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="text-white/70 text-sm mt-1">{message}</p>
          {time && (
            <p className="text-white/50 text-xs mt-2">{time}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </Card>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
